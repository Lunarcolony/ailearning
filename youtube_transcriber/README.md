# 🎵 YouTube Audio Transcription Service for Raspberry Pi

A simple, easy-to-setup web service that allows you to identify YouTube videos and get their transcriptions. Perfect for running on a Raspberry Pi!

## 🌟 Features

- **🎤 Simple Web Interface**: Clean, user-friendly interface accessible from any device on your network
- **🔍 YouTube Video Search**: Find videos by entering keywords, lyrics, or titles
- **📝 Automatic Transcription**: Get full video transcripts with one click
- **🍓 Raspberry Pi Optimized**: Lightweight and designed to run smoothly on Raspberry Pi
- **🌐 Network Accessible**: Access from any device on your local network
- **⚡ Easy Setup**: One-command installation script

## 📋 Requirements

- Raspberry Pi (any model with network connectivity)
- Python 3.7 or higher
- Internet connection
- 500MB free disk space

## 🚀 Quick Setup Guide

### Option 1: Automated Setup (Recommended)

1. **Clone or Download** this project to your Raspberry Pi:
   ```bash
   git clone https://github.com/Lunarcolony/ailearning.git
   cd ailearning/youtube_transcriber
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
   - From Raspberry Pi: http://localhost:5000
   - From other devices: http://YOUR_PI_IP:5000

### Option 2: Manual Setup

1. **Install dependencies**:
   ```bash
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

1. **Open the web interface** in your browser
2. **Enter search keywords** (e.g., song lyrics, video title, channel name)
3. **Click "Search Videos"** to find matching YouTube videos
4. **Select a video** from the results
5. **Click "Get Transcript"** to view the full transcription

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

1. Find your Raspberry Pi's IP address:
   ```bash
   hostname -I
   ```

2. Open a browser on any device and go to:
   ```
   http://YOUR_PI_IP:5000
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
- Verify Raspberry Pi is connected to the network
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
youtube_transcriber/
├── server.py              # Flask server (main application)
├── templates/
│   └── index.html        # Web interface
├── static/               # Static files (if any)
├── requirements.txt      # Python dependencies
├── setup.sh             # Automated setup script
└── README.md            # This file
```

## 🔒 Security Notes

- This service is designed for **local network use only**
- Do not expose it directly to the internet without proper security measures
- Consider using a reverse proxy (nginx) if you need external access
- Keep your Raspberry Pi's system and packages updated

## 🐛 Known Limitations

- **Audio Fingerprinting**: The current version uses text-based search rather than audio fingerprinting. To identify videos, you need to enter keywords/lyrics rather than playing audio
- **Transcript Availability**: Only works with videos that have captions/subtitles enabled
- **Rate Limiting**: YouTube may rate-limit requests if too many are made quickly

## 🔮 Future Enhancements

- [ ] Add actual audio fingerprinting using Dejavu or similar
- [ ] Implement speech-to-text for live audio analysis
- [ ] Add support for multiple languages
- [ ] Cache transcripts for faster retrieval
- [ ] Add download transcript feature
- [ ] Mobile-responsive improvements

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is part of the ailearning repository. See the main repository for license information.

## 💡 Tips for Best Results

1. **Be specific** with search terms - use unique phrases from the video
2. **Use quotes** from the video's dialogue or lyrics
3. **Include channel name** if you know it
4. **Try different keywords** if first search doesn't work

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the application logs
3. Open an issue on GitHub with details

---

**Enjoy your YouTube Transcription Service! 🎉**

Made with ❤️ for Raspberry Pi enthusiasts
