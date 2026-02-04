#!/usr/bin/env python3
"""
YouTube Audio Transcription Server
A Flask server that identifies YouTube videos from audio and returns transcripts

Key Dependencies:
- yt_dlp: Modern YouTube extractor that's actively maintained and handles API changes.
  Replaced web scraping approach for more reliable video searching and metadata extraction.
- youtube_transcript_api: Reliable library for fetching video transcripts.
- Flask: Lightweight web framework for the REST API.
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import os
import tempfile
import base64
from youtube_transcript_api import YouTubeTranscriptApi
import yt_dlp
import logging
import json
import requests
from pydub import AudioSegment
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Configuration
UPLOAD_FOLDER = tempfile.gettempdir()
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size


@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')


@app.route('/api/identify-from-audio', methods=['POST'])
def identify_from_audio():
    """
    Identify YouTube video from recorded audio using AudD.io API
    Falls back to keyword search if audio recognition fails
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        audio_data = data.get('audioData')
        search_query = data.get('searchQuery', '')
        
        # If audio data is provided, try audio recognition first
        if audio_data:
            logger.info("Attempting audio recognition...")
            try:
                # Decode base64 audio
                audio_bytes = base64.b64decode(audio_data.split(',')[1] if ',' in audio_data else audio_data)
                
                # Save to temporary file
                temp_audio_path = os.path.join(tempfile.gettempdir(), f"audio_{uuid.uuid4()}.webm")
                with open(temp_audio_path, 'wb') as f:
                    f.write(audio_bytes)
                
                # Try AudD.io API (free tier - limited requests)
                # Note: Using a public demo API key - users should get their own from https://audd.io/
                audd_result = recognize_audio_with_audd(temp_audio_path)
                
                # Clean up temp file
                try:
                    os.remove(temp_audio_path)
                except:
                    pass
                
                if audd_result:
                    logger.info(f"Audio recognized: {audd_result}")
                    # Use the recognized title/artist as search query
                    search_query = audd_result
                else:
                    logger.info("Audio recognition failed, falling back to search query")
                    if not search_query:
                        return jsonify({'error': 'Could not identify audio and no search query provided'}), 400
                        
            except Exception as audio_error:
                logger.error(f"Audio recognition error: {str(audio_error)}")
                if not search_query:
                    return jsonify({'error': f'Audio recognition failed: {str(audio_error)}'}), 500
        
        # Use search query (either from audio recognition or user input)
        if not search_query:
            return jsonify({'error': 'Please provide a search query or record audio'}), 400
        
        logger.info(f"Searching for: {search_query}")
        
        # Use yt-dlp for more reliable YouTube search
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
            'force_generic_extractor': False,
            'default_search': 'ytsearch5',  # Search for 5 results
            'skip_download': True,
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # Search for videos
                search_results = ydl.extract_info(f"ytsearch5:{search_query}", download=False)
                
                if not search_results or 'entries' not in search_results:
                    return jsonify({'error': 'No videos found'}), 404
                
                unique_videos = []
                for entry in search_results['entries']:
                    if entry and entry.get('id'):
                        video_id = entry['id']
                        title = entry.get('title', 'Unknown Title')
                        channel = entry.get('uploader', 'Unknown Channel')
                        duration = entry.get('duration', 0)
                        
                        # Format duration
                        if duration:
                            minutes = duration // 60
                            seconds = duration % 60
                            duration_str = f"{minutes}:{seconds:02d}"
                        else:
                            duration_str = "N/A"
                        
                        unique_videos.append({
                            'id': video_id,
                            'title': title,
                            'channel': channel,
                            'duration': duration_str,
                            'thumbnail': f'https://img.youtube.com/vi/{video_id}/default.jpg',
                            'link': f'https://www.youtube.com/watch?v={video_id}'
                        })
                
                if not unique_videos:
                    return jsonify({'error': 'No videos found'}), 404
                
                return jsonify({
                    'success': True,
                    'videos': unique_videos
                })
            
        except Exception as e:
            logger.error(f"Error searching YouTube: {str(e)}")
            return jsonify({'error': f'Failed to search YouTube: {str(e)}'}), 500
        
    except Exception as e:
        logger.error(f"Error identifying audio: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/transcript/<video_id>', methods=['GET'])
def get_transcript(video_id):
    """
    Get transcript for a YouTube video with improved error handling
    """
    try:
        logger.info(f"Fetching transcript for video: {video_id}")
        
        # Try to fetch the transcript with error handling
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        except Exception as transcript_error:
            # If default language fails, try to get list of available transcripts
            try:
                transcript_list_data = YouTubeTranscriptApi.list_transcripts(video_id)
                # Try to get the first available transcript
                transcript = transcript_list_data.find_transcript(['en', 'en-US', 'en-GB'])
                transcript_list = transcript.fetch()
            except Exception:
                # If that also fails, try to get any available transcript
                try:
                    transcript_list_data = YouTubeTranscriptApi.list_transcripts(video_id)
                    # Get any available transcript
                    for transcript in transcript_list_data:
                        try:
                            transcript_list = transcript.fetch()
                            break
                        except Exception:
                            continue
                    else:
                        raise transcript_error
                except Exception as e:
                    logger.error(f"Could not fetch any transcript: {str(e)}")
                    raise transcript_error
        
        # Format the transcript
        full_transcript = ' '.join([entry['text'] for entry in transcript_list])
        
        return jsonify({
            'success': True,
            'videoId': video_id,
            'transcript': full_transcript,
            'segments': transcript_list
        })
        
    except Exception as e:
        logger.error(f"Error fetching transcript: {str(e)}")
        error_message = str(e)
        
        # Provide helpful error messages
        if 'Subtitles are disabled' in error_message or 'No transcripts' in error_message or 'Could not retrieve' in error_message:
            error_message = 'This video does not have captions/subtitles available. Please try a different video.'
        elif 'Video unavailable' in error_message:
            error_message = 'This video is unavailable or has been removed.'
        elif 'Private video' in error_message:
            error_message = 'This video is private and transcripts cannot be accessed.'
        
        return jsonify({
            'success': False,
            'error': error_message
        }), 404


def recognize_audio_with_audd(audio_file_path):
    """
    Recognize audio using AudD.io API
    Returns search query string if successful, None otherwise
    """
    try:
        # Note: This uses AudD.io's API. For production, get your own API key from https://audd.io/
        # Free tier: 50 requests per day
        api_url = "https://api.audd.io/"
        
        # Try to identify the audio
        with open(audio_file_path, 'rb') as audio_file:
            files = {'file': audio_file}
            data = {
                'api_token': 'test',  # Using test token - get your own from https://audd.io/
                'return': 'timecode,apple_music,spotify'
            }
            
            response = requests.post(api_url, data=data, files=files, timeout=30)
            result = response.json()
            
            if result.get('status') == 'success' and result.get('result'):
                result_data = result['result']
                title = result_data.get('title', '')
                artist = result_data.get('artist', '')
                
                if title:
                    # Create search query from title and artist
                    search_parts = [title]
                    if artist:
                        search_parts.append(artist)
                    return ' '.join(search_parts)
        
        return None
    except Exception as e:
        logger.error(f"AudD.io recognition error: {str(e)}")
        return None


@app.route('/api/identify', methods=['POST'])
def identify_audio():
    """
    Legacy endpoint - kept for backward compatibility
    Identify YouTube video from search query using yt-dlp
    """
    try:
        data = request.get_json()
        
        if not data or 'audio' not in data:
            return jsonify({'error': 'No audio data provided'}), 400
        
        search_query = data.get('searchQuery', '')
        
        if not search_query:
            return jsonify({'error': 'Please provide a search query'}), 400
        
        logger.info(f"Searching for: {search_query}")
        
        # Use yt-dlp for more reliable YouTube search
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
            'force_generic_extractor': False,
            'default_search': 'ytsearch5',  # Search for 5 results
            'skip_download': True,
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # Search for videos
                search_results = ydl.extract_info(f"ytsearch5:{search_query}", download=False)
                
                if not search_results or 'entries' not in search_results:
                    return jsonify({'error': 'No videos found'}), 404
                
                unique_videos = []
                for entry in search_results['entries']:
                    if entry and entry.get('id'):
                        video_id = entry['id']
                        title = entry.get('title', 'Unknown Title')
                        channel = entry.get('uploader', 'Unknown Channel')
                        duration = entry.get('duration', 0)
                        
                        # Format duration
                        if duration:
                            minutes = duration // 60
                            seconds = duration % 60
                            duration_str = f"{minutes}:{seconds:02d}"
                        else:
                            duration_str = "N/A"
                        
                        unique_videos.append({
                            'id': video_id,
                            'title': title,
                            'channel': channel,
                            'duration': duration_str,
                            'thumbnail': f'https://img.youtube.com/vi/{video_id}/default.jpg',
                            'link': f'https://www.youtube.com/watch?v={video_id}'
                        })
                
                if not unique_videos:
                    return jsonify({'error': 'No videos found'}), 404
                
                return jsonify({
                    'success': True,
                    'videos': unique_videos
                })
            
        except Exception as e:
            logger.error(f"Error searching YouTube: {str(e)}")
            return jsonify({'error': f'Failed to search YouTube: {str(e)}'}), 500
        
    except Exception as e:
        logger.error(f"Error identifying audio: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'YouTube Transcription Service is running'
    })


if __name__ == '__main__':
    # Run on all interfaces so it's accessible from other devices on the network
    # This is important for Raspberry Pi deployment
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
