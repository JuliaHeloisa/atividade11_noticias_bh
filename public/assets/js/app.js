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
        lista.innerHTML = noticias.map((n) => {
          // Determine the image source for the card.
          // Fallback to imagem_pincipal if imagens_complementares is undefined or empty.
          const cardImageSrc = (n.imagens_complementares && n.imagens_complementares.length > 0)
                               ? n.imagens_complementares[0].src
                               : n.imagem_pincipal; // Use main image as fallback
          const cardImageAlt = (n.imagens_complementares && n.imagens_complementares.length > 0)
                               ? n.imagens_complementares[0].descricao
                               : n.titulo; // Use title as alt text for fallback

          return `
            <div class="col">
              <div class="card h-100">
                <img src="${cardImageSrc}" class="card-img-top" alt="${cardImageAlt}">
                <div class="card-body">
                  <h5 class="card-title">${n.titulo}</h5>
                  <p class="card-text">${n.descricao}</p>
                  <a href="detalhe.html?id=${n.id}" class="btn btn-primary">Ler mais</a>
                </div>
              </div>
            </div>`;
        }).join('');
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
        // Only render the carousel if there are complementary images
        if (noticia.imagens_complementares && noticia.imagens_complementares.length > 0) {
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
        } else {
            // Optionally, you could display a message if no complementary images
            fotos.innerHTML = `<p class="text-muted mt-5">Nenhuma imagem complementar disponível para esta notícia.</p>`;
        }
      }
    });
}

