/**
 * Arquivo: server.js
 * Descrição: Configuração do servidor e conexão com o banco de dados
 */


// Importação dos pacotes
const express = require('express');
const cors = require('cors'); // Importa o pacote CORS
const app = express();
const mongoose = require('mongoose');
const Produto = require('./app/models/produto');
const Cliente = require('./app/models/cliente'); // Modelo Cliente
const Venda = require('./app/models/venda'); // Modelo Venda

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://Leaftech:leaftech@cluster0.sljr8.mongodb.net/leaftech-backend?retryWrites=true&w=majority&family=4')
  .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso!'))
  .catch((error) => console.error('Erro ao conectar com o MongoDB:', error));

// Middleware CORS
app.use(cors()); // Ativa o CORS para todas as requisições

// Configuração para ler dados JSON do body das requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Definindo a porta onde será executada a nossa API
const port = process.env.PORT || 8000;

// Rotas da API
//==================================

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


// Rotas para Produtos (GET ALL & POST)
router.route('/produtos')

  // Método: Criar produto (POST http://localhost:8000/api/produtos)
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

  // Método: Obter todos os produtos (GET http://localhost:8000/api/produtos) 
  .get(async (req, res) => {
    try {
      const produtos = await Produto.find();
      res.json(produtos);
    } catch (error) {
      res.status(500).send('Erro ao buscar produtos: ' + error);
    }
  });

// Rota para um produto específico, usando o ID
router.route('/produtos/:produto_id')

  // Método: Obter um produto específico pelo ID (GET http://localhost:8000/api/produtos/:produto_id) 
  .get(async (req, res) => {
    try {
      const produto = await Produto.findById(req.params.produto_id);

      if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      res.json(produto);
    } catch (error) {
      res.status(500).send('Erro ao tentar buscar o produto: ' + error);
    }
  });

// Rotas para Clientes (GET ALL & POST)
router.route('/clientes')

  // Método: Criar cliente (POST http://localhost:8000/api/clientes) 
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
      console.log(cliente);

      await cliente.save();
      res.json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
      res.status(500).send('Erro ao tentar salvar o cliente: ' + error);
    }
  })

  // Método: Obter todos os clientes (GET http://localhost:8000/api/clientes) 
  .get(async (req, res) => {
    try {
      const clientes = await Cliente.find();
      res.json(clientes);
    } catch (error) {
      res.status(500).send('Erro ao buscar clientes: ' + error);
    }
  });

// Rota para um cliente específico, usando o ID
router.route('/clientes/:cliente_id')

  // Método: Obter um cliente específico pelo ID (GET http://localhost:8000/api/clientes/:cliente_id) 
  .get(async (req, res) => {
    try {
      const cliente = await Cliente.findById(req.params.cliente_id);

      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      res.json(cliente);
    } catch (error) {
      res.status(500).send('Erro ao tentar buscar o cliente: ' + error);
    }
  });

// Rota para pegar o usuario e senha do cliente cadastrado
router.route('/login')

  // Método: Obter um cliente específico pelo ID (POST http://localhost:8000/api/login) 
  .post(async (req, res) => {
    try {
      const cliente = await Cliente.findOne({
        "dados_pessoais.email": req.body.username,
        "dados_pessoais.senha": req.body.password,
      });

      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      res.json(cliente);
    } catch (error) {
      res.status(500).send('Erro ao tentar buscar o cliente: ' + error);
    }
  });

// Rotas para Vendas (GET ALL & POST)
router.route('/vendas')

  // Método: Criar venda (POST http://localhost:8000/api/vendas) 
  .post(async (req, res) => {
    const produtos = req.body.produtos.map(({id}) => id)
    try {
      const venda = new Venda({
        cliente: req.body.cliente,
        produtos,
      });      
      await venda.calcularValorTotal();
      await venda.save();
      res.json({ message: 'Venda registrada com sucesso!', venda });
    } catch (error) {
      console.log(error);
      res.status(500).send('Erro ao registrar a venda: ' + error);
    }
  })

  // Método: Obter todas as vendas (GET http://localhost:8000/api/vendas) 
  .get(async (req, res) => {
    try {
      const vendas = await Venda.find().populate('cliente produtos endereco');
      res.json(vendas);
    } catch (error) {
      res.status(500).send('Erro ao buscar vendas: ' + error);
    }
  });

// Rota para uma venda específica, usando o ID
router.route('/vendas/:venda_id')

  // Método: Obter uma venda específica pelo ID (GET http://localhost:8000/api/vendas/:venda_id) 
  .get(async (req, res) => {
    try {
      const venda = await Venda.findById(req.params.venda_id).populate('cliente produtos endereco');

      if (!venda) {
        return res.status(404).json({ message: 'Venda não encontrada' });
      }

      res.json(venda);
    } catch (error) {
      res.status(500).send('Erro ao tentar buscar a venda: ' + error);
    }
  });


// Definindo o prefixo das rotas: '/api'
app.use('/api', router);

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Iniciando o app na porta ${port}`);
});