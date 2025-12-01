document.addEventListener("DOMContentLoaded", function() {
  validarSessao(); // Garante que o nome seja exibido e a sessão validada
  if (sessionStorage.ID_USUARIO) { // Verifica se a sessão é válida
    carregarDadosEmpresa();
    carregarDadosEndereco();
  }
});

function showTab(tabName) {
  // Esconde todos os conteúdos das abas
  var tabContents = document.getElementsByClassName('tab-content');
  for (var i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = 'none';
    tabContents[i].classList.remove('active');
  }

  // Remove a classe 'active' de todos os botões das abas
  var tabButtons = document.getElementsByClassName('tab-button');
  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove('active');
  }

  // Mostra o conteúdo da aba selecionada e ativa o botão
  document.getElementById(tabName).style.display = 'block';
  document.getElementById(tabName).classList.add('active');
  event.currentTarget.classList.add('active');
}

function carregarDadosEmpresa() {
  // Preenche o formulário com os dados do sessionStorage
  document.getElementById("razaoSocial").value = sessionStorage.RAZAO_SOCIAL || "";
  document.getElementById("nomeFantasia").value = sessionStorage.NOME_USUARIO || "";
  document.getElementById("cnpj").value = sessionStorage.CNPJ || "";
  document.getElementById("email").value = sessionStorage.EMAIL_USUARIO || "";
  document.getElementById("telefone").value = sessionStorage.TELEFONE || "";
}

function carregarDadosEndereco() {
  // Preenche o formulário com os dados do sessionStorage
  document.getElementById("cep").value = sessionStorage.CEP || "";
  document.getElementById("logradouro").value = sessionStorage.LOGRADOURO || "";
  document.getElementById("numero").value = sessionStorage.NUMERO || "";
  document.getElementById("bairro").value = sessionStorage.BAIRRO || "";
  document.getElementById("cidade").value = sessionStorage.CIDADE || "";
  document.getElementById("uf").value = sessionStorage.UF || "";
}

function atualizarEmpresa() {
  const idUsuario = sessionStorage.ID_USUARIO;
  const razaoSocial = document.getElementById("razaoSocial").value;
  const nomeFantasia = document.getElementById("nomeFantasia").value;
  const cnpj = document.getElementById("cnpj").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const senha = document.getElementById("senha").value;
  const confirmeSenha = document.getElementById("confirmeSenha").value;

  if (razaoSocial == "" || nomeFantasia == "" || cnpj == "" || email == "" || telefone == "") {
    alert("⚠️ Preencha todos os campos da empresa!");
    return;
  }

  if (senha !== confirmeSenha) {
    alert("⚠️ As senhas não coincidem!");
    return;
  }

  const corpo = {
    razaoSocial,
    nomeFantasia,
    cnpj,
    email,
    telefone,
    senha: senha || null // Envia null se a senha estiver vazia
  };

  fetch(`/empresas/atualizar/${idUsuario}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  })
  .then(res => {
    if (res.ok) {
      alert("✅ Dados da empresa atualizados com sucesso!");
      sessionStorage.NOME_USUARIO = nomeFantasia; // Atualiza o nome na sessão
      window.location.reload();
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
  const cep = document.getElementById("cep").value;
  const logradouro = document.getElementById("logradouro").value;
  const numero = document.getElementById("numero").value;
  const bairro = document.getElementById("bairro").value;
  const cidade = document.getElementById("cidade").value;
  const uf = document.getElementById("uf").value;

  if (cep == "" || logradouro == "" || numero == "" || bairro == "" || cidade == "" || uf == "") {
    alert("⚠️ Preencha todos os campos do endereço!");
    return;
  }

  const corpo = { cep, logradouro, numero, bairro, cidade, uf };

  fetch(`/endereco/atualizar/${idUsuario}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
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

    fetch(`/empresas/deletar/${idUsuario}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    .then(res => {
      if (res.ok) {
        alert("❌ Conta excluída com sucesso!");
        limparSessao(); // Função do seu arquivo sessao.js
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
