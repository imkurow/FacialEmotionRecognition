const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const snapButton = document.getElementById("capture");
const uploadButton = document.getElementById("upload");

// Access the camera
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Error accessing the camera: ", err);
  });

// Capture the image
snapButton.addEventListener("click", () => {
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
});

// Upload the captured image
uploadButton.addEventListener("click", () => {
  const imageData = canvas.toDataURL("image/jpeg");
  const form = new FormData();
  form.append("image", imageData);

  fetch("/capture", {
    method: "POST",
    body: new URLSearchParams({ image: imageData }),
  })
    .then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      }
    })
    .catch((err) => {
      console.error("Error uploading the image: ", err);
    });
});
