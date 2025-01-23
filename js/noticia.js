import { fetchCategories, fetchLatest, saveCurrentArticle, getCurrentArticle } from "./requests.js";

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}h${minutes}`;
}

function validateNewsData(newsData) {
    if(newsData.content !== null) {
        saveCurrentArticle(newsData);
        window.location.href = "../html/noticia.html";
    }
}

function createSidebarNewsItem(news, newsList) {
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
        validateNewsData(news);
    });

    newsList.appendChild(newsItem);
}

function renderMainNews() {
    try {
        const newsImage = document.querySelector("#main-news-image");
        const newsTitle = document.querySelector("#main-news-title");
        const newsDescription = document.querySelector("#main-news-description");
        const newsAutor = document.querySelector("#main-news-autor");
        const newsSource = document.querySelector("#main-news-source");
        const newsDate = document.querySelector("#main-news-date");
        const newsContent = document.querySelector("#main-news-content");

        const currentNews = getCurrentArticle();

        newsImage.src = currentNews.urlToImage || "../assets/images/image-not-available.png";

        newsTitle.textContent = currentNews.title;

        newsDescription.textContent = currentNews.description.replace(/\n/g, '<br>');

        newsAutor.textContent = currentNews.author;

        newsSource.textContent = currentNews.source.name;
        newsSource.href = currentNews.url;

        newsDate.textContent = formatDate(currentNews.publishedAt);

        newsContent.textContent = currentNews.content;
    } catch(e) {
        console.error("Erro ao tentar renderizar notícia principal: " + e);
    }
}

async function renderSidebarNews(newsType, containerId) {
    try {
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
            createSidebarNewsItem(news, newsList);
        }
    } catch(e) {
        console.error("Erro ao tentar renderizar notícias da sidebar: " + e);
    }
}

renderMainNews();
renderSidebarNews("latest", "latest-news");
renderSidebarNews("technology", "technology-news");
renderSidebarNews("sports", "sports-news");
renderSidebarNews("politics", "politics-news");