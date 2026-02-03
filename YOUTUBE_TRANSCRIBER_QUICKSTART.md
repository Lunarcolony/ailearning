# YouTube Audio Transcription Service - Quick Start

## 🎯 What is this?

A simple web application that can be hosted on your Raspberry Pi to identify and transcribe YouTube videos. Users can search for videos using keywords and get full transcriptions with just a few clicks!

## 📸 Screenshot

![YouTube Transcription Interface](https://github.com/user-attachments/assets/117287f6-3cd7-4737-b95e-b8a3169fa963)

## 🚀 Quick Start

### 1. Navigate to the project directory:
```bash
cd youtube_transcriber
```

### 2. Run the setup script:
```bash
./setup.sh
```

### 3. Start the server:
```bash
source venv/bin/activate
python server.py
```

### 4. Access the web interface:
- **From Raspberry Pi**: http://localhost:5000
- **From other devices**: http://YOUR_PI_IP:5000
  (Replace YOUR_PI_IP with your Raspberry Pi's IP address)

## 📖 How to Use

1. Open the web interface in your browser
2. Enter keywords or phrases from the YouTube video you want to find
3. Click "Search Videos" to see matching results
4. Select a video from the list
5. Click "Get Transcript" to view the full transcription

## 🔧 Features

- ✅ Beautiful, responsive web interface
- ✅ YouTube video search
- ✅ Automatic transcript retrieval
- ✅ Easy Raspberry Pi setup
- ✅ Network accessible from any device
- ✅ Simple one-command installation

## 📚 Full Documentation

For detailed documentation, troubleshooting, and advanced configuration, see:
- [Full README](youtube_transcriber/README.md)

## 🐛 Troubleshooting

### Can't access from other devices?
1. Find your Pi's IP: `hostname -I`
2. Check firewall: `sudo ufw allow 5000`
3. Make sure both devices are on the same network

### Service won't start?
1. Check if port is in use: `sudo lsof -i :5000`
2. Try a different port: `export PORT=8080 && python server.py`

### No transcript available?
- Some videos don't have captions enabled
- Try a different video that has subtitles

## 🆘 Need Help?

Check the [full documentation](youtube_transcriber/README.md) or open an issue on GitHub.

---

**Enjoy your YouTube Transcription Service! 🎉**
