let index = 0;
function nextImage() {
const slides = document.querySelectorAll('.slide');
index = (index + 1) % slides.length;
document.querySelector('.carousel-images').style.transform = `translateX(-${index * 100}%)`;
}
setInterval(nextImage, 3000);