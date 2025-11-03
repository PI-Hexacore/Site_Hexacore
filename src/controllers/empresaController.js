var empresaModel = require("../models/empresaModel");

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var razaoEmp = req.body.razaoEmp;
    var nomeEmp = req.body.nomeEmp;
    var emailEmp = req.body.emailEmp;
    var cnpjEmp = req.body.cnpjEmp;
    var senhaEmp = req.body.senhaEmp;
    var telefoneEmp = req.body.telefoneEmp;
    

    // Faça as validações dos valores
    if (razaoEmp == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if(nomeEmp == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (emailEmp == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (cnpjEmp == undefined){
       res.status(400).send("Seu cnpj está undefined!");
    } else if (senhaEmp == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (telefoneEmp == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        empresaModel.cadastrar(razaoEmp, nomeEmp, emailEmp, cnpjEmp, senhaEmp, telefoneEmp)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function autenticar(req, res) {
    var emailEmp = req.body.emailEmp;
    var senhaEmp = req.body.senhaEmp;

    if (emailEmp == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senhaEmp == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        empresaModel.autenticar(emailEmp, senhaEmp)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);
                        res.json({
                            id: resultadoAutenticar[0].id, // idUsuario as id
                            nome: resultadoAutenticar[0].nome,
                            email: resultadoAutenticar[0].email,
                            senha: resultadoAutenticar[0].senha
                                    });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function atualizar(req, res) {
    var idUsuario = req.params.idUsuario;
    var nome = req.body.nome;
    var email = req.body.email;
    var senha = req.body.senha;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else { // A senha pode ser opcional na atualização
        empresaModel.atualizar(idUsuario, nome, email, senha)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar a atualização! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function deletar(req, res) {
    var idUsuario = req.params.idUsuario;

    if (idUsuario == undefined) {
        res.status(400).send("O idUsuario está undefined!");
    } else {
        empresaModel.deletar(idUsuario)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao deletar o usuário! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function contar(req, res) {
    empresaModel.contar()
        .then(
            function (resultado) {
                // O resultado de COUNT é um array com um objeto, ex: [{ total: 5 }]
                res.json(resultado[0]);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao contar os usuários! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    autenticar,
    cadastrar,
    atualizar,
    deletar,
    contar // Exportando a nova função
}