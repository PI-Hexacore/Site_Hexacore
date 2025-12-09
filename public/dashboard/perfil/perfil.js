// --- parte logica (testavel) ---

// valida os dados da empresa. separado pra conseguir testar sem precisar do html
function validarDadosEmpresa(dados) {
    const { razaoSocial, nomeFantasia, cnpj, email, telefone, senha, confirmeSenha } = dados;

    // verifica se tem algum campo vazio obrigatorio
    if (!razaoSocial || !nomeFantasia || !cnpj || !email || !telefone) {
        return { valido: false, erro: "⚠️ Preencha todos os campos da empresa!" };
    }

    // confere se as senhas batem
    if (senha && senha !== confirmeSenha) {
        return { valido: false, erro: "⚠️ As senhas não coincidem!" };
    }

    // monta o objeto certinho pra mandar pro banco
    // se a senha for vazia, manda null pra nao alterar
    const corpo = {
        razaoSocial,
        nomeFantasia,
        cnpj,
        email,
        telefone,
        senha: senha || null
    };

    return { valido: true, corpo };
}

// valida o endereco separado tambem
function validarDadosEndereco(dados) {
    const { cep, logradouro, numero, bairro, cidade, uf } = dados;

    if (!cep || !logradouro || !numero || !bairro || !cidade || !uf) {
        return { valido: false, erro: "⚠️ Preencha todos os campos do endereço!" };
    }

    return { valido: true, corpo: dados };
}


// --- parte visual (dom e navegador) ---

// so adiciona os eventos se o navegador existir
// isso evita aquele erro chato de "document is not defined" no jest
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", function() {
        // verifica se a funcao existe antes de chamar
        if (typeof validarSessao === 'function') validarSessao();
        
        if (sessionStorage.ID_USUARIO) {
            carregarDadosEmpresa();
            carregarDadosEndereco();
        }
    });
}

function showTab(tabName) {
    // esconde todas as abas
    var tabContents = document.getElementsByClassName('tab-content');
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
        tabContents[i].classList.remove('active');
    }

    // reseta os botoes
    var tabButtons = document.getElementsByClassName('tab-button');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    // mostra so a aba certa, verificando se ela existe
    var tab = document.getElementById(tabName);
    if (tab) {
        tab.style.display = 'block';
        tab.classList.add('active');
    }
    
    // verifica se o evento existe (no jest as vezes nao existe)
    if (typeof event !== 'undefined' && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

function carregarDadosEmpresa() {
    // busca os inputs e preenche com o que ta na sessao
    var elRazao = document.getElementById("razaoSocial");
    var elNome = document.getElementById("nomeFantasia");
    var elCnpj = document.getElementById("cnpj");
    var elEmail = document.getElementById("email");
    var elTel = document.getElementById("telefone");

    if (elRazao) elRazao.value = sessionStorage.RAZAO_SOCIAL || "";
    if (elNome) elNome.value = sessionStorage.NOME_USUARIO || "";
    if (elCnpj) elCnpj.value = sessionStorage.CNPJ || "";
    if (elEmail) elEmail.value = sessionStorage.EMAIL_USUARIO || "";
    if (elTel) elTel.value = sessionStorage.TELEFONE || "";
}

function carregarDadosEndereco() {
    // mesma coisa pro endereco
    var elCep = document.getElementById("cep");
    var elLog = document.getElementById("logradouro");
    var elNum = document.getElementById("numero");
    var elBairro = document.getElementById("bairro");
    var elCidade = document.getElementById("cidade");
    var elUf = document.getElementById("uf");

    if (elCep) elCep.value = sessionStorage.CEP || "";
    if (elLog) elLog.value = sessionStorage.LOGRADOURO || "";
    if (elNum) elNum.value = sessionStorage.NUMERO || "";
    if (elBairro) elBairro.value = sessionStorage.BAIRRO || "";
    if (elCidade) elCidade.value = sessionStorage.CIDADE || "";
    if (elUf) elUf.value = sessionStorage.UF || "";
}

function atualizarEmpresa() {
    const idUsuario = sessionStorage.ID_USUARIO;
    
    // crio um objeto bruto pegando direto do html
    const dadosBrutos = {
        razaoSocial: document.getElementById("razaoSocial").value,
        nomeFantasia: document.getElementById("nomeFantasia").value,
        cnpj: document.getElementById("cnpj").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        senha: document.getElementById("senha").value,
        confirmeSenha: document.getElementById("confirmeSenha").value
    };

    // chamo a funcao pura pra validar
    const validacao = validarDadosEmpresa(dadosBrutos);

    // se der ruim, aviso e paro
    if (!validacao.valido) {
        alert(validacao.erro);
        return;
    }

    // mando pro backend usando o corpo limpo da validacao
    return fetch(`/empresas/atualizar/${idUsuario}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validacao.corpo),
    })
    .then(res => {
        if (res.ok) {
            alert("✅ Dados da empresa atualizados com sucesso!");
            sessionStorage.NOME_USUARIO = validacao.corpo.nomeFantasia;
            // so recarrego se tiver janela (navegador)
            if (typeof window !== 'undefined' && window.location) window.location.reload();
        } else {
            res.text().then(texto => alert(`❌ Erro ao atualizar: ${texto}`));
        }
    })
    .catch(err => {
        console.error(err);
        alert("❌ Falha ao atualizar os dados da empresa.");
    });
}

function atualizarEndereco() {
    const idUsuario = sessionStorage.ID_USUARIO;
    
    // pega dados do html
    const dadosBrutos = {
        cep: document.getElementById("cep").value,
        logradouro: document.getElementById("logradouro").value,
        numero: document.getElementById("numero").value,
        bairro: document.getElementById("bairro").value,
        cidade: document.getElementById("cidade").value,
        uf: document.getElementById("uf").value
    };

    // valida usando a logica separada
    const validacao = validarDadosEndereco(dadosBrutos);

    if (!validacao.valido) {
        alert(validacao.erro);
        return;
    }

    return fetch(`/endereco/atualizar/${idUsuario}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validacao.corpo),
    })
    .then(res => {
        if (res.ok) {
            alert("✅ Endereço atualizado com sucesso!");
        } else {
            res.text().then(texto => alert(`❌ Erro ao atualizar: ${texto}`));
        }
    })
    .catch(err => {
        console.error(err);
        alert("❌ Falha ao atualizar o endereço.");
    });
}

function deletarUsuario() {
    const confirmar = confirm("⚠️ Deseja realmente excluir sua conta? Esta ação é irreversível.");
    if (confirmar) {
        const idUsuario = sessionStorage.ID_USUARIO;

        return fetch(`/empresas/deletar/${idUsuario}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
        .then(res => {
            if (res.ok) {
                alert("❌ Conta excluída com sucesso!");
                // verifica se a funcao existe antes de chamar
                if (typeof limparSessao === 'function') limparSessao(); 
            } else {
                res.text().then(texto => alert(`❌ Erro ao excluir: ${texto}`));
            }
        })
        .catch(err => {
            console.error(err);
            alert("❌ Falha ao excluir a conta.");
        });
    }
}

// exporta as funcoes pro jest conseguir ler
// esse if garante que nao quebre no navegador que nao tem module.exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validarDadosEmpresa,
        validarDadosEndereco,
        atualizarEmpresa,
        atualizarEndereco,
        deletarUsuario
    };
}