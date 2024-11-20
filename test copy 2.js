const video = document.getElementById('video');
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const canvas3 = document.getElementById('canvas3');
const canvas4 = document.getElementById('canvas4');
const startButton = document.getElementById('startButton');
const captureButton = document.getElementById('capture');
const swapButton = document.getElementById('swapBackground');
const photoTb = document.getElementById('photoTb');
const clearButton = document.getElementById('clearCanvas');

let canvasArray = [canvas1, canvas2, canvas3, canvas4];
let currentCanvas = 0;
let allDetectedEmotions = [];


// Start Camera
startButton.addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
});

// Capture Image
captureButton.addEventListener('click', async () => {
    // Check if all canvases are filled
    if (currentCanvas >= canvasArray.length) {
      alert("All canvases are filled!");
      return;
    }
  
    const canvas = canvasArray[currentCanvas];
    const ctx = canvas.getContext('2d');
  
    // Get video frame size
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
  
    // Get canvas size
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
  
    // Calculate the cropping area to fit the canvas dimensions
    let cropX = 0;
    let cropY = 0;
    let cropWidth = videoWidth;
    let cropHeight = videoHeight;
  
    // If the video is wider than the canvas, crop the width from the center
    if (videoWidth / videoHeight > canvasWidth / canvasHeight) {
      cropWidth = videoHeight * canvasWidth / canvasHeight;
      cropX = (videoWidth - cropWidth) / 2;
    } else {
      // If the video is taller than the canvas, crop the height from the center
      cropHeight = videoWidth * canvasHeight / canvasWidth;
      cropY = (videoHeight - cropHeight) / 2;
    }
  
    // Flip the image horizontally before drawing it
    ctx.save(); // Save the current state of the context
    ctx.scale(-1, 1); // Flip horizontally by scaling the x-axis by -1
    ctx.translate(-canvasWidth, 0); // Translate to maintain the canvas position
  
    // Draw the cropped and flipped video frame onto the canvas
    ctx.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, canvasWidth, canvasHeight);
  
    ctx.restore(); // Restore the context to its original state
  
    // Convert canvas to Base64 image
    const imageData = canvas.toDataURL('image/jpeg');
  
    // Send image to Flask backend
    const response = await fetch('http://127.0.0.1:5000/process', {
      method: 'POST',
      body: JSON.stringify({ image: imageData }),
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (!response.ok) {
      console.error('Failed to fetch processed image:', response.statusText);
      return;
    }
  
    const result = await response.json();
    const dominantEmotions = result.dominant_emotions;
    const overallEmotion = result.overall_dominant_emotion;
    console.log('Backend Response:', result);
    console.log(`Dominant Emotions for Each Face: ${dominantEmotions.join(", ")}`);
    console.log(`Overall Dominant Emotion: ${overallEmotion}`);
  
    // Update canvas with processed image (draw bounding boxes and emotions)
    const processedImage = new Image();
    processedImage.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing the new image
      ctx.drawImage(processedImage, 0, 0, canvas.width, canvas.height); // Draw processed image
    };
    processedImage.src = result.processed_image;
  
    // Increment to move to the next canvas
    currentCanvas++;
  });
  swapButton.addEventListener("click", function() {
    // Get the parent div by its ID
    const canvasContainer = document.getElementById("canvasContainer");
    
    // Check the current background color and toggle
    if (canvasContainer) {
        const currentColor = canvasContainer.style.backgroundColor;
        canvasContainer.style.backgroundColor = currentColor === "white" ? "black" : "white";
        photoTb.style.color = currentColor === "white" ? "black" : "white";
    }
});
clearButton.addEventListener('click', () => {
    // Loop through all canvases in the canvasArray
    canvasArray.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      // Clear the canvas by resetting its content
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  
    // Reset the currentCanvas index
    currentCanvas = 0;
  
    alert('All canvases have been cleared!');
  });