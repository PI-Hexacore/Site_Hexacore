document.addEventListener("DOMContentLoaded", function() {
  if (validarSessao()) {
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
  const idUsuario = sessionStorage.ID_USUARIO;
  fetch(`/empresas/buscar/${idUsuario}`)
    .then(res => res.json())
    .then(data => {
      if (data) {
        document.getElementById("razaoSocial").value = data.razaoSocial;
        document.getElementById("nomeFantasia").value = data.nomeFantasia;
        document.getElementById("cnpj").value = data.cnpj;
        document.getElementById("email").value = data.email;
        document.getElementById("telefone").value = data.telefone;
      }
    }).catch(err => console.error("Erro ao carregar dados da empresa:", err));
}

function carregarDadosEndereco() {
  const idUsuario = sessionStorage.ID_USUARIO;
  fetch(`/endereco/buscar/${idUsuario}`)
    .then(res => res.json())
    .then(data => {
      if (data) {
        document.getElementById("cep").value = data.cep;
        document.getElementById("logradouro").value = data.logradouro;
        document.getElementById("numero").value = data.numero;
        document.getElementById("bairro").value = data.bairro;
        document.getElementById("cidade").value = data.cidade;
        document.getElementById("uf").value = data.uf;
      }
    }).catch(err => console.error("Erro ao carregar dados do endereço:", err));
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
    method: "PUT",
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
    method: "PUT",
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
