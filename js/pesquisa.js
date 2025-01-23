let button = document.querySelector("#button")
let divPrincipal = document.querySelector("#noticias");
button.addEventListener('click', async (evt)=>{
    evt.preventDefault();
    let keyWord = document.querySelector("#inputPesquisa").value;
    let news =  await fetchSearch(keyWord);
    createDom(news);

})
async function createDom(news){
    for(let i = 0; i<news.articles.length; i++){
        let div = document.createElement('div');
        let img = document.createElement('img');
        img.src = news.articles[i].urlToImage;
        img.alt = "Imagem da noticia";
        let h5 = document.createElement('h5');
        h5.textContent = news.articles[i].title;
        let dateTime = document.createElement('p');
        dateTime.id= "dataHora";
        dateTime.textContent = news.articles[i].publishedAt;
        let description =  document.createElement('p');
        description.id = "descricao";
        description.textContent = news.articles[i].description;
        let span = document.createElement('span');
        span.className = "link";
        let link = document.createElement('a');
        link.textContent = "Leia mais";
        link.href="#";
        span.appendChild(link);
        div.appendChild(img);
        div.appendChild(h5);
        div.appendChild(dateTime);
        div.appendChild(description);
        div.appendChild(span);
        divPrincipal.appendChild(div);

    }
}