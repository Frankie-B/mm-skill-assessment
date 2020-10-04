let select = s => document.querySelector(s),
  selectAll = s => document.querySelectorAll(s),
  carousel = select('.carousel-group'),
  carouselItems = selectAll('.carousel-item'),
  carouselItemIndex = selectAll('.carousel-item').length,
  prev = select('.prev'),
  next = select('.next');


// Counter to keep track of image number in the carousel.
let counter = 1;

// Assigning the width of a single image.
let imgSize = carouselItems[0].clientWidth;

// Default start position on image, when this is call it will move one image forward in the carousel.
carousel.style.transform = 'translateX( ' + (-imgSize * counter) + 'px)';

// Event listeners for clicks on buttons.
next.addEventListener('click', () => {
  if (counter >= carouselItems.length - 1) return; // prevents transitionend event listener from breaking when rapidly clicking button.
  carousel.style.transition = 'transform 0.7s ease-in-out';
  counter++; // increment counter.
  carousel.style.transform = 'translateX( ' + (-imgSize * counter) + 'px)';
});

prev.addEventListener('click', () => {
  if (counter <= 0) return; // prevents transitionend event listener from breaking when rapidly clicking button.
  carousel.style.transition = 'transform 0.7s ease-in-out';
  counter--; // decrement counter.
  carousel.style.transform = 'translateX( ' + (-imgSize * counter) + 'px)';
});

// Event listener to trigger when a transition completes.
carousel.addEventListener('transitionend', () => { 
  // Infinite scroll effect when clicking the prev button.
  if (carouselItems[counter].id === 'carousel-item-last') {
    carousel.style.transition = 'none'; // removes the transition effect while the image jumps into position for the infinite scroll effect.
    counter = carouselItems.length - 2; // jumps to the duplicate image for infinite scroll effect.
    carousel.style.transform = 'translateX( ' + (-imgSize * counter) + 'px)';
  }

  // Infinite scroll when clicking the next button.
  if (carouselItems[counter].id === 'carousel-item-first') {
    carousel.style.transition = 'none'; 
    counter = carouselItems.length - counter; 
    carousel.style.transform = 'translateX( ' + (-imgSize * counter) + 'px)';
  }
});