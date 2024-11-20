const video = document.getElementById('video');
const startButton = document.getElementById('startButton');
const captureButton = document.getElementById('capture');
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const canvas3 = document.getElementById('canvas3');
const context1 = canvas1.getContext('2d');
const context2 = canvas2.getContext('2d');
const context3 = canvas3.getContext('2d');

let photoCount = 0;

// Start Camera
startButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error('Error accessing camera: ', err);
  }
});

// Capture Photo
captureButton.addEventListener('click', () => {
  if (photoCount === 0) {
    captureImage(canvas1, context1);
  } else if (photoCount === 1) {
    captureImage(canvas2, context2);
  } else if (photoCount === 2) {
    captureImage(canvas3, context3);
  }
  photoCount = (photoCount + 1) % 3; // Loop through photos (0, 1, 2)
});

function captureImage(canvas, context) {
  // Set canvas dimensions to match the video
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.save(); // Save the current canvas state
  context.translate(canvas.width, 0); // Move the context to the right edge
  context.scale(-1, 1); // Flip horizontally

  // Draw the current frame of the video onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
}
