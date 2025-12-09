/**
 * @jest-environment jsdom
 */

const { 
    validarDadosEmpresa, 
    validarDadosEndereco,
    atualizarEmpresa,
    deletarUsuario 
} = require('./perfil.js');

describe('Lógica de Validação - Perfil', () => {
    
    // --- testes de empresa ---
    test('Deve validar erro se faltar campos na empresa', () => {
        // objeto faltando cnpj de proposito
        const dadosInvalidos = {
            razaoSocial: "",
            nomeFantasia: "Hexa",
            cnpj: "", // faltando
            email: "teste@email.com",
            telefone: "11999999999"
        };
        const res = validarDadosEmpresa(dadosInvalidos);
        
        // espero que de erro
        expect(res.valido).toBe(false);
        expect(res.erro).toContain("Preencha todos os campos");
    });

    test('Deve validar erro se as senhas não coincidirem', () => {
        const dadosSenhaErrada = {
            razaoSocial: "Hexa",
            nomeFantasia: "Hexa",
            cnpj: "123",
            email: "a@a.com",
            telefone: "123",
            senha: "123",
            confirmeSenha: "456" // diferente da senha
        };
        const res = validarDadosEmpresa(dadosSenhaErrada);
        expect(res.valido).toBe(false);
        expect(res.erro).toContain("senhas não coincidem");
    });

    test('Deve validar sucesso e enviar senha null se estiver vazia', () => {
        const dadosSemSenha = {
            razaoSocial: "Hexa",
            nomeFantasia: "Hexa",
            cnpj: "123",
            email: "a@a.com",
            telefone: "123",
            senha: "", // vazia
            confirmeSenha: ""
        };
        const res = validarDadosEmpresa(dadosSemSenha);
        
        expect(res.valido).toBe(true);
        // garante que manda null pra nao bugar o banco
        expect(res.corpo.senha).toBeNull();
    });

    // --- testes de endereco ---
    test('Deve validar erro se faltar campos no endereço', () => {
        const enderecoInvalido = {
            cep: "", // vazio
            logradouro: "Rua A",
            numero: "10",
            bairro: "B",
            cidade: "C",
            uf: "SP"
        };
        const res = validarDadosEndereco(enderecoInvalido);
        expect(res.valido).toBe(false);
        expect(res.erro).toContain("Preencha todos os campos");
    });

    test('Deve validar sucesso com endereço completo', () => {
        const enderecoValido = {
            cep: "00000-000",
            logradouro: "Rua A",
            numero: "10",
            bairro: "B",
            cidade: "C",
            uf: "SP"
        };
        const res = validarDadosEndereco(enderecoValido);
        expect(res.valido).toBe(true);
        expect(res.corpo).toEqual(enderecoValido);
    });
});

describe('Integração com DOM - Atualizar e Deletar', () => {
    
    // roda antes de cada teste pra limpar o ambiente
    beforeEach(() => {
        // crio o html mockado com os inputs que o js vai buscar
        document.body.innerHTML = `
            <input id="razaoSocial" value="Hexa Ltda">
            <input id="nomeFantasia" value="Hexa">
            <input id="cnpj" value="12345678000199">
            <input id="email" value="admin@hexa.com">
            <input id="telefone" value="11999999999">
            <input id="cep" value="00000-000">
            <input id="logradouro" value="Rua A">
            <input id="numero" value="10">
            <input id="bairro" value="Bairro B">
            <input id="cidade" value="Cidade C">
            <input id="uf" value="SP">
            <input id="senha" value="">
            <input id="confirmeSenha" value="">
        `;
        
        // crio funcoes falsas (mocks) pro navegador nao reclamar
        global.fetch = jest.fn();
        global.alert = jest.fn();
        global.confirm = jest.fn();
        
        // simulo o sessionstorage pra ter o id do usuario logado
        const sessionStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            ID_USUARIO: '100',
            NOME_USUARIO: 'Hexa'
        };
        
        // mock na janela global
        Object.defineProperty(window, 'sessionStorage', {
            value: sessionStorageMock,
            writable: true
        });
        
        // zera o contador de chamadas dos mocks pra nao atrapalhar o proximo teste
        jest.clearAllMocks();
    });

    test('atualizarEmpresa: deve chamar fetch com método PATCH', async () => {
        // simula o backend respondendo ok
        fetch.mockResolvedValueOnce({ ok: true });

        await atualizarEmpresa();

        // verifica se chamou a api certa e mandou o json certo
        expect(fetch).toHaveBeenCalledWith("/empresas/atualizar/100", expect.objectContaining({
            method: "PATCH",
            body: expect.stringContaining('"razaoSocial":"Hexa Ltda"')
        }));
    });

    test('deletarUsuario: deve chamar DELETE se usuário confirmar', async () => {
        // simula usuario clicando em OK no confirm
        global.confirm.mockReturnValue(true); 
        fetch.mockResolvedValueOnce({ ok: true });

        await deletarUsuario();

        // tem que ter chamado o confirm e o fetch delete
        expect(global.confirm).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith("/empresas/deletar/100", expect.objectContaining({
            method: "DELETE"
        }));
    });

    test('deletarUsuario: NÃO deve chamar fetch se usuário cancelar', async () => {
        // simula usuario clicando em CANCELAR
        global.confirm.mockReturnValue(false); 

        await deletarUsuario();

        // garante que nao tentou apagar nada no banco
        expect(fetch).not.toHaveBeenCalled();
    });
});