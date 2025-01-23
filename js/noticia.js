import { fetchCategories, fetchLatest, saveCurrentArticle, getCurrentArticle } from "./requests.js";

function createNewsItem(news, newsList) {
    const newsItem = document.createElement('li');
    newsItem.classList.add('news-item');

    const newsImage = document.createElement('img');
    newsImage.classList.add('news-image');
    newsImage.src = news.urlToImage || "../assets/images/image-not-available.png";
    newsImage.alt = "Imagem da notícia na barra lateral"

    const newsInfo = document.createElement('div');
    newsInfo.classList.add('news-info');

    const newsTitle = document.createElement('h3');
    newsTitle.classList.add('news-title');
    newsTitle.textContent = news.title;

    newsInfo.appendChild(newsTitle);
    newsItem.appendChild(newsImage);
    newsItem.appendChild(newsInfo);

    newsItem.addEventListener("click", () => {
        saveCurrentArticle(news);
    });

    newsList.appendChild(newsItem);
}

async function renderNews(newsType, containerId) {
    const newsList = document.querySelector(`#${containerId}`);

    let newsData;
    switch (newsType) {
        case "latest":
            newsData = await fetchLatest(); break;
        case "technology":
            newsData = (await fetchCategories()).technology; break;
        case "sports":
            newsData = (await fetchCategories()).sports; break;
        case "politics" :
            newsData = (await fetchCategories()).politics; break;
        default:
            console.error("Tipo de notícia desconhecido");
            return;
    }

    for (let news of newsData.articles) {
        createNewsItem(news, newsList);
    }
}

renderNews("latest", "latest-news");
renderNews("technology", "technology-news");
renderNews("sports", "sports-news");
renderNews("politics", "politics-news")