// Função para carregar perfis do servidor e exibi-los na página inicial
function loadProfiles() {
  fetch('/profiles')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar os perfis.');
      }
      return response.json();
    })
    .then(profiles => {
      const container = document.getElementById('profiles-container');

      // Remover todos os elementos filhos do container, exceto o botão de adicionar perfil
      container.innerHTML = `
        <div class="profile-item add-profile" onclick="window.location.href='criarPerfil.html'">
          <img src="/assets/profile.png" alt="Adicionar perfil" class="profile-avatar">
          <h3>Adicionar perfil</h3>
        </div>
      `;

      // Iterar sobre os perfis e adicioná-los ao container
      profiles.forEach(profile => {
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('profile-item');
        profileDiv.innerHTML = `
          <img src="/assets/profile.png" alt="Foto de perfil padrão" class="profile-avatar">
          <h3>${profile.name}</h3>
        `;
        container.appendChild(profileDiv);
      });
    })
    .catch(error => {
      console.error('Erro:', error);
      // Remover o perfil do erro para evitar mensagens indesejadas
      if (error.message === 'Erro ao carregar os perfis.') {
        alert('Não foi possível carregar os perfis no momento. Por favor, tente novamente mais tarde.');
      }
    });
}

// Chama a função para carregar os perfis ao carregar a página
window.onload = loadProfiles;


// Função para salvar um novo perfil no servidor
function saveProfile() {
  const name = document.getElementById('name').value;
  const cep = document.getElementById('cep').value;
  const groupProfile = document.getElementById('group-profile').checked;
  const childProfile = document.getElementById('child-profile').checked;
  const gender = document.querySelector('input[name="gender"]:checked')?.value || null;
  const language = document.getElementById('language').value;

  // Cria o objeto com as informações do perfil
  const newProfile = {
    name,
    cep: cep || null, // Se CEP não for fornecido, define como null
    isGroupProfile: groupProfile,
    isChildProfile: childProfile,
    gender,
    language
  };

  // Enviar perfil ao servidor via POST
  fetch('/profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newProfile)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao salvar o perfil.');
      }
      return response.text(); // Espera-se uma resposta de texto
    })
    .then(() => {
      // Redirecionar para a página principal após salvar
      window.location.href = 'index.html';
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao salvar o perfil.');
    });
}



