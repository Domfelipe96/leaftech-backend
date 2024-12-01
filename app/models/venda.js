var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Cliente = require('./cliente'); // Modelo Cliente
const Produto = require('./produto'); // Modelo Produto

/**
 * Venda:
 * 
 *  -> cliente: Cliente (referência ao cliente, deve ser ObjectId)
 *  -> produtos: [Produto] (array de referências a produtos, devem ser ObjectIds)
 *  -> valor_total: Número
 */

var VendaSchema = new Schema({
  cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true }, // Referência ao Cliente
  produtos: [{ type: Schema.Types.ObjectId, ref: 'Produto', required: true }], // Referências aos Produtos
  valor_total: { type: Number, required: true } // Valor total da venda
});

// Método para calcular o valor total da venda
VendaSchema.methods.calcularValorTotal = async function() {
  // Obter os produtos usando os ObjectIds passados
  const produtos = await Produto.find({ '_id': { $in: this.produtos } });

  let total = 0;
  // Somar o preço de cada produto na venda
  produtos.forEach(produto => {
    total += produto.preco;
  });

  // Atribuir o valor total calculado ao campo `valor_total`
  this.valor_total = total;
};

// Criar e exportar o modelo de Venda
module.exports = mongoose.model('Venda', VendaSchema);
