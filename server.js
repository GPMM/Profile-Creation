const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Adiciona uma rota para servir arquivos da pasta assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.json());

// Endpoint para obter os perfis
app.get('/profiles', (req, res) => {
  const filePath = path.join(__dirname, 'profiles.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo profiles.json:', err);
      return res.status(500).send('Erro ao ler o arquivo de perfis.');
    }

    try {
      const profiles = JSON.parse(data);
      res.json(profiles);
    } catch (parseError) {
      console.error('Erro ao analisar JSON de profiles.json:', parseError);
      res.status(500).send('Erro ao analisar o arquivo de perfis.');
    }
  });
});

// Endpoint para adicionar um novo perfil
app.post('/profiles', (req, res) => {
  const filePath = path.join(__dirname, 'profiles.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo profiles.json:', err);
      return res.status(500).send('Erro ao ler o arquivo de perfis.');
    }

    try {
      const profiles = JSON.parse(data);
      profiles.push(req.body);

      fs.writeFile(filePath, JSON.stringify(profiles, null, 2), (err) => {
        if (err) {
          console.error('Erro ao salvar o perfil:', err);
          return res.status(500).send('Erro ao salvar o novo perfil.');
        }
        res.status(200).send('Perfil salvo com sucesso!');
      });
    } catch (parseError) {
      console.error('Erro ao analisar JSON de profiles.json:', parseError);
      res.status(500).send('Erro ao analisar o arquivo de perfis.');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
