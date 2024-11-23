const mongoose = require('mongoose');

const uri = 'mongodb://Leaftech:leaftech@cluster0.sljr8.mongodb.net/leaftech-backend'

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado ao MongoDB!');
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });