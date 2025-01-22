// constants
const carrouselImageTransitionDuration = 250; // in milliseconds
const carrouselAutoPlayDelay = 15 * 1000; // 15 seconds in milliseconds
const endPageUrlsWithDotHTML = true;

// html elements
const headLineCarrousel = document.getElementById('headLineCarrousel');
const headLineCarrouselImagesContainer = document.getElementById('hlcHeadLinesImgWrapper');
const headLineCarrouselMainImage = document.getElementById('hlcHeadLinesImgCurrent');
const headLineCarrouselNextImage = document.getElementById('hlcHeadLinesImgNext');
const headLineCarrouselNextImageEffect = document.getElementById('hlcHeadLinesImgNextEffect');
const carrouselItemsIndicator = document.getElementById('carrouselItemsIndicator');
const carrouselTitle = document.getElementById('hlcHLTCArticleTitle');
const carrouselDescription = document.getElementById('hlcHeadLinesTextContentArticleDescription');
const carrouselImagePlaceHolderImage = document.getElementById('carrouselImagePlaceHolderImage');
const sidebarContainer = document.getElementById('atfSidebar');
const sideBarMobile = document.getElementById('atfSidebarMobile');
const proceduralSections = document.getElementById('proceduralSections');

// Global variables
let fetchedArticles = {
  headlines: [],
  highlights: [],
  sports: [],
  politics: [],
  technology: [],
};
// carrousel variables
let carrouselNews = [];
let carrouselCurrentItem = 0;
let carrouselAutoPlayInterval;

// functions
// carrousel functions
function updateCarrouselImages(newImageUrl) {
  headLineCarrousel.style.setProperty('--nextNews-image', `url(${newImageUrl})`);
  const newImg = new Image();
  newImg.onload = () => {
    carrouselImagePlaceHolderImage.style.display = 'none';
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
  if (carrouselNews.length === 0) return;
  carrouselCurrentItem = newsToShowIndex;
  document.getElementById('carrouselItemsIndicator').style.setProperty('--currentNews', newsToShowIndex);
  const article = carrouselNews[newsToShowIndex];
  updateCarrouselImages(article.urlToImage);
  carrouselTitle.innerText = article.title;
  carrouselTitle.title = article.title;
  carrouselDescription.innerText = article.description;
}

function initializeCarrousel() {
  if (carrouselNews.length === 0) return;
  carrouselNews.forEach((_, index) => {
    const newsItemIndicator = document.createElement('div');
    newsItemIndicator.style.setProperty('--news-number', index);
    newsItemIndicator.onclick = () => {
      changeCarrouselInfo(index);
    }
    carrouselItemsIndicator.appendChild(newsItemIndicator);
  });
  changeCarrouselInfo(0);
  startAutoPlayCarrousel();
}

function startAutoPlayCarrousel() {
  if (carrouselAutoPlayInterval) clearInterval(carrouselAutoPlayInterval);
  carrouselAutoPlayInterval = setInterval(goToNextCarrouselItem, carrouselAutoPlayDelay)
}

function goToNextCarrouselItem() {
  changeCarrouselInfo((carrouselCurrentItem + 1) % carrouselNews.length);
  startAutoPlayCarrousel()
}

function goToPreviousCarrouselItem() {
  changeCarrouselInfo(Math.abs(carrouselCurrentItem - 1) % carrouselNews.length);
  startAutoPlayCarrousel();
}

// article navigation
function goToArticle(article) {
  // TODO: logic to save article on localStorage
  const pathNameParts = window.location.pathname.split('/');
  pathNameParts.pop();
  window.location.pathname = `${pathNameParts.join('/')}/noticia${endPageUrlsWithDotHTML ? '.html' : ''}`;
}

function carrouselGoToArticle() {
  if (carrouselNews.length === 0) return;
  const article = carrouselNews[carrouselCurrentItem];
  goToArticle(article);
}

// section generators
function createNewsBlock(article, highligh) {
  const articleBlock = document.createElement('div');
  articleBlock.onclick = () => {
    goToArticle(article);
  };
  articleBlock.classList.add(highligh ? 'highlightedArticle' : 'articleBlock');

  // background image
  const abImageWrapper = document.createElement('div');
  abImageWrapper.classList.add('abImgWrapper');
  abImageWrapper.style.setProperty('--image-url', `url(${article.urlToImage})`);
  
  const abImage = document.createElement('img');
  abImage.classList.add('abImg');
  abImage.src = article.urlToImage;
  
  abImageWrapper.appendChild(abImage);

  // text
  const articleTitle = document.createElement('a');
  articleTitle.href = '#';
  articleTitle.classList.add('abTitle');
  articleTitle.innerText = article.title;

  articleBlock.appendChild(abImageWrapper);
  articleBlock.appendChild(articleTitle);
  return articleBlock;
}

function addNewsBlockToSideBar(newsBlock) {
  sidebarContainer.appendChild(newsBlock);
  sideBarMobile.appendChild(newsBlock.cloneNode(true));
}

function createArticlesSection(parent, name, horizontal) {
  const section = document.createElement('div');
  section.classList.add('articleSection');
  if (horizontal) section.classList.add('horizontal');

  const title = document.createElement('h1');
  title.classList.add('sectionTitle');
  title.innerText = name;
  section.appendChild(title);

  const articlesSection = document.createElement('div');
  articlesSection.classList.add('articlesList');
  section.appendChild(articlesSection);
  parent.appendChild(section);
  return articlesSection;
}

function createSection(horizontal) {
  const section = document.createElement('div');
  section.classList.add(horizontal ? 'horizontalSection' : 'verticalSection');

  return section;
}

function createBox(horizontal) {
  const box = document.createElement('div');
  box.classList.add('genericBox');
  if (horizontal) box.classList.add('horizontal');
  return box;
}

function fetchArticles() {
  // TODO: call fetch apis
}

// default initializers
carrouselNews = [
  {
    urlToImage: '../assets/images/ExampleHeadLineImg.png',
    title: 'Titulo da materia 1',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente fuga suscipit, veritatis molestias numquam voluptatum eligendi dolore doloremque aliquam, cupiditate quasi asperiores est dolorum aut beatae harum ipsum ab quas.'
  },
  {
    urlToImage: '../assets/images/ExampleHeadLineImg2.webp',
    title: 'Titulo da materia 2',
    description: 'God I love this song so fucking much, the trumpet in their music adds such a brash flair to it and with the drums carrying the whole beat perfectly and the subtle yet persistent undertone of the keyboard and the strong strokes of bass god I love music and miss playing in a band this song is epic'
  }
];

initializeCarrousel();

addNewsBlockToSideBar(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}, true))

