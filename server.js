const express = require('express');
const Stream = require('node-rtsp-stream');
const cors = require('cors');

const app = express();
const PORT = 3700;

// Use CORS middleware
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
  }));

// RTSP Stream URL
const RTSP_URL = 'rtsp://admin:1234@192.168.1.27:5543/051c6519288cc2d8b07f026902be8c96/live/channel0';

// Initialize the RTSP stream
const stream = new Stream({
  name: 'name',
  streamUrl: RTSP_URL,
  wsPort: 9999, // WebSocket port for streaming
  ffmpegOptions: { // Options for ffmpeg
    '-stats': '', // Show stats
    '-r': 30, // Frame rate
    '-s': '640x480' // Size of the video
  }
});

// Serve the HTML page to display the video
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <link href="https://vjs.zencdn.net/7.10.2/video-js.css" rel="stylesheet" />
        <script src="https://vjs.zencdn.net/7.10.2/video.min.js"></script>
      </head>
      <body>
        <h1>RTSP Stream</h1>
        <video id="video" class="video-js vjs-default-skin" controls autoplay width="640" height="480">
          <source src="ws://192.168.1.26:9999" type="application/x-mpegURL">
          Your browser does not support the video tag.
        </video>
        <script>
          var player = videojs('video');
          player.src({
            src: 'ws://192.168.1.26:9999',
            type: 'application/x-mpegURL'
          });
        </script>
      </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});