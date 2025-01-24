// constants
const carrouselImageTransitionDuration = 250; // in milliseconds
const carrouselAutoPlayDelay = 15 * 1000; // 15 seconds in milliseconds
const endPageUrlsWithDotHTML = true;
const maxTitleLength = 50;
const latest = [];
const categories = {};
const latestNewsSize = 4;
const categoryNewsSize = 5;
const firstCategoryNewsIsHighLight = true;
const categoryTranslationKeys = {
  latest: 'Últimas notícias',
  sports: 'Esportes',
  politics: 'Política',
  technology: 'Tecnologia'
};

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
const proceduralSectionsAfterSideBar = document.getElementById('contentAfterSideBarProcedural');

// Global variables
// carrousel variables
let carrouselNews = [];
let carrouselCurrentItem = 0;
let carrouselAutoPlayInterval;
let stillBeforeSideBar = true;
let articleCounter = 0;

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
  saveCurrentArticle(article);
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
  articleBlock.style.setProperty('--index', articleCounter);
  articleCounter++;
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
  articleTitle.innerText = article.title.length > maxTitleLength ? `${article.title.substring(0, maxTitleLength - 3)}...` : article.title;

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

function getNewsHtmlPlace() {
  if (stillBeforeSideBar) return proceduralSections;
  else return proceduralSectionsAfterSideBar;
}

function generateCategorySection(parent, name, articles) {
  articleCounter = 0;
  const articleSection = createArticlesSection(parent, name, false);
  articleSection.appendChild(createNewsBlock(articles.shift(), true));
  const box = createBox();
  articleSection.appendChild(box);
  articles.forEach((article) => {
    box.appendChild(createNewsBlock(article));
  });
}

function generateMidSection(name, articles) {
  const box = createBox(true);
  const section = createArticlesSection(box, name, true);
  articles.forEach((article) => {
    section.appendChild(createNewsBlock(article, true));
  })
  
  getNewsHtmlPlace().appendChild(box);
  stillBeforeSideBar = false;
}

function generateNewsPage() {
  // sidebar
  const sideBarContent = latest.shift();
  sideBarContent.forEach((article) => {
    addNewsBlockToSideBar(createNewsBlock(article, true));
  });

  // categories
  const categoriesNames = Object.keys(categories);
  let hadNews = false;
  do {
    hadNews = false
    const horizontalArea = createSection(true);
    getNewsHtmlPlace().appendChild(horizontalArea);
    categoriesNames.forEach((category) => {
      const newsBlock = categories[category].shift();
      if (newsBlock) {
        generateCategorySection(horizontalArea, categoryTranslationKeys[category], newsBlock);
        hadNews = true;
      }
    });
    const midSection = latest.shift();
    if (midSection) {
      generateMidSection(categoryTranslationKeys['latest'], midSection);
      hadNews = true;
    }
  } while (hadNews);
}

async function getAndDistributeNews() {
  const hls = await fetchHighlights();
  const lts = await fetchLatest();
  const cat = await fetchCategories();

  carrouselNews.push(...hls.articles);
  initializeCarrousel();

  // splits lts and the cat's into appropriated size chunks
  // lts
  for (let i = 0; i < (lts.articles.length / latestNewsSize); i++) {
    latest.push(lts.articles.slice(i*latestNewsSize, (i+1) * latestNewsSize));
  }

  // cat
  Object.keys(cat).forEach((category) => {
    if (!categories[category]) categories[category] = [];
    for (let i = 0; i < (cat[category].articles.length / categoryNewsSize); i++) {
      categories[category].push(cat[category].articles.slice(i*categoryNewsSize, (i+1) * categoryNewsSize));
    }
  });

  [...document.getElementsByClassName('showAfterLoad')].forEach((item) => {
    item.classList.remove('showAfterLoad');
  });
  [...document.getElementsByClassName('hideOnNewsLoad')].forEach((item) => {
    item.style.display = 'none';
  });

  generateNewsPage();
}

getAndDistributeNews();