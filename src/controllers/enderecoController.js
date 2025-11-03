var enderecoModel = require("../models/enderecoModel");

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var tipoLogradouro = req.body.tipoLogradouroEmp;
    var logradouro = req.body.logradouroEmp;
    var numero = req.body.numeroEmp;
    var bairro = req.body.bairroEmp;
    var cidade = req.body.cidadeEmp;
    var uf = req.body.ufEmp;
    var cep = req.body.cepEmp;
    var fkUsuario = req.body.fkUsuario; // Adicionado

    // Faça as validações dos valores
    if (tipoLogradouro == undefined) {
        res.status(400).send("Seu tipo de logradouro está undefined!");
    } else if (logradouro == undefined) {
        res.status(400).send("Seu logradouro está undefined!");
    } else if (numero == undefined) {
        res.status(400).send("Seu número está undefined!");
    } else if (bairro == undefined) {
        res.status(400).send("Seu bairro está undefined!");
    } else if (cidade == undefined) {
        res.status(400).send("Sua cidade está undefined!");
    } else if (uf == undefined) {
        res.status(400).send("Sua UF está undefined!");
    } else if (cep == undefined) {
        res.status(400).send("Seu CEP está undefined!");
    } else if (fkUsuario == undefined) { // Adicionado
        res.status(400).send("O ID do usuário (fkUsuario) está undefined!");
    } else {
        // Passe os valores como parâmetro e vá para o arquivo enderecoModel.js
        enderecoModel.cadastrar(tipoLogradouro, logradouro, numero, bairro, cidade, uf, cep, fkUsuario)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro do endereço! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function buscarPorId(req, res) {
    var idUsuario = req.params.idUsuario;
    enderecoModel.buscarPorId(idUsuario)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.json(resultado); // Retorna o array completo
            } else {
                res.status(404).send("Nenhum endereço encontrado para este usuário!");
            }
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizar(req, res) {
    var idUsuario = req.params.idUsuario;
    var { cep, logradouro, numero, bairro, cidade, uf } = req.body;

    if (!cep || !logradouro || !numero || !bairro || !cidade || !uf) {
        return res.status(400).send("Todos os campos do endereço são obrigatórios.");
    }

    enderecoModel.atualizar(idUsuario, cep, logradouro, numero, bairro, cidade, uf)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao atualizar o endereço! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    cadastrar,
    buscarPorId,
    atualizar
}