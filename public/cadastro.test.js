const { validarCriteriosSenha, validarCadastroEmpresa, verificarCoincidenciaSenha } = require('./cadastro');

// agrupa os testes de senha pra ficar organizado
describe("Validação de critérios de senha", () => {

  test("senha com menos de 8 caracteres falha no comprimento", () => {
    // testa senha curta
    const res = validarCriteriosSenha("Ab1!");
    expect(res.comprimento).toBe(false);
  });

  test("senha válida no comprimento", () => {
    // essa tem tamanho bom
    const res = validarCriteriosSenha("Abcdef12!");
    expect(res.comprimento).toBe(true);
  });

  test("senha precisa conter número", () => {
    // senha sem numero tem que falhar
    const res = validarCriteriosSenha("Abcdefgh!");
    expect(res.numero).toBe(false);
  });

  test("senha com número deve passar", () => {
    const res = validarCriteriosSenha("Abcdef1!");
    expect(res.numero).toBe(true);
  });

  test("senha precisa conter caractere especial", () => {
    // sem simbolo especial nao pode passar
    const res = validarCriteriosSenha("Abcdef12");
    expect(res.especial).toBe(false);
  });

  test("senha com caractere especial deve passar", () => {
    const res = validarCriteriosSenha("Abcdef12!");
    expect(res.especial).toBe(true);
  });

  test("senha precisa ter letra maiúscula", () => {
    // tudo minusculo nao pode
    const res = validarCriteriosSenha("abcdef12!");
    expect(res.maiuscula).toBe(false);
  });

  test("senha com letra maiúscula deve passar", () => {
    const res = validarCriteriosSenha("Abcdef12!");
    expect(res.maiuscula).toBe(true);
  });


  // confere se os campos de senha e confirmacao batem
  test("as senhas devem ser iguais", () => {
    const res = verificarCoincidenciaSenha("Abcdef12", "Abcdef12");
    expect(res.valido).toBe(true);
  });

  test("retorna erro se as senhas forem diferentes", () => {
    const res = verificarCoincidenciaSenha("Abcdef12", "Abcddef12");
    expect(res.valido).toBe(false);
    expect(res.erro).toBe("As senhas não coincidem");
  });

});


// funcoes so pra simular a limpeza do cnpj e telefone
function mockDesformatarCNPJ(cnpj) {
  return cnpj.replace(/\D/g, "");
}

function mockDesformatarTell(tell) {
  return tell.replace(/\D/g, "");
}

test("retorna erro se faltarem campos", () => {
  // razao social vazia 
  const res = validarCadastroEmpresa({
    razaoEmp: "",
    nomeEmp: "Empresa X",
    emailEmp: "empresa@email.com",
    cnpjEmp: "11.111.111/1111-11",
    senhaEmp: "Senha@1234",
    telefoneEmp: "(11) 98888-7777"
  }, mockDesformatarCNPJ, mockDesformatarTell);

  // tem que dar erro
  expect(res.valido).toBe(false);
  expect(res.erro).toBe("Preencha todos os campos!");
});

test("monta o objeto final corretamente", () => {
  // mando os dados sujos
  const res = validarCadastroEmpresa({
    razaoEmp: "Razão",
    nomeEmp: "Fantasia",
    emailEmp: "empresa@email.com",
    cnpjEmp: "11.111.111/1111-11",
    senhaEmp: "Senha@123",
    telefoneEmp: "(11) 98888-7777"
  }, mockDesformatarCNPJ, mockDesformatarTell);

  expect(res.valido).toBe(true);
  
  // verifica se ele limpou o cnpj e telefone no objeto final
  expect(res.corpo).toEqual({
    razaoEmp: "Razão",
    nomeEmp: "Fantasia",
    emailEmp: "empresa@email.com",
    cnpjEmp: "11111111111111",
    senhaEmp: "Senha@123",
    telefoneEmp: "11988887777"
  });
});