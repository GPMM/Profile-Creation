// Função para seleção de faixa etária
function selectRating(ratingId) {
  const ratings = document.querySelectorAll('.ratings img');
  ratings.forEach(rating => {
    rating.classList.remove('selected'); // Remove a classe de seleção de todas as imagens
  });

  const selectedRating = document.getElementById(ratingId);
  selectedRating.classList.add('selected'); // Adiciona a classe ao selecionado
}

// Função para abrir a página de seleção de avatar
function openAvatarSelection() {
  window.location.href = 'avatar-selection.html'; // Redireciona para a página de seleção de avatar
}

// Função para seleção de acessibilidade
function toggleAccessibility(accessibilityId) {
  const element = document.getElementById(accessibilityId);
  element.classList.toggle('selected'); // Adiciona ou remove a classe ao clicar
}

let selectedAvatar = null;

// Função para selecionar um avatar
function selectAvatar(avatarPath) {
    localStorage.setItem('selectedAvatar', avatarPath);
    selectedAvatar = avatarPath; // Armazena o avatar selecionado
    document.getElementById('avatar-preview').innerHTML = `<img src="${avatarPath}" alt="Avatar Selecionado">`;
}

// Função para salvar o avatar selecionado
function saveAvatar() {
    if (!selectedAvatar) {
        alert("Por favor, selecione um avatar antes de salvar.");
        return;
    }

    // Enviar a seleção do avatar para o servidor ou salvar localmente
    // Aqui, como exemplo, estamos usando localStorage para salvar o avatar
    localStorage.setItem('selectedAvatar', selectedAvatar);
    alert("Avatar salvo com sucesso!");

    // Você pode redirecionar o usuário ou executar outra ação aqui
    window.location.href = 'criarperfil.html'; // Exemplo de redirecionamento para a página de criação de perfil
}

// Função para voltar para a página anterior
function goBack() {
    window.history.back();
}


function editProfile(profileId) {
  // Redireciona para a página de edição, passando o ID do perfil na URL
  window.location.href = `editarPerfil.html?id=${profileId}`;
}

function updateProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const profileId = urlParams.get('id'); 

  const name = document.getElementById('name').value;
  const groupProfile = document.getElementById('group-profile').checked;
  const childProfile = document.getElementById('child-profile').checked;
  const gender = document.getElementById('gender').value;
  const language = document.getElementById('language').value;
  const selectedRating = document.querySelector('.ratings img.selected');
  const ageRating = selectedRating ? selectedRating.id : null;
  const captions = document.getElementById('closed-caption').classList.contains('selected');
  const signLanguageWindow = document.getElementById('sign-language').classList.contains('selected');
  const audioDescription = document.getElementById('audio-description').classList.contains('selected');
  const dialogueEnhancement = document.getElementById('dialogue-enhancement').classList.contains('selected');
  const avatarInput = document.getElementById('avatar-upload');
  const avatarFile = avatarInput.files[0];

  if (!name) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const updatedProfile = {
    name,
    isGroup: groupProfile,
    parentalControl: childProfile,
    gender,
    language,
    ageRating,
    captions,
    signLanguageWindow,
    audioDescription,
    dialogueEnhancement,
  };
  
  fetch(`/profiles/${profileId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedProfile),
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text || 'Erro ao atualizar o perfil.');
        });
      }
      return response.json(); // Processa a resposta como JSON
    })
    .then((data) => {
      console.log('Perfil atualizado:', data); // Verifica o que está sendo retornado
      window.location.href = 'index.html';
    })
    .catch(error => {
      console.error('Erro ao atualizar o perfil:', error);
      alert('Erro ao atualizar o perfil: ' + error.message);
    });
  
  
  

}

// Função para excluir um perfil
function deleteProfile(profileId) {
  if (confirm('Tem certeza de que deseja excluir este perfil?')) {
    fetch(`/profiles/${profileId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao excluir o perfil.');
      }
      // Recarrega os perfis após a exclusão
      loadProfiles();
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao excluir o perfil.');
    });
  }
}

