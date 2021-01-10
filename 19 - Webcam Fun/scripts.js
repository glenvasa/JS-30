const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error(`OH NO!!!`, err);
        })
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height)
        // mess with them
        // pixels = redEffect(pixels)

        // pixels = rgbSplit(pixels)
        // ctx.globalAlpha = 0.1;

        // pixels = greenScreen(pixels)
        // put them back
        ctx.putImageData(pixels, 0, 0)

    }, 16);

}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    // take the date out of the canvas
    const data = canvas.toDataURL('image/jpeg')
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome')
    link.innerHTML = `<img src="${data}" alt="handsome man"/>`
    strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels){
    // using for loop instead of map because this is a special kind of array that doesn't have all methods available
    // for every 4 pixels has there is an r,g,b, & a pixel
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
}

function rgbSplit(pixels){
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // RED
        pixels.data[i + 100] = pixels.data[i + 1]; // GREEN
        pixels.data[i - 250] = pixels.data[i + 2]; // Blue
    }
    return pixels;
}

function greenScreen (pixels) {
    const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      // b/c the 4th pixel (alpha) if set to 0 is completely transparent
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo()

// once webcam starts playing through getVideo() it emits an event called 'canplay'
video.addEventListener('canplay', paintToCanvas)