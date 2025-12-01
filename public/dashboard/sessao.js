function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;
    var id = sessionStorage.ID_USUARIO;

    // Elemento padrão para exibir o nome do usuário na sidebar
    var infoNome = document.getElementById("infoNome");

    if (email != null && nome != null && id != null) {
        if (infoNome) {
            infoNome.innerHTML = `Olá, <b>${nome}</b>`;
        } 
        return true; // Retorna true se a sessão for válida
    } 
    // else {
    //     window.location = "../login.html";
    //     return false; // Retorna false se a sessão for inválida
    // }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../login.html";
}