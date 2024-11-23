const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nome: String,
  dados_pessoais: {
    nome: String,
    telefone: String,
    email:String,
    senha:String
  },
  endereco: {
    rua: String,
    numero: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String
  }
});

// A variável 'Cliente' agora é um construtor para instanciar novos documentos
const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;  // Exporta como um modelo, funcionando como um construtor
