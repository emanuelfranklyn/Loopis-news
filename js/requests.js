async function lerToken() {
    const chave = await fetch('../configs/configs.json');
    const objeto = await chave.json();
    
    console.log(objeto.token);
    return objeto.token;
}

function requisicaoEverything(sortBy) {
    const limiteResultados = 30;
    const sites = "domains=nytimes.com,cnn.com,washingtonpost.com&";
    const idioma = 'en';

    return async (pesquisa)=>{
        const token = await lerToken();
        const url = `https://newsapi.org/v2/everything?language=${idioma}&sortBy=${sortBy}&apiKey=${token}&${!pesquisa ? sites : `q=${pesquisa}&`}pageSize=${limiteResultados}`;

        try {
            const resposta = await fetch(url, {
                method: 'GET'
            });

            if (!resposta.ok) {
                throw new Error(`Erro ao buscar dados.${resposta.status}`);
            }
            const objeto = await resposta.json();
            
            return objeto;
        }
        catch (erro) {
            console.error("Erro ao se comunicar com a API:", erro);
            throw erro;
        }
    }
}

function requisicaoHeadlines(categoria) {
    const limiteResultados = 30;
    const idioma = 'en';

    return async ()=>{
        const token = await lerToken();
        const url = `https://newsapi.org/v2/top-headlines?category=${categoria}&apiKey=${token}&language=${idioma}&pageSize=${limiteResultados}`;

        try {
            const resposta = await fetch(url, {
                method: 'GET'
            });

            if (!resposta.ok) {
                throw new Error(`Erro ao buscar dados. ${resposta.status}`);
            }
            const objeto = await resposta.json();
            return objeto;
        }
        catch (erro) {
            console.error("Erro ao se comunicar com a API:", erro);
            throw erro;
        }
    }
}

//Pesquisas feitas sem categorias
const fetchDestaques = requisicaoEverything('popularity');
const fetchUltimasNoticias = requisicaoEverything('publishedAt');
const fetchPesquisa = requisicaoEverything('publishedAt');

//Recebe as notícias mais recentes dessas categorias
const fetchEsporte = requisicaoHeadlines('sports');
const fetchPolitica = requisicaoHeadlines('politics');
const fetchTecnologia = requisicaoHeadlines('technology');

async function fetchCategorias(){
    const esporte = await fetchEsporte();
    const politica = await fetchPolitica();
    const tecnologia = await fetchTecnologia();

    return {
        esporte,
        politica,
        tecnologia
    };
}