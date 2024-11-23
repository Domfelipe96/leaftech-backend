/**
 * Arquivo: produto.js
 * Descrição: Arquivo responsável onde trataremos o modelo da classe 'produto'
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 * Produto:
 * 
 * -> ID: int
 * -> Nome: String
 * -> Preço: Number
 * -> Descrição: String
 * 
 */

var ProdutoSchema = new Schema ({
    nome: String,
    preco: Number,
    descricao: String
});

module.exports = mongoose.model('Produto', ProdutoSchema);