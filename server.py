#!/usr/bin/env python3
"""
YouTube Audio Transcription Server
A Flask server that identifies YouTube videos from audio and returns transcripts
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import os
import tempfile
import base64
from youtube_transcript_api import YouTubeTranscriptApi
import requests
import re
import logging

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


@app.route('/api/identify', methods=['POST'])
def identify_audio():
    """
    Identify YouTube video from search query
    """
    try:
        data = request.get_json()
        
        if not data or 'audio' not in data:
            return jsonify({'error': 'No audio data provided'}), 400
        
        search_query = data.get('searchQuery', '')
        
        if not search_query:
            return jsonify({'error': 'Please provide a search query'}), 400
        
        logger.info(f"Searching for: {search_query}")
        
        # Search YouTube using web scraping
        search_url = f"https://www.youtube.com/results?search_query={requests.utils.quote(search_query)}"
        
        try:
            response = requests.get(search_url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }, timeout=10)
            
            # Extract video IDs from the response
            video_ids = re.findall(r'"videoId":"([^"]+)"', response.text)
            video_titles = re.findall(r'"title":{"runs":\[{"text":"([^"]+)"}', response.text)
            
            # Remove duplicates while preserving order
            seen = set()
            unique_videos = []
            for vid_id, title in zip(video_ids[:10], video_titles[:10]):
                if vid_id not in seen and len(vid_id) == 11:  # YouTube video IDs are 11 chars
                    seen.add(vid_id)
                    unique_videos.append({
                        'id': vid_id,
                        'title': title,
                        'channel': 'YouTube',
                        'duration': 'N/A',
                        'thumbnail': f'https://img.youtube.com/vi/{vid_id}/default.jpg',
                        'link': f'https://www.youtube.com/watch?v={vid_id}'
                    })
                    if len(unique_videos) >= 5:
                        break
            
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
    Get transcript for a YouTube video
    """
    try:
        logger.info(f"Fetching transcript for video: {video_id}")
        
        # Fetch the transcript
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        
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
        if 'Subtitles are disabled' in error_message or 'No transcripts' in error_message:
            error_message = 'This video does not have captions/subtitles available.'
        
        return jsonify({
            'success': False,
            'error': error_message
        }), 404


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
