const maxAge = 2 * 60 * 60 * 1000; // 2 horas
const keyToAge = "date";
const localStorageKey = "loopis-news";

// Recria o localStorage se ele estiver por um prazo em milissegundos maior que maxAge
function getLocalStorage(){
    const currentDate = new Date();

    const currentItem = localStorage.getItem(localStorageKey);

    let currentObject = !currentItem ? {keyToAge: currentDate}: JSON.parse(currentItem);

    if(!currentObject[keyToAge]){
        currentObject = {};
        currentObject[keyToAge] = currentDate;
    }
    else{
        const objectDate = new Date(currentObject[keyToAge]);

        if(currentDate.getTime() - objectDate.getTime() > maxAge){
            currentObject = {};
            currentObject[keyToAge] = currentDate;
        }
    }
   
    return currentObject;
}

function setLocalStorage(atribute, value){
    const currentItem = localStorage.getItem(localStorageKey);

    let currentObject = getLocalStorage();
    
    currentObject[atribute] = value;
    localStorage.setItem(localStorageKey, JSON.stringify(currentObject));
}

const currentArticleKey = 'currentArticle';

// Guarda uma noticia para que possa ser visualizada em noticia.html
function saveCurrentArticle(articleObject){
    localStorage.setItem(currentArticleKey, JSON.stringify(articleObject));
}

// Recebe a noticia selecionada atualmente para exibir na tela
function getCurrentArticle(){
    const currentArticleString = localStorage.getItem(currentArticleKey);
    return JSON.parse(currentArticleString);
}

async function readToken() {
    const atributeName = 'apiKey';
    const allPages = getLocalStorage();
    let apiKeyToken = allPages[atributeName];

    //Se nao estiver no localStorage busca e salva
    if(!apiKeyToken){
        const configsFile = await fetch('../configs/configs.json');
        const configsFileJSON = await configsFile.json();
        setLocalStorage(atributeName, configsFileJSON.token);
        apiKeyToken = configsFileJSON.token;
    }

    return apiKeyToken;
}

const maxResultNumber=6;
const sitesDomain = "domains=nytimes.com,cnn.com,washingtonpost.com";
const language = 'en';

// Retorna uma funcao que faz uma requisicao para o endereco everything da API
// Essa funcao ordena com base no atributo sortBy
// Ela tambem recebe um atributeName que permite encontra-lo no localStorage
function factoryRequisitionEverything(sortBy, atributeName) {
    return async (pesquisa)=>{
        const allPages = getLocalStorage();
        let currentPage = allPages[atributeName]

        //Se nao estiver no localStorage busca e salva
        if(!currentPage){
            const token = await readToken();

            // Precisa realizar uma query de pesquisa ou especificar os dominios de sites
            // senao a API nao retorna nada, pois diz que eh muito abrangente
            const url = `https://newsapi.org/v2/everything?language=${language}&sortBy=${sortBy}&apiKey=${token}&${!pesquisa ? sitesDomain  : `q=${pesquisa}`}&pageSize=${maxResultNumber}`;

            const response = await fetch(url, {
                method: 'GET'
            });
            currentPage = await response.json();
            setLocalStorage(atributeName, currentPage);
            console.log(atributeName, "not in cache");
        }
        else{
            console.log(atributeName, "in cache");
        }

        return currentPage;
    }
}

// Retorna uma funcao que faz uma requisicao para o endereco headlines da API
// Essa chamada eh feita com base no atributo category
function factoryRequisitionHeadlines(category, atributeName) {
    return async ()=>{
        const allPages = getLocalStorage();
        let currentPage = allPages[atributeName]

        //Se nao estiver no localStorage busca e salva
        if(!currentPage){
            const token = await readToken();
            const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${token}&language=${language}&pageSize=${maxResultNumber}`;

            const response = await fetch(url, {
                method: 'GET'
            });
            currentPage = await response.json();
            setLocalStorage(atributeName, currentPage);
            console.log(atributeName, "not in cache");
        }
        else{
            console.log(atributeName, "in cache");
        }

        return currentPage;
    }
}

// Funcoes para requisicoes de pesquisas sem categorias
async function fetchHighlights(){
    const results = factoryRequisitionEverything('popularity', 'highlights');
    return await results();
}

async function fetchLatest() {
    const results = factoryRequisitionEverything('publishedAt', 'latest');
    return await results();
}

async function fetchSearch() {
    const results = factoryRequisitionEverything('relevancy', 'search');
    return await results();
}


// Funcoes para notícias mais recentes das categorias abaixo
async function fetchSports() {
    const results = factoryRequisitionHeadlines('sports', 'sports');
    return await results();
}

async function fetchPolitics() {
    const results = factoryRequisitionHeadlines('politics', 'politics');
    return await results();
}

async function fetchTechnology() {
    const results = factoryRequisitionHeadlines('technology', 'technology');
    return await results();
}


// Retorna um objeto contendo as 3 categorias utilizadas no site
// returns { sports: [{...}], politics: [{...}], technology: [{...}] }
async function fetchCategories(){
    const sports = await fetchSports();
    const politics = await fetchPolitics();
    const technology = await fetchTechnology();

    return {
        sports,
        politics,
        technology
    };
}