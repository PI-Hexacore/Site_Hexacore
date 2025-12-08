/**
 * @jest-environment jsdom
 */

const {
    alternarFormulario,
    formatarStreams,
    listarArtistas,
    cadastrarArtista,
    editarArtista,
    excluirArtista
} = require('./artistas');

describe("Funcionalidades da Página de Artistas", () => {

    // roda antes de cada teste pra garantir que o ambiente ta limpo
    beforeEach(() => {
        // reseta o html simulado pra nao sobrar lixo de outro teste
        document.body.innerHTML = `
            <div id="listaArtistas"></div>
            <div id="formArtistaWrapper"></div>
            <form id="formArtista">
                <input name="nm_artista" value="Artista Teste" />
                <input name="ds_genero_musical" value="Rock" />
            </form>
            <button id="btnToggleForm"></button>
            <button id="btnCancelar"></button>
        `;
        
        // o jest roda no node e nao tem sessionstorage, entao criei esse objeto 
        const sessionStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            ID_USUARIO: '50' // deixei fixo pra facilitar
        };
        
        // injeto o mock na janela global
        Object.defineProperty(window, 'sessionStorage', {
            value: sessionStorageMock,
            writable: true 
        });

        // crio funcoes vazias (mocks) pro jest nao reclamar que nao existe alert/confirm
        window.alert = jest.fn();
        window.confirm = jest.fn();
        window.prompt = jest.fn();
        global.fetch = jest.fn(); // o fetch tambem precisa ser mockado

        // zera o contador de chamadas dos mocks
        jest.clearAllMocks();
    });

    // aqui testo so as funcoes que nao mexem no html
    describe("Funções Utilitárias", () => {
        test("formatarStreams deve formatar números corretamente", () => {
            expect(formatarStreams(1000)).toBe('1.000 streams');
            expect(formatarStreams(5000000)).toBe('5.000.000 streams');
        });

        test("formatarStreams deve tratar valores inválidos", () => {
            // garante que nao quebra se vier zero ou lixo
            expect(formatarStreams(0)).toBe('Sem dados de streams');
            expect(formatarStreams(-50)).toBe('Sem dados de streams');
            expect(formatarStreams('texto')).toBe('Sem dados de streams');
        });
    });

    // testes pesados que simulam cliques e chamadas de api
    test("alternarFormulario deve adicionar/remover classe CSS", () => {
        const wrapper = document.getElementById('formArtistaWrapper');
        
        // abriu
        alternarFormulario();
        expect(wrapper.classList.contains('aberta')).toBe(true);
        
        // fechou
        alternarFormulario();
        expect(wrapper.classList.contains('aberta')).toBe(false);
    });

    test("listarArtistas deve buscar dados e renderizar cards", async () => {
        const listaMock = [
            { id_artista: 1, nm_artista: 'Legião Urbana', ds_genero_musical: 'Rock', total_streams: 1000 }
        ];

        // finge que o backend respondeu com sucesso e trouxe a lista
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ data: listaMock })
        });

        await listarArtistas();

        const listaElemento = document.getElementById('listaArtistas');
        
        // confere se mandou o header de usuario certo
        expect(global.fetch).toHaveBeenCalledWith('/artistas', expect.objectContaining({
            headers: { 'x-user-id': '50' }
        }));

        // vê se o html dos cards foi criado
        expect(listaElemento.innerHTML).toContain('Legião Urbana');
        expect(listaElemento.innerHTML).toContain('1.000 streams');
    });

    test("cadastrarArtista deve enviar POST com dados do formulário", async () => {
        const eventoMock = { preventDefault: jest.fn() };
        
        // retorno um json vazio no sucesso pro codigo nao quebrar quando tentar atualizar a lista
        global.fetch.mockResolvedValue({ 
            ok: true, 
            json: async () => ({}) 
        });

        await cadastrarArtista(eventoMock);

        // garante que nao recarregou a pagina
        expect(eventoMock.preventDefault).toHaveBeenCalled();
        
        // confere se o fetch foi um POST com o body certo
        expect(global.fetch).toHaveBeenCalledWith('/artistas', expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"nm_artista":"Artista Teste"'),
            headers: expect.objectContaining({ 'x-user-id': '50' })
        }));
    });

    test("cadastrarArtista deve barrar nome vazio", async () => {
        const eventoMock = { preventDefault: jest.fn() };
        
        // simulo o usuario limpando o campo de nome
        document.querySelector('input[name="nm_artista"]').value = "";

        await cadastrarArtista(eventoMock);

        // tem que dar alert e nao pode chamar o backend
        expect(window.alert).toHaveBeenCalledWith('Informe o nome do artista.');
        expect(global.fetch).not.toHaveBeenCalled(); 
    });

    test("excluirArtista deve pedir confirmação e enviar DELETE", async () => {
        // simulo o usuario clicando em OK
        window.confirm.mockReturnValue(true);
        
        global.fetch.mockResolvedValue({ 
            ok: true,
            json: async () => ({})
        });

        await excluirArtista(123);

        // verifica se apareceu o confirm e se mandou o delete pro id 123
        expect(window.confirm).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledWith('/artistas/123', expect.objectContaining({
            method: 'DELETE'
        }));
    });

    test("excluirArtista cancela se usuário clicar em Cancelar", async () => {
        // usuario clicou em cancelar
        window.confirm.mockReturnValue(false);

        await excluirArtista(123);

        // nao pode ter chamado o fetch
        expect(global.fetch).not.toHaveBeenCalled();
    });

    test("editarArtista deve pedir novos dados via prompt e enviar PUT", async () => {
        // mocka as duas vezes que o prompt aparece (nome e genero)
        window.prompt
            .mockReturnValueOnce("Novo Nome") 
            .mockReturnValueOnce("Novo Gênero");

        global.fetch.mockResolvedValue({ 
            ok: true,
            json: async () => ({})
        });

        const artistaMock = { id_artista: 10, nm_artista: 'Antigo', ds_genero_musical: 'Antigo' };

        await editarArtista(artistaMock);

        expect(window.prompt).toHaveBeenCalledTimes(2);
        
        // verifica se mandou os dados novos via PUT
        expect(global.fetch).toHaveBeenCalledWith('/artistas/10', expect.objectContaining({
            method: 'PUT',
            body: expect.stringContaining('"nm_artista":"Novo Nome"')
        }));
    });

});