import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Produto from './models/Produto';
import Cliente from './models/Cliente';
import Venda from './models/Venda';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conexão com o MongoDB bem-sucedida!');
}).catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error);
});

// Rotas
app.get('/api', (req, res) => {
  res.json({ message: 'Bem-vindo(a) à API!' });
});

// Produtos
app.route('/api/produtos')
  .post(async (req, res) => {
    try {
      const produto = new Produto(req.body);
      await produto.save();
      res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .get(async (req, res) => {
    try {
      const produtos = await Produto.find();
      res.status(200).json(produtos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.get('/api/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clientes
app.route('/api/clientes')
  .post(async (req, res) => {
    try {
      const cliente = new Cliente(req.body);
      await cliente.save();
      res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .get(async (req, res) => {
    try {
      const clientes = await Cliente.find();
      res.status(200).json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.get('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' });
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const cliente = await Cliente.findOne({
      'dados_pessoais.email': req.body.username,
      'dados_pessoais.senha': req.body.password,
    });
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' });
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vendas
app.route('/api/vendas')
  .post(async (req, res) => {
    try {
      const venda = new Venda(req.body);
      await venda.save();
      res.status(201).json({ message: 'Venda registrada com sucesso!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .get(async (req, res) => {
    try {
      const vendas = await Venda.find().populate('cliente produtos');
      res.status(200).json(vendas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.get('/api/vendas/:id', async (req, res) => {
  try {
    const venda = await Venda.findById(req.params.id).populate('cliente produtos');
    if (!venda) return res.status(404).json({ message: 'Venda não encontrada' });
    res.status(200).json(venda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exportação para o Vercel
export default app;
