# 🎵 YouTube Audio Transcription Service

A simple, easy-to-setup web service that allows you to identify YouTube videos from audio recordings and get their transcriptions. Perfect for running on a Raspberry Pi!

## 🌟 Features

- **🎙️ Audio Recording**: Record audio directly from your browser to identify YouTube videos
- **🎯 Audio Fingerprinting**: Automatically identifies videos by recording ~20 seconds of audio
- **🎤 Simple Web Interface**: Clean, user-friendly interface accessible from any device on your network
- **🔍 Dual Search Methods**: Find videos by recording audio OR entering keywords/lyrics
- **📝 Automatic Transcription**: Get full video transcripts with one click
- **🌐 Multi-Language Support**: Automatically tries multiple languages when fetching transcripts
- **🛡️ Robust Error Handling**: Improved error messages and fallback mechanisms
- **🍓 Raspberry Pi Optimized**: Lightweight and designed to run smoothly on Raspberry Pi
- **🌐 Network Accessible**: Access from any device on your local network
- **⚡ Easy Setup**: One-command installation script

## 📸 Screenshots

### Main Interface with Audio Recording
![YouTube Transcription Interface with Audio Recording](https://github.com/user-attachments/assets/011aa63c-fae4-4b01-95f6-faa6f8a5543f)

## 📋 Requirements

- Python 3.7 or higher
- Internet connection
- 500MB free disk space
- Works on: Raspberry Pi, Linux, macOS, Windows

## 🚀 Quick Setup Guide

### Option 1: Automated Setup (Recommended)

1. **Clone or Download** this project:
   ```bash
   git clone https://github.com/Lunarcolony/ailearning.git
   cd ailearning
   ```

2. **Run the setup script**:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start the service**:
   ```bash
   source venv/bin/activate
   python server.py
   ```

4. **Access the web interface**:
   - From local machine: http://localhost:5000
   - From other devices: http://YOUR_IP:5000

### Option 2: Manual Setup

1. **Install dependencies**:
   ```bash
   # On Linux/Raspberry Pi
   sudo apt-get update
   sudo apt-get install -y python3 python3-pip python3-venv
   ```

2. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python packages**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**:
   ```bash
   python server.py
   ```

## 📖 How to Use

### Option 1: Record Audio (Recommended for Identifying Videos)

1. **Open the web interface** in your browser
2. **Click "🎤 Start Recording (20s)"** button
3. **Play a YouTube video** in another tab or device (or from any source)
4. **Let it record for ~20 seconds** - the timer will count down automatically
5. The service will automatically identify the video and show results
6. **Select a video** from the results
7. **Click "Get Transcript"** to view the full transcription

### Option 2: Search by Keywords (Traditional Method)

1. **Open the web interface** in your browser
2. **Enter search keywords** (e.g., song lyrics, video title, channel name)
3. **Click "Search Videos"** to find matching YouTube videos
4. **Select a video** from the results
5. **Click "Get Transcript"** to view the full transcription

**Note:** Audio identification uses the AudD.io API (free tier: 50 requests/day). For production use, get your own API key from https://audd.io/

## 🔧 Configuration

### Changing the Port

By default, the service runs on port 5000. To change it:

```bash
export PORT=8080
python server.py
```

### Auto-start on Boot (Optional)

The setup script offers to create a systemd service. If you chose not to during setup, you can do it manually:

```bash
sudo systemctl enable youtube-transcriber.service
sudo systemctl start youtube-transcriber.service
```

## 🌐 Network Access

To access from other devices on your network:

1. Find your machine's IP address:
   ```bash
   hostname -I
   ```

2. Open a browser on any device and go to:
   ```
   http://YOUR_IP:5000
   ```

3. Make sure port 5000 is open (check firewall settings):
   ```bash
   sudo ufw allow 5000
   ```

## 🛠️ Troubleshooting

### Service won't start
- Check if port 5000 is already in use:
  ```bash
  sudo lsof -i :5000
  ```
- Try a different port (see Configuration section)

### Can't access from other devices
- Verify machine is connected to the network
- Check firewall settings:
  ```bash
  sudo ufw status
  ```
- Make sure both devices are on the same network

### "No transcript available" error
- Some YouTube videos don't have captions/subtitles
- Try a different video with captions enabled

### Dependencies installation fails
- Update pip:
  ```bash
  pip install --upgrade pip
  ```
- Install system dependencies:
  ```bash
  sudo apt-get install -y python3-dev build-essential
  ```

## 📁 Project Structure

```
ailearning/
├── server.py              # Flask server (main application)
├── templates/
│   └── index.html        # Web interface
├── requirements.txt      # Python dependencies
├── setup.sh             # Automated setup script
└── README.md            # This file
```

## 🔒 Security Notes

- This service is designed for **local network use only**
- Do not expose it directly to the internet without proper security measures
- Consider using a reverse proxy (nginx) if you need external access
- Keep your system and packages updated

## 🐛 Known Limitations

- **Audio Recognition API**: Uses AudD.io free tier (50 requests/day) - get your own API key for production use
- **Transcript Availability**: Only works with videos that have captions/subtitles enabled
- **Rate Limiting**: YouTube may rate-limit requests if too many are made quickly
- **Audio Quality**: Best results with clear audio; background noise may affect recognition accuracy

## 🎉 Recent Improvements

### Version 3.0 (Latest - Major Feature Update)
- ✅ **NEW: Audio Recording Feature** - Record audio directly from your browser
- ✅ **NEW: Audio Fingerprinting** - Automatically identify YouTube videos from ~20 seconds of audio
- ✅ **NEW: Dual Input Methods** - Choose between audio recording or keyword search
- ✅ **AudD.io Integration** - Professional audio recognition API for accurate video identification
- ✅ **Enhanced UI** - Intuitive recording interface with countdown timer
- ✅ **Smart Fallback** - Falls back to keyword search if audio recognition fails

### Version 2.0
- ✅ **Replaced web scraping with yt-dlp**: More reliable YouTube search that works consistently
- ✅ **Enhanced error handling**: Better error messages and automatic fallback for transcripts
- ✅ **Multi-language support**: Automatically tries different languages when fetching transcripts
- ✅ **Improved reliability**: Fixed "sometimes not working" issues with YouTube API
- ✅ **Better metadata**: Now shows actual video duration and channel information

## 🔮 Future Enhancements

- [x] ~~Add actual audio fingerprinting capability~~ ✅ Completed in v3.0
- [ ] Implement speech-to-text for live audio analysis
- [ ] Support for custom AudD.io API keys in UI
- [ ] Cache transcripts for faster retrieval
- [ ] Add download transcript feature (TXT, SRT, JSON formats)
- [ ] Mobile-responsive improvements
- [ ] Audio waveform visualization during recording

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 💡 Tips for Best Results

### For Audio Recording:
1. **Record clear audio** - minimize background noise for better recognition
2. **Record 15-20 seconds** - let the full recording complete for best accuracy
3. **Use good volume** - not too loud (distorted) or too quiet
4. **Music works best** - songs and music videos are most reliably identified
5. **Try multiple times** - if first attempt fails, try recording a different part of the video

### For Keyword Search:
1. **Be specific** with search terms - use unique phrases from the video
2. **Use quotes** from the video's dialogue or lyrics
3. **Include channel name** if you know it
4. **Try different keywords** if first search doesn't work

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the application logs
3. Open an issue on GitHub with details

## 📝 License

This project is open source and available under the MIT License.

---

**Enjoy your YouTube Transcription Service! 🎉**

Made with ❤️ for the community
