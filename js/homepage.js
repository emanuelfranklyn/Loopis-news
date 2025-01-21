const headLineCarrousel = document.getElementById('headLineCarrousel');
const headLineCarrouselImagesContainer = document.getElementById('hlcHeadLinesImgWrapper');
const headLineCarrouselMainImage = document.getElementById('hlcHeadLinesImgCurrent');
const headLineCarrouselNextImage = document.getElementById('hlcHeadLinesImgNext');
const headLineCarrouselNextImageEffect = document.getElementById('hlcHeadLinesImgNextEffect');
const carrouselItemsIndicator = document.getElementById('carrouselItemsIndicator');

// constants
const carrouselImageTransitionDuration = 250; // in milliseconds
const carrouselAutoPlayDelay = 15 * 1000; // 15 seconds in milliseconds

const carrouselNews = [
  {
    image: '../assets/images/ExampleHeadLineImg.png',
    title: 'Titulo da materia 1',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente fuga suscipit, veritatis molestias numquam voluptatum eligendi dolore doloremque aliquam, cupiditate quasi asperiores est dolorum aut beatae harum ipsum ab quas.'
  },
  {
    image: '../assets/images/ExampleHeadLineImg2.webp',
    title: 'Titulo da materia 2',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente fuga suscipit, veritatis molestias numquam voluptatum eligendi dolore doloremque aliquam, cupiditate quasi asperiores est dolorum aut beatae harum ipsum ab quas.'
  }
];

let carrouselCurrentItem = 0;

function updateCarrouselImages(newImageUrl) {
  headLineCarrousel.style.setProperty('--nextNews-image', `url(${newImageUrl})`);
  const newImg = new Image();
  newImg.onload = () => {
    headLineCarrouselNextImage.src = newImageUrl;
    headLineCarrouselNextImageEffect.src = newImageUrl;
    const currentWidth = headLineCarrouselImagesContainer.getBoundingClientRect().height * (newImg.width / newImg.height);
    headLineCarrouselImagesContainer.style.width = `${currentWidth}px`;
    headLineCarrousel.style.setProperty('--carrousel-image-transition', 1);
  }
  newImg.src = newImageUrl;
  setTimeout(() => {
    headLineCarrouselMainImage.src = newImageUrl;
    headLineCarrousel.style.setProperty('--currentNews-image', `url(${newImageUrl})`);
    headLineCarrousel.style.setProperty('--carrousel-image-transition', 0);
  }, carrouselImageTransitionDuration);
}

/**
 * Receives an news object and updates the html for the carrousel to display it
 * meant to be used by the arrow buttons and automatic scroll
 * @param {*} newsToShow an full object from news-api with image, description, title content, url...
 */
function changeCarrouselInfo(newsToShowIndex) {
  carrouselCurrentItem = newsToShowIndex;
}

function initializeCarrousel() {
  carrouselNews.forEach((_, index) => {
    const newsItemIndicator = document.createElement('div');
    newsItemIndicator.onclick = () => {
      changeCarrouselInfo(index);
    }
    carrouselItemsIndicator.appendChild(newsItemIndicator);
  });
}

function goToNextCarrouselItem() {

}

function goToPreviousCarrouselItem() {

}

updateCarrouselImages('../assets/images/ExampleHeadLineImg.png');

initializeCarrousel();

// setInterval(() => {

// }, carrouselAutoPlayDelay)