const { validarEntradaLogin, processarDadosSessao } = require('./login');

describe("Validação de Entrada (Login)", () => {
    
    test("Deve retornar falso se o email estiver vazio", () => {
        const resultado = validarEntradaLogin("", "123456B!");
        expect(resultado.valido).toBe(false);
        expect(resultado.erro).toBe("Preencha todos os campos!");
    });

    test("Deve retornar falso se a senha estiver vazia", () => {
        const resultado = validarEntradaLogin("usuario@teste.com", "");
        expect(resultado.valido).toBe(false);
        expect(resultado.erro).toBe("Preencha todos os campos!");
    });

    test("Deve retornar verdadeiro se ambos os campos estiverem preenchidos", () => {
        const resultado = validarEntradaLogin("usuario@teste.com", "123456B!");
        expect(resultado.valido).toBe(true);
    });

});


describe("Processamento de Dados da Sessão (SessionStorage)", () => {

    const idUsuarioMock = 10;
    
    const respostaEmpresaMock = [{
        email: "empresa@hexacore.com",
        nomeFantasia: "HexaCore",
        razaoSocial: "HexaCore Consulting",
        cnpj: "99.999.999/0001-99",
        telefone: "(11) 90000-0000"
    }];

    const respostaEnderecoMock = [{
        cep: "01310-100",
        logradouro: "Avenida Paulista",
        numero: "1000",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        uf: "SP"
    }];

    test("Deve gerar o objeto de sessão corretamente com endereço completo", () => {
        const resultadoSessao = processarDadosSessao(idUsuarioMock, respostaEmpresaMock, respostaEnderecoMock);

        // verifica os dados principais
        expect(resultadoSessao.ID_USUARIO).toBe(10);
        expect(resultadoSessao.EMAIL_USUARIO).toBe("empresa@hexacore.com");
        expect(resultadoSessao.NOME_USUARIO).toBe("HexaCore");
        
        // verifica os dados de endereço
        expect(resultadoSessao.CEP).toBe("01310-100");
        expect(resultadoSessao.LOGRADOURO).toBe("Avenida Paulista");
        expect(resultadoSessao.UF).toBe("SP");
    });

    test("Deve gerar o objeto de sessão corretamente sem endereço", () => {
        // simulando uma empresa que acabou de cadastrar e ainda não tem endereço
        const resultadoSessao = processarDadosSessao(idUsuarioMock, respostaEmpresaMock, []);

        // os dados da empresa devem estar la
        expect(resultadoSessao.ID_USUARIO).toBe(10);
        expect(resultadoSessao.CNPJ).toBe("99.999.999/0001-99");

        // os dados de endereço devem ser undefined 
        expect(resultadoSessao.CEP).toBeUndefined();
        expect(resultadoSessao.LOGRADOURO).toBeUndefined();
    });

    test("Deve gerar o objeto de sessão corretamente sem endereço", () => {
        // simulando caso o backend retorne null por algum erro
        const resultadoSessao = processarDadosSessao(idUsuarioMock, respostaEmpresaMock, null);

        expect(resultadoSessao.NOME_USUARIO).toBe("HexaCore");
        expect(resultadoSessao.CIDADE).toBeUndefined();
    });

});