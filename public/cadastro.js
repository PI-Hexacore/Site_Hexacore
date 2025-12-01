
function desformatarCNPJ(cnpjFormatado) {
    return cnpjFormatado.replace(/\D/g, "");
}

function desformatarCEP(cepFormatado) {
    return cepFormatado.replace(/\D/g, "");
}

function desformatarTell(tellFormatado) {
    return tellFormatado.replace(/\D/g, "");
}

function validarCriteriosSenha(senhaValor) {
    const comprimento = senhaValor.length >= 8;
    const numero = /[0-9]/.test(senhaValor);
    const especial = /[^A-Za-z0-9]/.test(senhaValor);
    const maiuscula = /[A-Z]/.test(senhaValor);

    return {
        comprimento: comprimento,
        numero: numero,
        especial: especial,
        maiuscula: maiuscula
    };
}

function verificarCoincidenciaSenha(senha1, senha2) {
    if (senha1 === senha2) {
        return { valido: true };
    } else {
        return { valido: false, erro: "As senhas não coincidem" };
    }
}

function validarCadastroEmpresa(dados, funcDesformatarCNPJ, funcDesformatarTell) {
    const { razaoEmp, nomeEmp, emailEmp, cnpjEmp, senhaEmp, telefoneEmp } = dados;

    if (!razaoEmp || !nomeEmp || !emailEmp || !cnpjEmp || !senhaEmp || !telefoneEmp) {
        return { valido: false, erro: "Preencha todos os campos!" };
    }

    const cnpjLimpo = funcDesformatarCNPJ(cnpjEmp);
    const tellLimpo = funcDesformatarTell(telefoneEmp);

    const corpoFinal = {
        razaoEmp,
        nomeEmp,
        emailEmp,
        cnpjEmp: cnpjLimpo,
        senhaEmp,
        telefoneEmp: tellLimpo
    };

    return { valido: true, corpo: corpoFinal };
}



// funcional

if (typeof document !== 'undefined') {
    const cnpjInput = document.getElementById('cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function (event) {
            let valor = event.target.value.replace(/\D/g, '');
            valor = valor.slice(0, 14);
            valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
            valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
            valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
            event.target.value = valor;
        });
    }
}

function irParaEtapa(numero) {
    if (numero === 1) {
        etapa_1.style.display = "block";
        etapa_2.style.display = "none";
        razao_social.focus();
    } else if (numero === 2) {
        if (razao_social.value === "" || nome_fantasia.value === "" || cnpj.value === "" || email.value === "" || senha.value === "") {
            alert("Preencha todos os campos obrigatórios da etapa 1 antes de continuar.");
            return;
        }
        etapa_1.style.display = "none";
        etapa_2.style.display = "block";
        tipoLogradouro.focus();
    }
}

function validarSenha() {
    var senhaValor = document.getElementById("senha").value;
    var criterioComprimento = document.getElementById("criterio_comprimento");
    var criterioNumero = document.getElementById("criterio_numero");
    var criterioEspecial = document.getElementById("criterio_especial");
    var criterioMaiuscula = document.getElementById("criterio_maiuscula");
    var dicasSenha = document.getElementById("dicas_senha");

    if (senhaValor.length > 0) {
        dicasSenha.style.display = "block";
    } else {
        dicasSenha.style.display = "none";
    }

    var validacao = validarCriteriosSenha(senhaValor);

    if (validacao.comprimento) criterioComprimento.classList.add("valido");
    else criterioComprimento.classList.remove("valido");

    if (validacao.numero) criterioNumero.classList.add("valido");
    else criterioNumero.classList.remove("valido");

    if (validacao.especial) criterioEspecial.classList.add("valido");
    else criterioEspecial.classList.remove("valido");

    if (validacao.maiuscula) criterioMaiuscula.classList.add("valido");
    else criterioMaiuscula.classList.remove("valido");
}

function verificarSenhas() {
    var senhaValor = document.getElementById("senha").value;
    var confirmarValor = document.getElementById("confirmarSenha").value;
    var mensagem = document.getElementById("mensagem_coincide");
    var dicasSenha = document.getElementById("dicas_senha");

    if (senhaValor.length > 0) dicasSenha.style.display = "block";

    if (confirmarValor.length === 0) {
        mensagem.textContent = "";
        return;
    }

    var resultado = verificarCoincidenciaSenha(senhaValor, confirmarValor);

    if (resultado.valido) {
        mensagem.textContent = "As senhas coincidem!";
        mensagem.style.color = "green";
    } else {
        mensagem.textContent = "As senhas não coincidem!";
        mensagem.style.color = "red";
    }
}

