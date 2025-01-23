let button = document.querySelector("#button")
let divPrincipal = document.querySelector("#noticias");
button.addEventListener('click', async (evt)=>{
    evt.preventDefault();
    let keyWord = document.querySelector("#inputPesquisa").value;
    let news =  await fetchSearch(keyWord);
    if(!news){
        message();
    }
    createDom(news);

})
let arrayNews = [];

async function createDom(news){
    arrayNews = [];
    for(let i = 0; i<news.articles.length; i++){
        let div = document.createElement('div');
        let img = document.createElement('img');
        img.src = news.articles[i].urlToImage;
        img.alt = "Imagem da noticia";
        let h5 = document.createElement('h5');
        h5.textContent = news.articles[i].title;
        let dateTime = document.createElement('span');
        dateTime.id= "dataHora";
        dateTime.textContent = formatDate(news.articles[i].publishedAt);
        let description =  document.createElement('p');
        description.id = "descricao";
        description.textContent = news.articles[i].description;
        let span = document.createElement('span');
        span.className = "link";
        let link = document.createElement('a');
        link.textContent = "Leia mais";
        link.href=`javascript:redirectNewsPage(${i})`;
        link.id = i;
        let source = document.createElement('span');
        source.textContent = "Fonte: " + news.articles[i].source.name;
        source.id = "fonte";
        let dateAndSource = document.createElement('span');
        dateAndSource.id = 'dataFonte'
        dateAndSource.appendChild(dateTime);
        dateAndSource.appendChild(source);
        span.appendChild(link);
        div.appendChild(img);
        div.appendChild(h5);
        div.appendChild(dateAndSource);
        div.appendChild(description);
        div.appendChild(span);
        divPrincipal.appendChild(div);

        arrayNews.push(news.articles[i]);
    }
}

function redirectNewsPage(id){
    saveCurrentArticle(arrayNews[id]);
    window.location.href = "../html/noticia.html";
}

function formatDate(dateTime){
    let date = new Date(dateTime);
    let formatDate = new Intl.DateTimeFormat('pt-BR', {
        day:"numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute:"2-digit",
        timeZone: "UTC"
    });
    return formatDate.format(date).replace(":", "h")


}
function message(){
    let div = document.createElement('div');
    div.className = "message";
    let nameErro = document.createElement('span');
    nameErro.id = "nameErro";
    let message = document.createElement('span');
    message.textContent = "Nem um resultado encontrado"

}
