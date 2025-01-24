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

function generateLorem(qtdChars) {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum blandit rutrum. Mauris consequat sagittis tortor, vitae fringilla enim tristique eget. Donec id tempor dui, id commodo nulla. Sed pellentesque vulputate suscipit. Donec vitae lobortis ex. Suspendisse mauris libero, mollis nec turpis id, volutpat consequat dui. Aenean volutpat porta congue. Maecenas blandit lacus id quam faucibus, vitae dictum purus interdum. Nulla at ultrices sapien, ac malesuada sapien.\nNullam facilisis, justo ut tristique convallis, nunc est lacinia felis, vel viverra arcu diam a neque. Aliquam euismod fringilla tincidunt. Nullam fermentum sollicitudin orci ac vulputate. Integer eleifend nunc quis lacus vehicula sodales in sit amet nisi. Suspendisse commodo volutpat augue, ac venenatis arcu. Aliquam condimentum justo a lorem tincidunt, sed aliquam odio commodo. Donec tincidunt accumsan ultricies. Duis eleifend elit magna, eget dictum leo eleifend et. Quisque lacinia eros tincidunt, tincidunt enim eu, posuere tellus. Sed cursus lorem sem, et congue enim dapibus molestie. Nulla rhoncus convallis justo, id molestie massa aliquam ut. Aenean ultrices vehicula nisi at ullamcorper.\n";
    let loremRepeat = Math.ceil(qtdChars / lorem.length);
    let loremText = lorem.repeat(loremRepeat);
    return loremText.slice(0, qtdChars);
}

function fillContentWithLorem(content) {
    let match = content.match(/\[\+(\d+) chars\]$/);
    
    if(match) {
        let cleanedContent = content.replace(/\s\[\+\d+\schars\]$/, "");
        cleanedContent += "\n";
        const qtdChars = parseInt(match[1]);
        const newText = cleanedContent + generateLorem(qtdChars)
        return newText;
    }
    
    return content;
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

        newsDescription.innerHTML = "&emsp;" + currentNews.description.replace(/\n/g, '<br>&emsp;');

        newsAutor.textContent = currentNews.author;

        newsSource.textContent = currentNews.source.name;
        newsSource.href = currentNews.url;

        newsDate.textContent = formatDate(currentNews.publishedAt);

        newsContent.innerHTML = "&emsp;" + fillContentWithLorem(currentNews.content).replace(/\n/g, '<br>&emsp;');
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

        for(let i = 0; i < 3; i++) {
            createSidebarNewsItem(newsData.articles[i], newsList);
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