function formatarCEP() {
    var valor = cep.value;
    var numeros = valor.replace(/\D/g, "");
    var formatado = "";
    if (numeros.length > 0) formatado = numeros.substring(0, 5);
    if (numeros.length > 5) formatado += "-" + numeros.substring(5, 8);
    cep.value = formatado;
}

function formatarTell() {
    var valor = telefone.value;
    var numeros = valor.replace(/\D/g, "");
    var formatado = "";
    if (numeros.length > 0) formatado = numeros.substring(0, 2);
    if (numeros.length > 2) formatado += " " + numeros.substring(2, 7);
    if (numeros.length > 7) formatado += "-" + numeros.substring(7, 11);
    telefone.value = formatado;
}

function cadastrarEmpresa() {
    var razaoEmp = document.getElementById("razao_social").value;
    var nomeEmp = document.getElementById("nome_fantasia").value;
    var emailEmp = document.getElementById("email").value;
    var cnpjEmp = document.getElementById("cnpj").value;
    var senhaEmp = document.getElementById("senha").value;
    var telefoneEmp = document.getElementById("telefone").value;

    var dados = {
        razaoEmp: razaoEmp,
        nomeEmp: nomeEmp,
        emailEmp: emailEmp,
        cnpjEmp: cnpjEmp,
        senhaEmp: senhaEmp,
        telefoneEmp: telefoneEmp
    };

    var resultadoValidacao = validarCadastroEmpresa(dados, desformatarCNPJ, desformatarTell);

    if (!resultadoValidacao.valido) {
        alert(resultadoValidacao.erro);
        return false;
    }

    return fetch("/empresas/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resultadoValidacao.corpo),
        })
        .then(function(resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                throw "Houve um erro ao tentar realizar o cadastro da empresa!";
            }
        });
}

function cadastrarEndereco(fkUsuario) {
    var tipoLogradouroEmp = tipoLogradouro.value;
    var LogradouroEmp = logradouro.value;
    var numLogradouroEmp = numLogradouro.value;
    var bairroEmp = bairro.value;
    var cidadeEmp = cidade.value;
    var ufEmp = uf.value;
    var cepEmp = cep.value;

    if (
        tipoLogradouroEmp === "" ||
        LogradouroEmp === "" ||
        numLogradouroEmp === "" ||
        bairroEmp === "" ||
        cidadeEmp === "" ||
        ufEmp === "" ||
        cepEmp === ""
    ) {
        alert("Preencha todos os campos!");
        return false;
    }

    var cepLimpo = desformatarCEP(cepEmp);

    return fetch("/endereco/cadastrar", { // adicionado 'return'
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tipoLogradouroEmp: tipoLogradouroEmp,
                logradouroEmp: LogradouroEmp,
                numeroEmp: numLogradouroEmp,
                bairroEmp: bairroEmp,
                cidadeEmp: cidadeEmp,
                ufEmp: ufEmp,
                cepEmp: cepLimpo,
                fkUsuario: fkUsuario // enviando id do usuário
            }),
        })
        .then(function(resposta) {
            if (resposta.ok) {
                return resposta.json().then(function(json) {
                    console.log("Endereço cadastrado:", json);
                    alert("Cadastro realizado com sucesso!");

                    window.location = "login.html";
                });
            } else {
                return resposta.text().then(function(texto) {
                    throw new Error("Houve um erro ao tentar realizar o cadastro do endereço: " + texto);
                });
            }
        });
}

function finalizarCadastro() {
    fetch("/empresas/contar")
        .then(function(respostaContagem) {
            if (!respostaContagem.ok) {
                throw new Error("Falha ao contar usuários.");
            }
            return respostaContagem.json();
        })
        .then(function(resultadoContagem) {
            let proximoId;
            if (resultadoContagem.total == null || resultadoContagem.total == 0) {
                proximoId = 1;
            } else {
                proximoId = resultadoContagem.total + 1;
            }

            return cadastrarEmpresa().then(function() {
                return cadastrarEndereco(proximoId);
            });
        })
        .catch(function(erro) {
            console.error(`#ERRO no fluxo de cadastro: ${erro}`);
            alert("Ocorreu um erro crítico durante o cadastro. Por favor, tente novamente.");
        });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validarCriteriosSenha,
        validarCadastroEmpresa,
        verificarCoincidenciaSenha,
        desformatarCNPJ,
        desformatarTell
    };
}