addNewsBlockToSideBar(createNewsBlock({
  title: 'Caramba que titulo de matéria legal de jornalismo! UAU',
  urlToImage: '../assets/images/ExampleHeadLineImg.png'
}, true))

addNewsBlockToSideBar(createNewsBlock({
  title: 'Sla oq por aqui, ;-;',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}, true))

addNewsBlockToSideBar(createNewsBlock({
  title: 'Caramba que titulo de matéria legal de jornalismo! UAU',
  urlToImage: '../assets/images/ExampleHeadLineImg.png'
}, true))

const firstSection = createSection(true);
proceduralSections.appendChild(firstSection);

const sportsSection = createArticlesSection(firstSection, 'Esportes');
const politicsSection = createArticlesSection(firstSection, 'Politica');
const technologySection = createArticlesSection(firstSection, 'Tecnologia');

sportsSection.appendChild(createNewsBlock({
  title: 'Caramba que titulo de matéria legal de jornalismo! UAU',
  urlToImage: '../assets/images/ExampleHeadLineImg.png'
}, true));

const sportsSubArticlesBox = createBox();
sportsSection.appendChild(sportsSubArticlesBox);

sportsSubArticlesBox.appendChild(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}));
sportsSubArticlesBox.appendChild(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}));
sportsSubArticlesBox.appendChild(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}));
sportsSubArticlesBox.appendChild(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}));

politicsSection.appendChild(createNewsBlock({
  title: 'Caramba que titulo de matéria legal de jornalismo! UAU',
  urlToImage: '../assets/images/ExampleHeadLineImg.png'
}, true));

const politicsSubArticlesBox = createBox();
politicsSection.appendChild(politicsSubArticlesBox);

politicsSubArticlesBox.appendChild(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}));
politicsSubArticlesBox.appendChild(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}));
politicsSubArticlesBox.appendChild(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}));
politicsSubArticlesBox.appendChild(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}));

technologySection.appendChild(createNewsBlock({
  title: 'Caramba que titulo de matéria legal de jornalismo! UAU',
  urlToImage: '../assets/images/ExampleHeadLineImg.png'
}, true));

const techSubArticlesBox = createBox();
technologySection.appendChild(techSubArticlesBox);

techSubArticlesBox.appendChild(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}));
techSubArticlesBox.appendChild(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}));
techSubArticlesBox.appendChild(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}));
techSubArticlesBox.appendChild(createNewsBlock({
  title: 'Muitas luzes e explosões no top 10 shows da virada',
  urlToImage: '../assets/images/ExampleHeadLineImg2.webp'
}));

const mhlBox = createBox(true);
const mhlSection = createArticlesSection(mhlBox, 'últimas notícias', true);
proceduralSections.append(mhlBox);

mhlSection.appendChild(createNewsBlock({
  title: 'Caramba que titulo de matéria legal de jornalismo! UAU',
  urlToImage: '../assets/images/ExampleHeadLineImg.png'
}, true));
mhlSection.appendChild(createNewsBlock({
  title: 'Caramba que titulo de matéria legal de jornalismo! UAU',
  urlToImage: '../assets/images/ExampleHeadLineImg.png'
}, true));
mhlSection.appendChild(createNewsBlock({
  title: 'Caramba que titulo de matéria legal de jornalismo! UAU',
  urlToImage: '../assets/images/ExampleHeadLineImg.png'
}, true));