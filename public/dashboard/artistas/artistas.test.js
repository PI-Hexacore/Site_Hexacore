const {
    alternarFormulario,
    formatarStreams,
    listarArtistas,
    cadastrarArtista,
    editarArtista,
    excluirArtista
} = require('./artistas');


const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    ID_USUARIO: '50' 
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

window.alert = jest.fn();
window.confirm = jest.fn();
window.prompt = jest.fn();

global.fetch = jest.fn();


describe("Funções Utilitárias", () => {
    test("formatarStreams deve formatar números corretamente", () => {
        expect(formatarStreams(1000)).toBe('1.000 streams');
        expect(formatarStreams(5000000)).toBe('5.000.000 streams');
    });

    test("formatarStreams deve tratar valores inválidos", () => {
        expect(formatarStreams(0)).toBe('Sem dados de streams');
        expect(formatarStreams(-50)).toBe('Sem dados de streams');
        expect(formatarStreams('texto')).toBe('Sem dados de streams');
    });
});

describe("Funcionalidades da Página de Artistas", () => {

    // html limpo para cada teste
    beforeEach(() => {
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
        
        jest.clearAllMocks();
        global.fetch.mockClear();
        window.alert.mockClear();
        window.confirm.mockClear();
        window.prompt.mockClear();
    });

    test("alternarFormulario deve adicionar/remover classe CSS", () => {
        const wrapper = document.getElementById('formArtistaWrapper');
        
        // testa toggle 
        alternarFormulario();
        expect(wrapper.classList.contains('aberta')).toBe(true);
        
        alternarFormulario();
        expect(wrapper.classList.contains('aberta')).toBe(false);

    });

    test("listarArtistas deve buscar dados e renderizar cards", async () => {
        const listaMock = [
            { id_artista: 1, nm_artista: 'Legião Urbana', ds_genero_musical: 'Rock', total_streams: 1000 }
        ];

        // simula resposta
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ data: listaMock })
        });

        await listarArtistas();

        const listaElemento = document.getElementById('listaArtistas');
        
        // verifica se chamou o fetch correto
        expect(global.fetch).toHaveBeenCalledWith('/artistas', expect.objectContaining({
            headers: { 'x-user-id': '50' }
        }));

        // verifica se o HTML foi criado 
        expect(listaElemento.innerHTML).toContain('Legião Urbana');
        expect(listaElemento.innerHTML).toContain('1.000 streams');
    });

    test("cadastrarArtista deve enviar POST com dados do formulário", async () => {
        const eventoMock = { preventDefault: jest.fn() };
        
        // mock resposta de sucesso
        global.fetch.mockResolvedValue({ ok: true });

        await cadastrarArtista(eventoMock);

        expect(eventoMock.preventDefault).toHaveBeenCalled();
        
        // verifica se enviou o JSON correto
        expect(global.fetch).toHaveBeenCalledWith('/artistas', expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"nm_artista":"Artista Teste"'),
            headers: expect.objectContaining({ 'x-user-id': '50' })
        }));
    });

    test("cadastrarArtista deve barrar nome vazio", async () => {
        const eventoMock = { preventDefault: jest.fn() };
        
        document.querySelector('input[name="nm_artista"]').value = "";

        await cadastrarArtista(eventoMock);

        expect(window.alert).toHaveBeenCalledWith('Informe o nome do artista.');
        expect(global.fetch).not.toHaveBeenCalled(); 
    });

    test("excluirArtista deve pedir confirmação e enviar DELETE", async () => {
        window.confirm.mockReturnValue(true);
        global.fetch.mockResolvedValue({ ok: true });

        await excluirArtista(123);

        expect(window.confirm).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledWith('/artistas/123', expect.objectContaining({
            method: 'DELETE'
        }));
    });

    test("excluirArtista cancela se usuário clicar em Cancelar", async () => {
        window.confirm.mockReturnValue(false);

        await excluirArtista(123);

        expect(global.fetch).not.toHaveBeenCalled();
    });

    test("editarArtista deve pedir novos dados via prompt e enviar PUT", async () => {

        window.prompt
            .mockReturnValueOnce("Novo Nome") 
            .mockReturnValueOnce("Novo Gênero");

        global.fetch.mockResolvedValue({ ok: true });

        const artistaMock = { id_artista: 10, nm_artista: 'Antigo', ds_genero_musical: 'Antigo' };

        await editarArtista(artistaMock);

        expect(window.prompt).toHaveBeenCalledTimes(2);
        
        expect(global.fetch).toHaveBeenCalledWith('/artistas/10', expect.objectContaining({
            method: 'PUT',
            body: expect.stringContaining('"nm_artista":"Novo Nome"')
        }));
    });

});