// Função para carregar os dados do perfil a ser editado
function loadProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const profileId = urlParams.get('id'); // Obtém o ID do perfil da URL

  fetch(`/profiles/${profileId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar o perfil.');
      }
      return response.json();
    })
    .then(profile => {
      // Preenche os campos do formulário com os dados do perfil
      document.getElementById('name').value = profile.name;
      document.getElementById('group-profile').checked = profile.isGroup; // Preencher checkbox do perfil de grupo
      document.getElementById('child-profile').checked = profile.parentalControl; // Preencher checkbox do perfil de criança

      // Definir idioma selecionado
      document.getElementById('language').value = profile.language;

      // Definir gênero selecionado
      document.getElementById('gender').value = profile.gender;

      // Captura a classificação etária selecionada
      const selectedRating = document.querySelector(`.ratings img[id='${profile.ageRating}']`);
      if (selectedRating) selectedRating.classList.add('selected');

      // Captura as opções de acessibilidade
      if (profile.captions) document.getElementById('closed-caption').classList.add('selected');
      if (profile.signLanguageWindow) document.getElementById('sign-language').classList.add('selected');
      if (profile.audioDescription) document.getElementById('audio-description').classList.add('selected');
      if (profile.dialogueEnhancement) document.getElementById('dialogue-enhancement').classList.add('selected');
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao carregar os dados do perfil.');
    });
}

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
          <img src="/assets/addprofile.png" alt="Adicionar perfil" class="profile-avatar">
          <h3>Adicionar perfil</h3>
        </div>
      `;

      // Iterar sobre os perfis e adicioná-los ao container
      profiles.forEach(profile => {
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('profile-item');
        
        // Adiciona o conteúdo do perfil com o botão de editar
        profileDiv.innerHTML = `
                    <img src="${profile.avatar || '/assets/profile.png'}" alt="Foto de perfil" class="profile-avatar">
                    <h3>${profile.name}</h3>
                    <div class="button-container">
                        <button class="edit-btn" onclick="editProfile('${profile.id}')">Editar Perfil</button>
                        <button class="delete-btn" onclick="deleteProfile('${profile.id}')">Excluir Perfil</button>
                    </div>
                `;

        // Adicionar event listener para hover, para mostrar o botão
        profileDiv.addEventListener('mouseover', function() {
          this.querySelector('.edit-btn').style.display = 'block';
        });

        profileDiv.addEventListener('mouseout', function() {
          this.querySelector('.edit-btn').style.display = 'none';
        });

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

// Função para exibir o preview do avatar na criação do perfil
function loadSelectedAvatar() {
  const urlParams = new URLSearchParams(window.location.search);
  const avatarPath = urlParams.get('avatar'); // Obtém o caminho do avatar da URL

  if (avatarPath) {
      const avatarPreview = document.getElementById('avatar-preview');
      avatarPreview.innerHTML = `<img src="${avatarPath}" alt="Avatar Selecionado">`; // Define a imagem de pré-visualização
      document.getElementById('selected-avatar').value = avatarPath; // Armazena o caminho do avatar no campo oculto
  }
}

// Chama a função para carregar o avatar selecionado ao carregar a página
window.onload = function() {
  loadProfiles(); // Carrega os perfis
  loadSelectedAvatar(); // Carrega o avatar selecionado
};


function previewAvatar(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const avatarPreview = document.getElementById('avatar-preview');
    avatarPreview.src = e.target.result; // Define a imagem de pré-visualização para o arquivo selecionado
  };

  if (file) {
    reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
  }
}

function saveProfile() {
  const name = document.getElementById('name').value;
  const groupProfile = document.getElementById('group-profile').checked;
  const childProfile = document.getElementById('child-profile').checked;
  const gender = document.getElementById('gender').value;
  const language = document.getElementById('language').value;

  const selectedRating = document.querySelector('.ratings img.selected');
  const ageRating = selectedRating ? selectedRating.id : null;

  const captions = document.getElementById('closed-caption').classList.contains('selected');
  const signLanguageWindow = document.getElementById('sign-language').classList.contains('selected');
  const audioDescription = document.getElementById('audio-description').classList.contains('selected');
  const dialogueEnhancement = document.getElementById('dialogue-enhancement').classList.contains('selected');

  // Captura o caminho do avatar selecionado
  const avatarPath = localStorage.getItem('selectedAvatar') || '/assets/profile.png';


  if (!name || !document.getElementById('terms').checked) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const profileId = `profile_${Date.now()}`;

  const newProfile = {
    id: profileId,
    name,
    isGroup: groupProfile,
    parentalControl: childProfile,
    gender,
    language,
    ageRating,
    captions,
    signLanguageWindow,
    audioDescription,
    dialogueEnhancement,
    avatar: avatarPath
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
    return response.text();
})
.then(() => {
    window.location.href = 'index.html';
})
.catch(error => {
    console.error('Erro ao salvar o perfil:', error);
    alert('Erro ao salvar o perfil.');
});
}

// Chama a função para carregar os perfis ao carregar a página
window.onload = loadProfiles;
