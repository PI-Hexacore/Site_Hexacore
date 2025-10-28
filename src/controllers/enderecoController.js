var enderecoModel = require("../models/enderecoModel");

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var tipoLogradouro = req.body.tipoLogradouroServer;
    var logradouro = req.body.logradouroServer;
    var numero = req.body.numeroServer;
    var bairro = req.body.bairroServer;
    var cidade = req.body.cidadeServer;
    var uf = req.body.ufServer;
    var cep = req.body.cepServer;

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
    } else {
        // Passe os valores como parâmetro e vá para o arquivo enderecoModel.js
        enderecoModel.cadastrar(tipoLogradouro, logradouro, numero, bairro, cidade, uf, cep)
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

module.exports = {
    cadastrar
}