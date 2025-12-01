// valida se pode prosseguir
function validarEntradaLogin(email, senha) {
    if (!email || !senha) {
        return { valido: false, erro: "Preencha todos os campos!" };
    }
    return { valido: true };
}

// organiza os dados para salvar na sessão 
function processarDadosSessao(idUsuario, empresaData, enderecoData) {
    const empresa = empresaData[0];
    // verifica se existe endereço e se o array não está vazio
    const endereco = (enderecoData && enderecoData.length > 0) ? enderecoData[0] : null;

    const dadosParaSessao = {
        ID_USUARIO: idUsuario,
        EMAIL_USUARIO: empresa.email,
        NOME_USUARIO: empresa.nomeFantasia,
        RAZAO_SOCIAL: empresa.razaoSocial,
        CNPJ: empresa.cnpj,
        TELEFONE: empresa.telefone
    };

    if (endereco) {
        dadosParaSessao.CEP = endereco.cep;
        dadosParaSessao.LOGRADOURO = endereco.logradouro;
        dadosParaSessao.NUMERO = endereco.numero;
        dadosParaSessao.BAIRRO = endereco.bairro;
        dadosParaSessao.CIDADE = endereco.cidade;
        dadosParaSessao.UF = endereco.uf;
    }

    return dadosParaSessao;
}

function entrar() {
    var emailVar = document.getElementById('login_email').value;
    var senhaVar = document.getElementById('login_senha').value;

    const validacao = validarEntradaLogin(emailVar, senhaVar);
    if (!validacao.valido) {
        alert(validacao.erro); 
        return false;
    }

    console.log("FORM LOGIN: ", emailVar);
    console.log("FORM SENHA: ", senhaVar);

    fetch("/empresas/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailEmp: emailVar,
            senhaEmp: senhaVar
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(json => {
                const idUsuario = json.id;

                Promise.all([
                    fetch(`/empresas/buscar/${idUsuario}`),
                    fetch(`/endereco/buscar/${idUsuario}`)
                ]).then(async ([resEmpresa, resEndereco]) => {
                    const empresaData = await resEmpresa.json();
                    const enderecoData = await resEndereco.json();

                    // 3. Processamento dos dados (Lógica testável)
                    const dadosSessao = processarDadosSessao(idUsuario, empresaData, enderecoData);

                    // Salva no sessionStorage
                    for (let chave in dadosSessao) {
                        sessionStorage[chave] = dadosSessao[chave];
                    }

                    // Redireciona
                    window.location = "./dashboard/dashboard.html";
                });
            });
        } else {
            resposta.text().then(texto => {
                console.error(texto);
                alert("Email ou senha inválidos!");
            });
        }
    }).catch(function (erro) {
        console.log(erro);
    });

    return false;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validarEntradaLogin,
        processarDadosSessao,
        entrar
    };
}