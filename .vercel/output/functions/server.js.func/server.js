"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _Produto = _interopRequireDefault(require("./models/Produto"));
var _Cliente = _interopRequireDefault(require("./models/Cliente"));
var _Venda = _interopRequireDefault(require("./models/Venda"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const app = (0, _express.default)();

// Middleware
app.use((0, _cors.default)());
app.use(_express.default.json());

// Conexão com o MongoDB
_mongoose.default.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conexão com o MongoDB bem-sucedida!');
}).catch(error => {
  console.error('Erro ao conectar ao MongoDB:', error);
});

// Rotas
app.get('/api', (req, res) => {
  res.json({
    message: 'Bem-vindo(a) à API!'
  });
});

// Produtos
app.route('/api/produtos').post(async (req, res) => {
  try {
    const produto = new _Produto.default(req.body);
    await produto.save();
    res.status(201).json({
      message: 'Produto cadastrado com sucesso!'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}).get(async (req, res) => {
  try {
    const produtos = await _Produto.default.find();
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const produto = await _Produto.default.findById(req.params.id);
    if (!produto) return res.status(404).json({
      message: 'Produto não encontrado'
    });
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Clientes
app.route('/api/clientes').post(async (req, res) => {
  try {
    const cliente = new _Cliente.default(req.body);
    await cliente.save();
    res.status(201).json({
      message: 'Cliente cadastrado com sucesso!'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}).get(async (req, res) => {
  try {
    const clientes = await _Cliente.default.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.get('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await _Cliente.default.findById(req.params.id);
    if (!cliente) return res.status(404).json({
      message: 'Cliente não encontrado'
    });
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const cliente = await _Cliente.default.findOne({
      'dados_pessoais.email': req.body.username,
      'dados_pessoais.senha': req.body.password
    });
    if (!cliente) return res.status(404).json({
      message: 'Cliente não encontrado'
    });
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Vendas
app.route('/api/vendas').post(async (req, res) => {
  try {
    const venda = new _Venda.default(req.body);
    await venda.save();
    res.status(201).json({
      message: 'Venda registrada com sucesso!'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}).get(async (req, res) => {
  try {
    const vendas = await _Venda.default.find().populate('cliente produtos');
    res.status(200).json(vendas);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.get('/api/vendas/:id', async (req, res) => {
  try {
    const venda = await _Venda.default.findById(req.params.id).populate('cliente produtos');
    if (!venda) return res.status(404).json({
      message: 'Venda não encontrada'
    });
    res.status(200).json(venda);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Exportação para o Vercel
var _default = exports.default = app;
//# sourceMappingURL=server.js.map