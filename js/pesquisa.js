let button = document.querySelector("#button")
let divNews = document.querySelector("#noticias");
let messageErro = document.querySelector("#mensagemErro");
button.addEventListener('click', async (evt)=>{
    evt.preventDefault();
    let keyWord = document.querySelector("#inputPesquisa").value;
    if(!keyWord){
        messageErro.textContent = " ";
        message('input');
        return;
    }
    let news =  await fetchSearch(keyWord);
    if(news.totalResults === 0){
        messageErro.textContent = " ";
        message('api');
        return;
    }
    divNews.textContent = " ";
    messageErro.textContent = " ";
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
        let dateTime = document.createElement('p');
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
        let source = document.createElement('p');
        source.textContent ="Fonte: " + news.articles[i].source.name;
        source.id = 'fonte';
        span.appendChild(link);
        div.appendChild(img);
        div.appendChild(h5);
        div.appendChild(dateTime);
        div.appendChild(description);
        div.appendChild(source);
        div.appendChild(span);
        divNews.appendChild(div);

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
function message(type){
    divNews.textContent = " ";
    let div = document.createElement('div');
    div.id = "message";
    let nameErro = document.createElement('span');
    nameErro.textContent = "Erro: ";
    nameErro.id = "nameErro";
    let message = document.createElement('span');
    let icone = document.createElement('span');
    let imgIcone = document.createElement('img');
    imgIcone.src = '../assets/icons/aviso.png';
    imgIcone.alt = "Eviso";
    imgIcone.id = 'iconeAviso';
    icone.appendChild(imgIcone);
    if(type === 'input'){
         message.textContent = "Campo vazio";

    }
    else{

        message.textContent = "Nem um resultado encontrado";
    }
    div.appendChild(icone)
    div.appendChild(nameErro);
    div.appendChild(message);
    messageErro.appendChild(div);

}
