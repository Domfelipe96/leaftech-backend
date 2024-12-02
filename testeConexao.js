const mongoose = require('mongoose');
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('A URI do MongoDB não está definida. Configure a variável de ambiente MONGO_URI.');
  process.exit(1); // Encerra o processo se a URI não estiver configurada
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout para conexão
})
  .then(() => {
    console.log('Conectado ao MongoDB!');
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
  });

mongoose.connection.on('disconnected', () => {
  console.log('Conexão com o MongoDB foi encerrada.');
});
