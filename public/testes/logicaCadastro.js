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

function verificarCoincidenciaSenha(senha1, senha2){
    if(senha1 === senha2){
        return{valido: true};
    }
    else{
        return{valido: false, erro: "As senhas não coincidem"};
    }
}


function validarCadastroEmpresa(dados, desformatarCNPJ, desformatarTell) {
    const { razaoEmp, nomeEmp, emailEmp, cnpjEmp, senhaEmp, telefoneEmp } = dados;

    if (!razaoEmp || !nomeEmp || !emailEmp || !cnpjEmp || !senhaEmp || !telefoneEmp) {
        return { valido: false, erro: "Preencha todos os campos!" };
    }

    const cnpjLimpo = desformatarCNPJ(cnpjEmp);
    const tellLimpo = desformatarTell(telefoneEmp);

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

    function formatarTell(telefone) {
      var valor = telefone.value;
      var numeros = valor.replace(/\D/g, "");
      var formatado = "";
      if (numeros.length > 0) formatado = numeros.substring(0, 2);
      if (numeros.length > 2) formatado += " " + numeros.substring(2, 7);
      if (numeros.length > 7) formatado += "-" + numeros.substring(7, 11);
      telefone.value = formatado;
    }




module.exports = { validarCriteriosSenha, validarCadastroEmpresa, verificarCoincidenciaSenha };
