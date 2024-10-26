const express = require('express');
const Stream = require('node-rtsp-stream');
const cors = require('cors');

const app = express();
const PORT = 3700;

// Use CORS middleware
app.use(cors());

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
      <body>
        <h1>RTSP Stream</h1>
        <video id="video" width="640" height="480" controls autoplay>
          <source src="ws://192.168.1.26:9999" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});