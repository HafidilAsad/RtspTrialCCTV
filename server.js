const express = require('express');
const Stream = require('node-rtsp-stream');

const app = express();
const PORT = 3700;

// RTSP Stream URL
const rtspUrl = 'rtsp://admin:1234@192.168.1.27:5543/051c6519288cc2d8b07f026902be8c96/live/channel0';

// Create a new RTSP stream
const stream = new Stream({
  name: 'RTSP Stream',
  streamUrl: rtspUrl,
  wsPort: 9999,
  ffmpegOptions: { // options ffmpeg flags
    '-stats': '', // an option with a blank string is a flag
    '-r': 30,     // Set the frame rate
    '-s': '640x480' // Set the resolution
  }
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>RTSP Stream</title>
      <style>
        video {
          width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      <h1>RTSP Stream</h1>
      <video id="video" controls autoplay></video>
      <script>
        const video = document.getElementById('video');
        const ws = new WebSocket('ws://192.168.1.26:9999');

        ws.onmessage = function(event) {
          const blob = new Blob([event.data], { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          video.src = url;
        };
      </script>
    </body>
    </html>
  `);
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});