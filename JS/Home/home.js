const images = [
    "src/Images/Components.jpg",
    "src/Images/Components2.png",
    "src/Images/Components3.jpg",
]

const image = document.getElementById("home-container-image");

let currentImage = 0;

const intervalTime = 4000;

function changeImage() {
    
    image.style.opacity = 0;
  
    setTimeout(() => {
      
      currentImage = (currentImage + 1) % images.length;
    image.src = images[currentImage];
  
    
      image.style.opacity = 1;
    }, 1000);
  }
  
  
  setInterval(changeImage, intervalTime);