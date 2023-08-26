const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, idx) => {
    if (idx === index) {
      slide.style.display = 'block';
    } else {
      slide.style.display = 'none';
    }
  });
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Initial setup
window.addEventListener("load", function() {
    showSlide(currentSlide);
  });

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);