function renderCadastro() {
    const noticiaForm = document.getElementById('noticiaForm');
    const listaNoticiasCadastro = document.getElementById('listaNoticiasCadastro');
    const noticiaIdInput = document.getElementById('noticiaId');
    const limparFormButton = document.getElementById('limparForm');
    const addImageButton = document.getElementById('addComplementaryImage'); // New button
    const imagensContainer = document.getElementById('imagensComplementaresContainer'); // New container

    // Function to add a new set of input fields for a complementary image
    const addImageInputRow = (src = '', descricao = '') => {
        const rowId = `img-row-${Date.now()}`; // Unique ID for the row
        const newRow = document.createElement('div');
        newRow.className = 'row g-2 mb-2 align-items-end'; // Bootstrap classes for layout
        newRow.id = rowId;
        newRow.innerHTML = `
            <div class="col-md-5">
                <label for="imgSrc-${rowId}" class="form-label visually-hidden">URL da Imagem</label>
                <input type="url" class="form-control form-control-sm" id="imgSrc-${rowId}" placeholder="URL da Imagem Complementar" value="${src}">
            </div>
            <div class="col-md-5">
                <label for="imgDesc-${rowId}" class="form-label visually-hidden">Descrição da Imagem</label>
                <input type="text" class="form-control form-control-sm" id="imgDesc-${rowId}" placeholder="Descrição da Imagem" value="${descricao}">
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-danger btn-sm w-100 remove-image-btn" data-row-id="${rowId}">Remover</button>
            </div>
        `;
        imagensContainer.appendChild(newRow);

        // Add event listener for the new remove button
        newRow.querySelector('.remove-image-btn').addEventListener('click', (e) => {
            document.getElementById(e.target.dataset.rowId).remove();
        });
    };

    // Event listener for "Add Image" button
    if (addImageButton) {
        addImageButton.addEventListener('click', () => addImageInputRow());
    }


    // Function to fetch and display all news in the table
    const fetchNoticiasForCadastro = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(noticias => {
                listaNoticiasCadastro.innerHTML = noticias.map(n => `
                    <tr>
                        <td>${n.id}</td>
                        <td>${n.titulo}</td>
                        <td>${n.autor}</td>
                        <td>${n.destaque ? 'Sim' : 'Não'}</td>
                        <td>
                            <button class="btn btn-sm btn-info editar-btn" data-id="${n.id}">Editar</button>
                            <button class="btn btn-sm btn-danger excluir-btn" data-id="${n.id}">Excluir</button>
                        </td>
                    </tr>
                `).join('');

                // Add event listeners for edit and delete buttons
                document.querySelectorAll('.editar-btn').forEach(button => {
                    button.addEventListener('click', (e) => loadNoticiaForEdit(e.target.dataset.id));
                });
                document.querySelectorAll('.excluir-btn').forEach(button => {
                    button.addEventListener('click', (e) => deleteNoticia(e.target.dataset.id));
                });
            })
            .catch(error => console.error('Erro ao buscar notícias para cadastro:', error));
    };

    // Initial load for the table
    fetchNoticiasForCadastro();

    // Handle form submission (Create/Update)
    noticiaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect complementary images
        const imagensComplementares = [];
        imagensContainer.querySelectorAll('.row.g-2').forEach(row => {
            const imgSrc = row.querySelector('input[type="url"]').value;
            const imgDesc = row.querySelector('input[type="text"]').value;
            if (imgSrc && imgDesc) { // Only add if both fields are filled
                imagensComplementares.push({ src: imgSrc, descricao: imgDesc });
            }
        });

        const noticia = {
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            autor: document.getElementById('autor').value,
            conteudo: document.getElementById('conteudo').value,
            imagem_pincipal: document.getElementById('imagemPrincipal').value,
            destaque: document.getElementById('destaque').checked,
            imagens_complementares: imagensComplementares // Now collected from form
        };

        const id = noticiaIdInput.value;
        let method = 'POST';
        let url = API_URL;

        if (id) { // If there's an ID, it's an update
            method = 'PUT';
            url = `${API_URL}/${id}`;
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noticia),
        })
        .then(res => {
            if (!res.ok) {
                console.error('Erro na requisição:', res.statusText);
                alert(`Erro ao salvar notícia: ${res.statusText}`); // Temporary alert for debugging
                throw new Error('Erro na requisição: ' + res.statusText);
            }
            return res.json();
        })
        .then(() => {
            alert(`Notícia ${id ? 'atualizada' : 'cadastrada'} com sucesso!`); // Temporary alert for debugging
            noticiaForm.reset(); // Clear the form
            noticiaIdInput.value = ''; // Clear the hidden ID
            imagensContainer.innerHTML = ''; // Clear complementary images
            fetchNoticiasForCadastro(); // Refresh the list
        })
        .catch(error => console.error('Erro ao salvar notícia:', error));
    });

    // Load news for editing
    const loadNoticiaForEdit = (id) => {
        fetch(`${API_URL}/${id}`)
            .then(res => res.json())
            .then(noticia => {
                noticiaIdInput.value = noticia.id;
                document.getElementById('titulo').value = noticia.titulo;
                document.getElementById('descricao').value = noticia.descricao;
                document.getElementById('autor').value = noticia.autor;
                document.getElementById('conteudo').value = noticia.conteudo;
                document.getElementById('imagemPrincipal').value = noticia.imagem_pincipal;
                document.getElementById('destaque').checked = noticia.destaque;

                // Clear existing complementary image inputs
                imagensContainer.innerHTML = '';
                // Add input rows for each existing complementary image
                if (noticia.imagens_complementares && noticia.imagens_complementares.length > 0) {
                    noticia.imagens_complementares.forEach(img => {
                        addImageInputRow(img.src, img.descricao);
                    });
                }
            })
            .catch(error => console.error('Erro ao carregar notícia para edição:', error));
    };

    // Delete news
    const deleteNoticia = (id) => {
        if (confirm('Tem certeza que deseja excluir esta notícia?')) { // Temporary confirm for debugging
            fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            })
            .then(res => {
                if (!res.ok) {
                    console.error('Erro na requisição:', res.statusText);
                    alert(`Erro ao excluir notícia: ${res.statusText}`); // Temporary alert for debugging
                    throw new Error('Erro na requisição: ' + res.statusText);
                }
                alert('Notícia excluída com sucesso!'); // Temporary alert for debugging
                fetchNoticiasForCadastro(); // Refresh the list
            })
            .catch(error => console.error('Erro ao excluir notícia:', error));
        }
    };

    // Clear form button functionality
    limparFormButton.addEventListener('click', () => {
        noticiaForm.reset();
        noticiaIdInput.value = '';
        imagensContainer.innerHTML = ''; // Clear complementary images on form reset
    });
}


document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('sliderDestaques')) renderIndex();
  if (document.getElementById('detalheNoticia')) renderDetalhe();
  if (document.getElementById('noticiaForm')) renderCadastro(); // Call renderCadastro for the new page
});
