const listaArtistasElemento = document.getElementById('listaArtistas');
const formArtistaWrapper = document.getElementById('formArtistaWrapper');
const formArtista = document.getElementById('formArtista');
const btnToggleForm = document.getElementById('btnToggleForm');
const btnCancelar = document.getElementById('btnCancelar');
const numeroFormatter = new Intl.NumberFormat('pt-BR');

function alternarFormulario(exibir) {
    if (!formArtistaWrapper) {
        return;
    }

    if (typeof exibir === 'boolean') {
        formArtistaWrapper.classList.toggle('aberta', exibir);
    } else {
        formArtistaWrapper.classList.toggle('aberta');
    }
}

function criarElemento(tipo, classe) {
    const elemento = document.createElement(tipo);
    if (classe) {
        elemento.className = classe;
    }
    return elemento;
}

function formatarStreams(valor) {
    const numero = Number(valor);
    if (!Number.isFinite(numero) || numero <= 0) {
        return 'Sem dados de streams';
    }

    return `${numeroFormatter.format(numero)} streams`;
}

function renderizarLista(artistas = []) {
    if (!listaArtistasElemento) {
        return;
    }

    listaArtistasElemento.innerHTML = '';

    if (!artistas.length) {
        const mensagem = criarElemento('p', 'lista-vazia');
        mensagem.textContent = 'Nenhum artista cadastrado ainda. Adicione o primeiro!';
        listaArtistasElemento.appendChild(mensagem);
        return;
    }

    artistas.forEach((artista) => {
        const card = criarElemento('article', 'artist-card');

        const avatar = criarElemento('div', 'artist-avatar');
        avatar.textContent = (artista.nm_artista || '?').charAt(0).toUpperCase();

        const info = criarElemento('div', 'artist-info');
        const titulo = criarElemento('h3');
        titulo.textContent = artista.nm_artista;
        const descricao = criarElemento('p');
        const genero = artista.ds_genero_musical ? artista.ds_genero_musical : 'Gênero não informado';
        descricao.textContent = `Dados do artista: ${formatarStreams(artista.total_streams)} | Gênero: ${genero}`;
        info.appendChild(titulo);
        info.appendChild(descricao);

        const acoes = criarElemento('div', 'artist-actions');
        const btnEditar = criarElemento('button', 'btn btn-edit');
        btnEditar.type = 'button';
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => editarArtista(artista));

        const btnExcluir = criarElemento('button', 'btn btn-delete');
        btnExcluir.type = 'button';
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', () => excluirArtista(artista.id_artista));

        acoes.appendChild(btnEditar);
        acoes.appendChild(btnExcluir);

        card.appendChild(avatar);
        card.appendChild(info);
        card.appendChild(acoes);

        listaArtistasElemento.appendChild(card);
    });
}

async function listarArtistas() {
    const idUsuario = sessionStorage.ID_USUARIO;
    if (!idUsuario) {
        return;
    }

    if (listaArtistasElemento) {
        listaArtistasElemento.innerHTML = '<p class="lista-vazia">Carregando artistas...</p>';
    }

    try {
        const resposta = await fetch('/artistas', {
            headers: {
                'x-user-id': idUsuario
            }
        });

        if (!resposta.ok) {
            throw new Error('Erro ao buscar artistas');
        }

        const payload = await resposta.json();
        renderizarLista(payload?.data || payload || []);
    } catch (erro) {
        console.error('Erro ao listar artistas:', erro);
        if (listaArtistasElemento) {
            listaArtistasElemento.innerHTML = '<p class="lista-vazia">Não foi possível carregar os artistas.</p>';
        }
    }
}

async function cadastrarArtista(evento) {
    evento.preventDefault();

    const idUsuario = sessionStorage.ID_USUARIO;
    if (!idUsuario || !formArtista) {
        return;
    }

    const dadosFormulario = new FormData(formArtista);
    const payload = Object.fromEntries(dadosFormulario.entries());
    payload.nm_artista = (payload.nm_artista || '').trim();
    payload.ds_genero_musical = (payload.ds_genero_musical || '').trim();

    if (!payload.nm_artista) {
        alert('Informe o nome do artista.');
        return;
    }

    try {
        const resposta = await fetch('/artistas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': idUsuario
            },
            body: JSON.stringify(payload)
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({}));
            throw new Error(erro.message || 'Erro ao cadastrar artista');
        }

        formArtista.reset();
        alternarFormulario(false);
        listarArtistas();
    } catch (erro) {
        console.error('Erro ao cadastrar artista:', erro);
        alert(erro.message || 'Erro ao cadastrar artista.');
    }
}

async function editarArtista(artista) {
    const idUsuario = sessionStorage.ID_USUARIO;
    if (!idUsuario) {
        return;
    }

    const novoNome = prompt('Atualize o nome do artista:', artista.nm_artista || '');
    if (novoNome === null) {
        return;
    }

    const nomeFinal = novoNome.trim();
    if (!nomeFinal) {
        alert('O nome do artista é obrigatório.');
        return;
    }

    const novoGenero = prompt('Atualize o gênero musical:', artista.ds_genero_musical || '') || '';

    const payload = {
        nm_artista: nomeFinal,
        ds_genero_musical: novoGenero.trim(),
        fk_dados_spotify_top: artista.fk_dados_spotify_top || '',
        fk_dados_spotify_youtube: artista.fk_dados_spotify_youtube || ''
    };

    try {
        const resposta = await fetch(`/artistas/${artista.id_artista}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': idUsuario
            },
            body: JSON.stringify(payload)
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({}));
            throw new Error(erro.message || 'Erro ao atualizar artista');
        }

        listarArtistas();
    } catch (erro) {
        console.error('Erro ao editar artista:', erro);
        alert(erro.message || 'Erro ao editar artista.');
    }
}

async function excluirArtista(idArtista) {
    const idUsuario = sessionStorage.ID_USUARIO;
    if (!idUsuario) {
        return;
    }

    if (!confirm('Deseja realmente excluir este artista?')) {
        return;
    }

    try {
        const resposta = await fetch(`/artistas/${idArtista}`, {
            method: 'DELETE',
            headers: {
                'x-user-id': idUsuario
            }
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({}));
            throw new Error(erro.message || 'Erro ao excluir artista');
        }

        listarArtistas();
    } catch (erro) {
        console.error('Erro ao excluir artista:', erro);
        alert(erro.message || 'Erro ao excluir artista.');
    }
}

function iniciarPaginaArtistas() {
    if (typeof validarSessao === 'function' && !validarSessao()) {
        return;
    }

    listarArtistas();

    if (btnToggleForm) {
        btnToggleForm.addEventListener('click', () => alternarFormulario());
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            formArtista?.reset();
            alternarFormulario(false);
        });
    }

    if (formArtista) {
        formArtista.addEventListener('submit', cadastrarArtista);
    }
}

window.addEventListener('load', iniciarPaginaArtistas);


if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        alternarFormulario,
        formatarStreams,
        renderizarLista,
        listarArtistas,
        cadastrarArtista,
        editarArtista,
        excluirArtista,
    };
}
