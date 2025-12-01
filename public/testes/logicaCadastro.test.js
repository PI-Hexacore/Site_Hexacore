const { validarCriteriosSenha, validarCadastroEmpresa, verificarCoincidenciaSenha } = require('./logicaCadastro');


describe("Validação de critérios de senha", () => {

  test("senha com menos de 8 caracteres falha no comprimento", () => {
    const res = validarCriteriosSenha("Ab1!");
    expect(res.comprimento).toBe(false);
  });

  test("senha válida no comprimento", () => {
    const res = validarCriteriosSenha("Abcdef12!");
    expect(res.comprimento).toBe(true);
  });

  test("senha precisa conter número", () => {
    const res = validarCriteriosSenha("Abcdefgh!");
    expect(res.numero).toBe(false);
  });

  test("senha com número deve passar", () => {
    const res = validarCriteriosSenha("Abcdef1!");
    expect(res.numero).toBe(true);
  });

  test("senha precisa conter caractere especial", () => {
    const res = validarCriteriosSenha("Abcdef12");
    expect(res.especial).toBe(false);
  });

  test("senha com caractere especial deve passar", () => {
    const res = validarCriteriosSenha("Abcdef12!");
    expect(res.especial).toBe(true);
  });

  test("senha precisa ter letra maiúscula", () => {
    const res = validarCriteriosSenha("abcdef12!");
    expect(res.maiuscula).toBe(false);
  });

  test("senha com letra maiúscula deve passar", () => {
    const res = validarCriteriosSenha("Abcdef12!");
    expect(res.maiuscula).toBe(true);
  });



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



function mockDesformatarCNPJ(cnpj) {
  return cnpj.replace(/\D/g, "");
}

function mockDesformatarTell(tell) {
  return tell.replace(/\D/g, "");
}

test("retorna erro se faltarem campos", () => {
  const res = validarCadastroEmpresa({
    razaoEmp: "",
    nomeEmp: "Empresa X",
    emailEmp: "empresa@email.com",
    cnpjEmp: "11.111.111/1111-11",
    senhaEmp: "Senha@1234",
    telefoneEmp: "(11) 98888-7777"
  }, mockDesformatarCNPJ, mockDesformatarTell);

  expect(res.valido).toBe(false);
  expect(res.erro).toBe("Preencha todos os campos!");
});

test("monta o objeto final corretamente", () => {
  const res = validarCadastroEmpresa({
    razaoEmp: "Razão",
    nomeEmp: "Fantasia",
    emailEmp: "empresa@email.com",
    cnpjEmp: "11.111.111/1111-11",
    senhaEmp: "Senha@123",
    telefoneEmp: "(11) 98888-7777"
  }, mockDesformatarCNPJ, mockDesformatarTell);

  expect(res.valido).toBe(true);
  expect(res.corpo).toEqual({
    razaoEmp: "Razão",
    nomeEmp: "Fantasia",
    emailEmp: "empresa@email.com",
    cnpjEmp: "11111111111111",
    senhaEmp: "Senha@123",
    telefoneEmp: "11988887777"
  });
});
