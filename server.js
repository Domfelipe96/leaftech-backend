/**
 * Arquivo: server.js
 * Descrição: Configuração do servidor e conexão com o banco de dados para uso na Vercel.
 */

// Importação dos pacotes
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Produto = require('./app/models/produto');
const Cliente = require('./app/models/cliente');
const Venda = require('./app/models/venda');

// Configuração do app
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexão com o MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/leaftech-backend';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso!'))
  .catch((error) => console.error('Erro ao conectar com o MongoDB:', error));

// Rotas da API
// ==================================

// Criando uma instância das rotas via Express
const router = express.Router();

router.use((req, res, next) => {
  console.log('Algo está acontecendo aqui...');
  next();
});

// Rota de exemplo
router.get('/', (req, res) => {
  res.json({ message: 'Olá! Seja bem-vindo(a) à Leaf Tech!' });
});

// Rotas para Produtos
router.route('/produtos')
  .post(async (req, res) => {
    try {
      const produto = new Produto({
        nome: req.body.nome,
        preco: req.body.preco,
        descricao: req.body.descricao,
      });
      await produto.save();
      res.json({ message: 'Produto cadastrado com sucesso!' });
    } catch (error) {
      res.status(500).send('Erro ao tentar salvar o produto: ' + error);
    }
  })
  .get(async (req, res) => {
    try {
      const produtos = await Produto.find();
      res.json(produtos);
    } catch (error) {
      res.status(500).send('Erro ao buscar produtos: ' + error);
    }
  });

// Rota para um produto específico
router.route('/produtos/:produto_id')
  .get(async (req, res) => {
    try {
      const produto = await Produto.findById(req.params.produto_id);
      if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
      res.json(produto);
    } catch (error) {
      res.status(500).send('Erro ao tentar buscar o produto: ' + error);
    }
  });

// Rotas para Clientes
router.route('/clientes')
  .post(async (req, res) => {
    try {
      const cliente = new Cliente({
        nome: req.body.nome,
        dados_pessoais: {
          nome: req.body.nome,
          telefone: req.body.telefone,
          email: req.body.email,
          senha: req.body.senha
        },
        endereco: {
          rua: req.body.rua,
          numero: req.body.numero,
          bairro: req.body.bairro,
          cidade: req.body.cidade,
          estado: req.body.estado,
          cep: req.body.cep,
        }
      });
      await cliente.save();
      res.json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
      res.status(500).send('Erro ao tentar salvar o cliente: ' + error);
    }
  })
  .get(async (req, res) => {
    try {
      const clientes = await Cliente.find();
      res.json(clientes);
    } catch (error) {
      res.status(500).send('Erro ao buscar clientes: ' + error);
    }
  });

// Rota para login
router.route('/login')
  .post(async (req, res) => {
    try {
      const cliente = await Cliente.findOne({
        "dados_pessoais.email": req.body.username,
        "dados_pessoais.senha": req.body.password,
      });
      if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' });
      res.json(cliente);
    } catch (error) {
      res.status(500).send('Erro ao tentar buscar o cliente: ' + error);
    }
  });

// Rotas para Vendas
router.route('/vendas')
  .post(async (req, res) => {
    try {
      const venda = new Venda({
        cliente: req.body.cliente,
        produtos: req.body.produtos,
      });
      await venda.calcularValorTotal(produtos.id);
      await venda.save();
      res.json({ message: 'Venda registrada com sucesso!', venda });
    } catch (error) {
      res.status(500).send('Erro ao registrar a venda: ' + error);
    }
  })
  .get(async (req, res) => {
    try {
      const vendas = await Venda.find().populate('cliente produtos endereco');
      res.json(vendas);
    } catch (error) {
      res.status(500).send('Erro ao buscar vendas: ' + error);
    }
  });

// Definindo o prefixo das rotas: '/api'
app.use('/api', router);

// Exportando o app para uso na Vercel
module.exports = app;
