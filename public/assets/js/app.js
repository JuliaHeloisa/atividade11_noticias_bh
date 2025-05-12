const API_URL = 'http://localhost:3000/noticias';

function renderIndex() {
  const slider = document.getElementById('sliderDestaques');
  const lista = document.getElementById('listaNoticias');

  fetch(API_URL)
    .then(res => res.json())
    .then(noticias => {
      const destaques = noticias.filter(n => n.destaque);
      if (slider) {
        slider.innerHTML = `
          <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              ${destaques.map((n, i) => `
                <div class="carousel-item ${i === 0 ? 'active' : ''}">
                  <img src="${n.imagem_pincipal}" class="d-block w-100" alt="${n.titulo}">
                  <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
                    <h5><a class="text-white" href="detalhe.html?id=${n.id}">${n.titulo}</a></h5>
                    <p>${n.descricao}</p>
                  </div>
                </div>`).join('')}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>`;
      }

      if (lista) {
        lista.innerHTML = noticias.map((n) => `
          <div class="col">
            <div class="card h-100">
              <img src="${n.imagens_complementares[0].src}" class="card-img-top" alt="${n.imagens_complementares[0].descricao}">
              <div class="card-body">
                <h5 class="card-title">${n.titulo}</h5>
                <p class="card-text">${n.descricao}</p>
                <a href="detalhe.html?id=${n.id}" class="btn btn-primary">Ler mais</a>
              </div>
            </div>
          </div>`).join('');
      }
    });
}

function renderDetalhe() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) return;

  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(noticia => {
      const detalhe = document.getElementById('detalheNoticia');
      const fotos = document.getElementById('fotosComplementares');

      if (detalhe) {
        detalhe.innerHTML = `
          <h1 class="mt-5 text-center">${noticia.titulo}</h1>
          <div class="text-center">
            <img src="${noticia.imagem_pincipal}" class="img-fluid mb-3 rounded" alt="${noticia.titulo}">
          </div>
          <p><strong>Autor:</strong> ${noticia.autor}</p>
          <p>${noticia.conteudo}</p>
        `;
      }

      if (fotos) {
        fotos.innerHTML = `
          <h2 class="mt-5">Imagens da Notícia</h2>
          <div id="carouselFotos" class="carousel slide mt-3" data-bs-ride="carousel">
            <div class="carousel-inner">
              ${noticia.imagens_complementares.map((img, index) => `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                  <img src="${img.src}" class="d-block w-100 rounded" alt="${img.descricao}">
                  <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
                    <p>${img.descricao}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselFotos" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselFotos" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
          </div>
        `;
      }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('sliderDestaques')) renderIndex();
  if (document.getElementById('detalheNoticia')) renderDetalhe();
});