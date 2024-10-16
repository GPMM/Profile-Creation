const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));
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

// Endpoint para atualizar um perfil existente
app.put('/profiles/:id', (req, res) => {
  const filePath = path.join(__dirname, 'profiles.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo profiles.json:', err);
      return res.status(500).send('Erro ao ler o arquivo de perfis.');
    }

    try {
      let profiles = JSON.parse(data);
      const profileIndex = profiles.findIndex(p => p.id === req.params.id);

      if (profileIndex === -1) {
        return res.status(404).send('Perfil não encontrado.');
      }

      const profileData = req.body;
      profiles[profileIndex] = { ...profiles[profileIndex], ...profileData };

      saveProfiles(profiles, res);
    } catch (parseError) {
      console.error('Erro ao analisar JSON de profiles.json:', parseError);
      res.status(500).send('Erro ao analisar o arquivo de perfis.');
    }
  });
});

// Função para salvar os perfis no arquivo
function saveProfiles(profiles, res) {
  const filePath = path.join(__dirname, 'profiles.json');
  fs.writeFile(filePath, JSON.stringify(profiles, null, 2), err => {
    if (err) {
      console.error('Erro ao salvar o perfil:', err);
      return res.status(500).send('Erro ao salvar as alterações do perfil.');
    }
    res.status(200).json({ message: 'Perfil atualizado com sucesso!' }); // Retorna um JSON
  });
}

// Endpoint para salvar o ID do usuário atual em currentUser.json
app.post('/save-current-user', (req, res) => {
  const { id } = req.body;  // Recebe o ID do usuário do corpo da requisição
  const filePath = path.join(__dirname, 'currentUser.json');

  // Verifica se o ID foi fornecido
  if (!id) {
    return res.status(400).json({ message: 'ID do usuário não fornecido.' });
  }

  // Cria um objeto com o ID do usuário
  const currentUser = { id };

  // Escreve o objeto no arquivo currentUser.json
  fs.writeFile(filePath, JSON.stringify(currentUser, null, 2), (err) => {
    if (err) {
      console.error('Erro ao salvar o ID do usuário atual:', err);
      return res.status(500).json({ message: 'Erro ao salvar o ID do usuário.' });
    }
    res.status(200).json({ message: 'ID do usuário salvo com sucesso!' });
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
      const profileData = req.body;
      profiles.push(profileData);

      saveProfiles(profiles, res);
    } catch (parseError) {
      console.error('Erro ao analisar JSON de profiles.json:', parseError);
      res.status(500).send('Erro ao analisar o arquivo de perfis.');
    }
  });
});

// Endpoint para obter um perfil específico
app.get('/profiles/:id', (req, res) => {
  const filePath = path.join(__dirname, 'profiles.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo profiles.json:', err);
      return res.status(500).send('Erro ao ler o arquivo de perfis.');
    }

    try {
      const profiles = JSON.parse(data);
      const profile = profiles.find(p => p.id === req.params.id);
      
      if (!profile) {
        return res.status(404).send('Perfil não encontrado.');
      }
      
      res.json(profile);
    } catch (parseError) {
      console.error('Erro ao analisar JSON de profiles.json:', parseError);
      res.status(500).send('Erro ao analisar o arquivo de perfis.');
    }
  });
});

// Endpoint para excluir um perfil
app.delete('/profiles/:id', (req, res) => {
  console.log(`Solicitação de exclusão recebida para o ID: ${req.params.id}`);

  const profileId = req.params.id;
  const filePath = path.join(__dirname, 'profiles.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo profiles.json:', err);
      return res.status(500).send('Erro ao ler o arquivo de perfis.');
    }

    try {
      const profiles = JSON.parse(data);
      const updatedProfiles = profiles.filter(profile => profile.id !== profileId);

      fs.writeFile(filePath, JSON.stringify(updatedProfiles, null, 2), (err) => {
        if (err) {
          console.error('Erro ao salvar os perfis atualizados:', err);
          return res.status(500).send('Erro ao salvar os perfis atualizados.');
        }
        res.status(200).send('Perfil excluído com sucesso!');
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
