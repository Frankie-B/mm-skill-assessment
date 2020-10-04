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

/**
 * Due to the duplicate last image being in index position, the carousel default position needs to be
 * set to the image in index position 1 buy moving the image to the right by 300px
*/
carousel.style.transform = 'translateX( ' + (-imgSize * counter) + 'px)';

/**
 * Both buttons have an event listener, when either button is clicked it will either increment or decrement
 * the counter and move the image the size of the width of a single image either left or right.
 */
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

/**
 * Event listener to trigger when a transition completes.
 * The two conditions inside check to see if we have reached the last image
 * when clicking next or the first image when clicking previous.
 * If those conditions are met the then the transition is remove while the image jumps to its duplicate
 * start/ end image respectively. This gives the appearance of the images scrolling infinitely.
 */
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