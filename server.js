const express = require('express');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const PORT = 3700;

// RTSP Stream URL
const RTSP_URL = 'rtsp://admin:1234@192.168.1.27:5543/051c6519288cc2d8b07f026902be8c96/live/channel0';

// Route to serve the video stream
app.get('/stream', (req, res) => {
  res.contentType('mp4');

  // Use FFmpeg to transcode the RTSP stream
  ffmpeg(RTSP_URL)
    .addOption('-re') // Read input at native frame rate
    .addOption('-c:v libx264') // Use H.264 codec
    .addOption('-f mp4') // Output format
    .on('start', commandLine => {
      console.log('FFmpeg process started:', commandLine);
    })
    .on('error', (err) => {
      console.error('Error:', err);
      res.sendStatus(500);
    })
    .pipe(res, { end: true });
});

// Serve the HTML page to display the video
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>RTSP Stream</h1>
        <video id="video" width="640" height="480" controls autoplay>
          <source src="/stream" type="video/mp4">
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
