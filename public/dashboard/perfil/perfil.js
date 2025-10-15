function atualizarUsuario() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const cargo = document.getElementById("cargo").value;

  alert(`✅ Dados atualizados!\n\nNome: ${nome}\nE-mail: ${email}\nCargo: ${cargo}`);
}

function deletarUsuario() {
  const confirmar = confirm("⚠️ Deseja realmente excluir sua conta?");
  if (confirmar) {
    alert("❌ Conta excluída com sucesso!");
    window.location.href = "index.html";
  }
}
