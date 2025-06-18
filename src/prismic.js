import * as prismic from 'https://cdn.skypack.dev/@prismicio/client';

// --- CONFIGURAÇÃO ---
const repositoryName = 'curriculo';
const client = prismic.createClient(repositoryName);

// --- ELEMENTOS DO DOM ---
const eventosContainer = document.querySelector('#eventos-container');
const modal = document.querySelector('#eventoModal');
const modalCloseBtn = document.querySelector('.modal-close');
const sortBtn = document.querySelector('#sortBtn');

// --- VARIÁVEL PARA GUARDAR OS DADOS ---
let eventosData = [];

// --- FUNÇÕES DA MODAL ---
function openModal(evento) {
    if (!modal) return;
    const modalImg = document.querySelector('#modalImg');
    const modalTitulo = document.querySelector('#modalTitulo');
    const modalData = document.querySelector('#modalData');
    const modalDescricao = document.querySelector('#modalDescricao');

    modalTitulo.innerHTML = prismic.asHTML(evento.titulo);
    modalDescricao.innerHTML = prismic.asHTML(evento.descricao);

    if (evento.data) {
        const dataFormatada = new Date(evento.data).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
        modalData.textContent = dataFormatada;
    } else {
        modalData.textContent = '';
    }
    
    const urlImagem = prismic.asImageSrc(evento.imagem);
    if (urlImagem) {
        modalImg.src = urlImagem;
        modalImg.alt = evento.imagem.alt || '';
        modalImg.style.display = 'block';
    } else {
        modalImg.style.display = 'none';
    }

    modal.classList.add('visible');
}

function closeModal() {
    if (modal) {
        modal.classList.remove('visible');
    }
}

// --- FUNÇÃO DE RENDERIZAÇÃO ---
function renderEventos(eventos) {
    if (!eventosContainer) return;
    eventosContainer.innerHTML = ''; 

    if (eventos.length === 0) {
        eventosContainer.innerHTML = "<p>Nenhum evento cadastrado.</p>";
        return;
    }
    
    eventos.forEach((evento) => {
        const card = document.createElement('div');
        card.className = 'evento-card';
        card.dataset.id = evento.id; 

        const urlImagem = prismic.asImageSrc(evento.imagem);
        let htmlInterno = '';
        if (urlImagem) {
            htmlInterno += `<img src="${urlImagem}" alt="${evento.imagem.alt || ''}" class="card-img">`;
        }
        
        htmlInterno += `<div class="card-texto">`;
        htmlInterno += prismic.asHTML(evento.titulo);
        htmlInterno += `<div class="card-descricao">${prismic.asHTML(evento.descricao)}</div>`;
        htmlInterno += `</div>`;

        card.innerHTML = htmlInterno;
        eventosContainer.appendChild(card);
    });
}


// --- FUNÇÃO PRINCIPAL DE CARREGAMENTO ---
async function carregarEventos() {
    if (!eventosContainer) return;

    try {
        const prismicDocs = await client.getAllByType('meus-eventos', {
            orderings: {
                field: 'my.meus-eventos.data',
                direction: 'desc',
            }
        });

        eventosData = prismicDocs.map(doc => ({ id: doc.id, ...doc.data }));
        renderEventos(eventosData);

    } catch (error) {
        console.error("Falha ao buscar dados do Prismic:", error);
        eventosContainer.innerHTML = "<p>Não foi possível carregar os eventos.</p>";
    }
}

// --- ESCUTADORES DE EVENTOS ---
if (eventosContainer) {
    eventosContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.evento-card');
        if (card) {
            const eventoId = card.dataset.id;
            const eventoClicado = eventosData.find(evento => evento.id === eventoId);
            if (eventoClicado) {
                openModal(eventoClicado);
            }
        }
    });
}

if (sortBtn) {
    sortBtn.addEventListener('click', () => {
        const currentOrder = sortBtn.dataset.order;
        eventosData.reverse();
        renderEventos(eventosData);

        if (currentOrder === 'desc') {
            sortBtn.dataset.order = 'asc';
            sortBtn.textContent = 'Ordenar por mais recentes';
        } else {
            sortBtn.dataset.order = 'desc';
            sortBtn.textContent = 'Ordenar por mais antigos';
        }
    });
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
}
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// --- INICIALIZAÇÃO ---
carregarEventos();