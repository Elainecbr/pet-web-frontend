// frontend/script.js
// URL base do nosso Backend (onde o servidor Flask está rodando)
const API_BASE_URL = 'http://127.0.0.1:5000'; 


/*
    frontend/script.js
    - Coordena a UI da SPA e faz chamadas HTTP para a API Flask (backend).
        frontend/script.js
    - Este arquivo coordena a UI da single-page application (SPA)
        e faz chamadas HTTP para a API Flask (backend).
    - Principais responsabilidades:
        * carregar raças e preencher o dropdown
        * verificar/criar usuário (login leve pelo e-mail)
        * criar/editar/deletar cachorros (CRUD)
        * preencher o painel central com informações da raça
        * fornecer uma interface administrativa (botões 'Seu Cão - Adm' e 'Tutores - Adm')
        * controlar o estado de 'currentUserId' e o fluxo de logout
    - Use este arquivo para explicar as chamadas API no vídeo: cada fetch() está mapeada
*/

// --- Elementos do DOM (Document Object Model) que vamos manipular ---
// Pegamos referências aos elementos HTML usando seus IDs para manipulá-los.
const userForm      = document.getElementById('user-form');
const petForm       = document.getElementById('pet-form');
const racaSelect    = document.getElementById('raca-pet');
const userMessage   = document.getElementById('user-message');
const petMessage    = document.getElementById('pet-message');

const breedImage               = document.getElementById('breed-image');
const breedNameDisplay         = document.getElementById('breed-name');
const breedDescriptionDisplay  = document.getElementById('breed-description');
const cardCuidados             = document.getElementById('card-cuidados');
const cardComportamento        = document.getElementById('card-comportamento');
const cardRacao                = document.getElementById('card-racao');
const scrollToTopButton        = document.querySelector('.scroll-to-top');

// novos painéis separados
const dogAdminPanel  = document.getElementById('dog-admin-panel');   // embaixo do PET
const userAdminPanel = document.getElementById('user-admin-panel');  // embaixo do USUÁRIO

const logoutButton = document.getElementById('logout-button');
const adminButtons = document.querySelectorAll('.admin-buttons .admin-btn');

let currentUserId = null;

console.debug('adminButtons found:', adminButtons.length);

/**
 * Busca os cachorros do usuário atual e, se existir ao menos um,
 * preenche o painel com os dados do primeiro.
 */
async function loadUserDogs() {
    if (!currentUserId) return;
    try {
        const resp = await fetch(`${API_BASE_URL}/usuarios/${currentUserId}/cachorros`);
        if (!resp.ok) return;
        const dogs = await resp.json();
        if (dogs && dogs.length > 0) {
            preencherPainel(dogs[0]);
        }
    } catch (err) {
        console.error('Erro ao carregar cachorros do usuário:', err);
    }
}

/**
 * Preenche o painel central com os dados do cachorro fornecido.
 */
function preencherPainel(cachorro) {
    if (!cachorro) return;
    const breed = cachorro.breed || {};

    breedImage.src = `assets/${breed.imagem || 'default_dog.png'}`;
    breedNameDisplay.textContent = breed.nome || 'Raça desconhecida';
    breedDescriptionDisplay.textContent =
        `O(a) ${breed.nome || ''} é um cão de porte ${breed.porte || 'N/A'} e pertence ao grupo ${breed.grupo || 'N/A'}.`;

    cardCuidados.textContent      = breed.cuidados      || 'Informações de cuidados não disponíveis.';
    cardComportamento.textContent = breed.comportamento || 'Informações de comportamento não disponíveis.';
    cardRacao.textContent         = breed.racao         || 'Recomendações de ração não disponíveis.';

    const infoBox = document.querySelector('.left-panel .info-box');
    if (infoBox) {
        const existingTextElem = infoBox.querySelector('.panel-text');
        const existingText = existingTextElem ? existingTextElem.innerHTML : infoBox.innerHTML;

        infoBox.innerHTML = `
            <div class="dog-summary">
                <p><strong>Porte:</strong> ${breed.porte || 'N/A'}</p>
                <p><strong>Grupo:</strong> ${breed.grupo || 'N/A'}</p>
                <p><strong>Tutor:</strong> ${document.getElementById('nome-completo').value || 'N/A'}</p>
                <p><strong>Nome do cão:</strong> ${cachorro.nome_pet || 'N/A'}</p>
                <p><strong>Informações adicionais:</strong> ${cachorro.info_extra || '-'}</p>
            </div>
            <div class="panel-text">${existingText}</div>`;
    }
}

// --- Funções auxiliares ---

function displayMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
        element.textContent = '';
        element.className = 'message';
    }, 5000);
}

async function loadRacas() {
    try {
        const response = await fetch(`${API_BASE_URL}/racas`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const racas = await response.json();

        racaSelect.innerHTML = '<option value="">Selecione a raça</option>';
        racas.forEach(raca => {
            const option = document.createElement('option');
            option.value = raca.id;
            option.textContent = raca.nome;
            racaSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar raças:", error);
        displayMessage(petMessage, 'Não foi possível carregar as raças. Tente novamente mais tarde.', 'error');
    }
}

async function displayBreedInfo(racaNome) {
    if (!racaNome) {
        breedImage.src = 'assets/default_dog.png';
        breedNameDisplay.textContent = 'Selecione uma Raça';
        breedDescriptionDisplay.textContent = 'Selecione uma raça para ver suas informações detalhadas.';
        cardCuidados.textContent      = 'Selecione uma raça para ver detalhes de cuidados.';
        cardComportamento.textContent = 'Selecione uma raça para ver o comportamento esperado.';
        cardRacao.textContent         = 'Selecione uma raça para ver a recomendação de ração.';
        return;
    }

    try {
        const formattedRacaNameForUrl = racaNome.toLowerCase().replace(/ /g, '-');
        const response = await fetch(`${API_BASE_URL}/racas/${formattedRacaNameForUrl}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const raca = await response.json();

        breedImage.src = `assets/${raca.imagem || 'default_dog.png'}`;
        breedNameDisplay.textContent = raca.nome;
        breedDescriptionDisplay.textContent =
            `O(a) ${raca.nome} é um cão de porte ${raca.porte} e pertence ao grupo ${raca.grupo}. ${raca.comportamento.split(';')[0]}.`;
        cardCuidados.textContent      = raca.cuidados;
        cardComportamento.textContent = raca.comportamento;
        cardRacao.textContent         = raca.racao;

    } catch (error) {
        console.error("Erro ao carregar informações da raça:", error);
        displayMessage(petMessage, `Não foi possível carregar detalhes para a raça "${racaNome}".`, 'error');
        breedImage.src = 'assets/default_dog.png';
        breedNameDisplay.textContent = racaNome;
        breedDescriptionDisplay.textContent = 'Informações detalhadas não disponíveis para esta raça.';
        cardCuidados.textContent      = 'Detalhes de cuidados não encontrados.';
        cardComportamento.textContent = 'Detalhes de comportamento não encontrados.';
        cardRacao.textContent         = 'Recomendações de ração não encontradas.';
    }
}

// --- Eventos iniciais ---

document.addEventListener('DOMContentLoaded', () => {
    loadRacas();
    displayBreedInfo('');
    // desabilita botões admin até haver usuário
    adminButtons.forEach(btn => { btn.disabled = true; btn.classList.add('disabled'); });
    console.debug('DOMContentLoaded: adminButtons disabled, currentUserId=', currentUserId);
});

// --- Formulário de Usuário ---

userForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.debug('userForm submit event');

    const nomeCompleto = document.getElementById('nome-completo').value.trim();
    const email        = document.getElementById('email-usuario').value.trim();
    const telefone     = document.getElementById('telefone-usuario').value.trim();

    if (!nomeCompleto || !email) {
        displayMessage(userMessage, 'Nome completo e e-mail são obrigatórios.', 'error');
        return;
    }

    try {
        console.debug('Checking user by email:', email);
        const checkUserResponse = await fetch(`${API_BASE_URL}/usuarios/email/${email}`);
        console.debug('checkUserResponse status:', checkUserResponse.status);

        if (checkUserResponse.ok) {
            const existingUser = await checkUserResponse.json();
            document.getElementById('nome-completo').value    = existingUser.nome_completo;
            document.getElementById('telefone-usuario').value = existingUser.telefone || '';
            currentUserId = existingUser.id;
            displayMessage(userMessage, `Bem-vindo de volta, ${existingUser.nome_completo}! Você já está cadastrado.`, 'info');

            userForm.querySelector('button[type="submit"]').style.display = 'none';
            userForm.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);

            if (logoutButton) logoutButton.style.display = 'inline-block';

            adminButtons.forEach(btn => { btn.disabled = false; btn.classList.remove('disabled'); });
            console.debug('User found - adminButtons enabled, currentUserId=', currentUserId);

            loadUserDogs();

        } else if (checkUserResponse.status === 404) {
            const newUserResponse = await fetch(`${API_BASE_URL}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome_completo: nomeCompleto,
                    email: email,
                    telefone: telefone
                })
            });

            if (!newUserResponse.ok) {
                const errorData = await newUserResponse.json();
                throw new Error(errorData.message || `Erro ao cadastrar usuário: ${newUserResponse.status}`);
            }

            const newUser = await newUserResponse.json();
            currentUserId = newUser.id;
            displayMessage(userMessage, `Usuário "${newUser.nome_completo}" cadastrado com sucesso!`, 'success');

            userForm.querySelector('button[type="submit"]').style.display = 'none';
            userForm.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
            if (logoutButton) logoutButton.style.display = 'inline-block';

            adminButtons.forEach(btn => { btn.disabled = false; btn.classList.remove('disabled'); });
            console.debug('New user created - adminButtons enabled, currentUserId=', currentUserId);

            loadUserDogs();

        } else {
            const errorData = await checkUserResponse.json();
            throw new Error(errorData.message || `Erro inesperado na verificação do usuário: ${checkUserResponse.status}`);
        }

    } catch (error) {
        console.error("Erro no formulário de usuário:", error);
        displayMessage(userMessage, `Erro ao processar usuário: ${error.message}`, 'error');
        currentUserId = null;
    }
});

// --- Formulário de PET ---

petForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.debug('petForm submit event, currentUserId=', currentUserId);

    if (!currentUserId) {
        displayMessage(petMessage, 'Por favor, cadastre ou verifique seu usuário antes de registrar um pet.', 'error');
        return;
    }

    const nomePet = document.getElementById('nome-pet').value.trim();
    const racaId  = racaSelect.value;
    const idade   = document.getElementById('idade-pet').value;
    const peso    = document.getElementById('peso-pet').value;
    const infoExtra = document.getElementById('info-extra').value.trim();

    if (!nomePet || !racaId) {
        displayMessage(petMessage, 'Nome do Pet e Raça são obrigatórios.', 'error');
        return;
    }

    try {
        console.debug('Creating cachorro payload:', { nomePet, racaId, idade, peso, infoExtra, user_id: currentUserId });
        const response = await fetch(`${API_BASE_URL}/cachorros`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome_pet: nomePet,
                raca_id: parseInt(racaId),
                idade: idade ? parseInt(idade) : null,
                peso:  peso  ? parseFloat(peso) : null,
                info_extra: infoExtra,
                user_id: currentUserId
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.debug('POST /cachorros response status:', response.status, 'body:', errorData);
            if (response.status === 409 && errorData.cachorro) {
                displayMessage(petMessage, errorData.message || 'Cachorro já registrado.', 'info');
                preencherPainel(errorData.cachorro);
                const anchorExists = document.getElementById('rolagem1');
                if (anchorExists) anchorExists.scrollIntoView({ behavior: 'smooth' });
                return;
            }
            throw new Error(errorData.message || `Erro ao cadastrar cachorro: ${response.status}`);
        }

        const newCachorro = await response.json();
        console.debug('New cachorro created:', newCachorro);
        displayMessage(petMessage, `Cachorro "${newCachorro.nome_pet}" cadastrado com sucesso!`, 'success');

        const selectedRacaOption = racaSelect.options[racaSelect.selectedIndex];
        displayBreedInfo(selectedRacaOption.textContent);

        petForm.reset();
        const anchor = document.getElementById('rolagem1');
        if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Erro no formulário de pet:", error);
        displayMessage(petMessage, `Erro ao registrar pet: ${error.message}`, 'error');
    }
});

// --- Mudança no dropdown de raça ---

racaSelect.addEventListener('change', () => {
    const selectedRacaName = racaSelect.options[racaSelect.selectedIndex].textContent;
    if (racaSelect.value) {
        displayBreedInfo(selectedRacaName);
    } else {
        displayBreedInfo('');
    }
});

// --- Botão "Voltar ao topo" ---

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

// --- Logout / Reset ---

function resetToDefault() {
    currentUserId = null;

    userForm.querySelector('button[type="submit"]').style.display = 'inline-block';
    userForm.querySelectorAll('input, select, textarea').forEach(el => { el.disabled = false; });
    userForm.reset();

    petForm.reset();

    displayBreedInfo('');
    breedImage.src = 'assets/default_dog.png';

    if (logoutButton) logoutButton.style.display = 'none';

    // limpar painéis de admin
    if (dogAdminPanel) {
        dogAdminPanel.innerHTML = '';
        dogAdminPanel.style.display = 'none';
        dogAdminPanel.classList.add('hidden');
    }
    if (userAdminPanel) {
        userAdminPanel.innerHTML = '';
        userAdminPanel.style.display = 'none';
        userAdminPanel.classList.add('hidden');
    }

    // remover áreas de ações específicas
    const petActions  = document.getElementById('pet-admin-actions');
    const userActions = document.getElementById('user-admin-actions');
    if (petActions)  petActions.remove();
    if (userActions) userActions.remove();

    if (petForm && petForm.dataset) delete petForm.dataset.cachorroId;

    adminButtons.forEach(btn => { btn.disabled = true; btn.classList.add('disabled'); });

    displayMessage(userMessage, 'Você saiu. Os formulários foram resetados.', 'info');
}

if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        resetToDefault();
    });
}

// --- Admin de CÃES ---

async function showAdminDogs() {
    if (!currentUserId) {
        displayMessage(userMessage, 'Por favor, verifique/registre um usuário antes de acessar o admin de cães.', 'error');
        return;
    }
    try {
        const resp = await fetch(`${API_BASE_URL}/usuarios/${currentUserId}/cachorros`);
        if (!resp.ok) throw new Error('Falha ao buscar cachorros');
        const dogs = await resp.json();
        renderAdminDogsList(dogs);
    } catch (err) {
        console.error(err);
        displayMessage(userMessage, 'Não foi possível carregar os cachorros para administração.', 'error');
    }
}

function renderAdminDogsList(dogs) {
    const panel = dogAdminPanel;
    if (!panel) return;

    panel.style.display = 'block';
    panel.classList.remove('hidden');
    panel.innerHTML = '';

    const title = document.createElement('h4');
    title.textContent = 'Gerenciar Cachorros';
    panel.appendChild(title);

    if (!dogs || dogs.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'Nenhum cachorro cadastrado para este usuário.';
        panel.appendChild(p);
        return;
    }

    const ul = document.createElement('ul');
    dogs.forEach(d => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${d.nome_pet}</strong> (id: ${d.id}) - ${d.idade || '-'} anos
            <div style="margin-top:6px;">
                <button data-id="${d.id}" class="admin-view-dog">Visualizar</button>
                <button data-id="${d.id}" class="admin-edit-dog">Editar</button>
                <button data-id="${d.id}" class="admin-delete-dog">Deletar</button>
            </div>`;
        ul.appendChild(li);
    });
    panel.appendChild(ul);

    panel.querySelectorAll('.admin-view-dog').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const resp = await fetch(`${API_BASE_URL}/cachorros/${id}`);
            if (!resp.ok) { displayMessage(petMessage, 'Cachorro não encontrado.', 'error'); return; }
            const cachorro = await resp.json();
            populatePetForm(cachorro);
            preencherPainel(cachorro);  // ← ADICIONA ESTA LINHA!
        });
    });
    panel.querySelectorAll('.admin-edit-dog').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const resp = await fetch(`${API_BASE_URL}/cachorros/${id}`);
            if (!resp.ok) { displayMessage(petMessage, 'Cachorro não encontrado.', 'error'); return; }
            const cachorro = await resp.json();
            populatePetForm(cachorro);
            preencherPainel(cachorro);  // ← ADICIONA ESTA LINHA!
            showPetAdminActions(cachorro.id);
        });
    });
    panel.querySelectorAll('.admin-delete-dog').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            if (!confirm('Confirma a exclusão deste cachorro?')) return;
            const resp = await fetch(`${API_BASE_URL}/cachorros/${id}`, { method: 'DELETE' });
            if (!resp.ok) { displayMessage(petMessage, 'Falha ao deletar cachorro.', 'error'); return; }
            displayMessage(petMessage, 'Cachorro deletado com sucesso.', 'success');
            showAdminDogs();
            petForm.reset();
        });
    });
}

function populatePetForm(cachorro) {
    if (!cachorro) return;
    document.getElementById('nome-pet').value   = cachorro.nome_pet || '';
    document.getElementById('idade-pet').value  = cachorro.idade    || '';
    document.getElementById('peso-pet').value   = cachorro.peso     || '';
    document.getElementById('info-extra').value = cachorro.info_extra || '';
    if (cachorro.raca_id) {
        racaSelect.value = cachorro.raca_id;
        const opt = racaSelect.options[racaSelect.selectedIndex];
        displayBreedInfo(opt ? opt.textContent : '');
    }
    petForm.dataset.cachorroId = cachorro.id;
}

function showPetAdminActions(cachorroId) {
    let actions = document.getElementById('pet-admin-actions');
    if (!actions) {
        actions = document.createElement('div');
        actions.id = 'pet-admin-actions';
        actions.style.marginTop = '8px';
        petForm.appendChild(actions);
    }
    actions.innerHTML = `
        <button id="pet-update-btn">Atualizar Pet</button>
        <button id="pet-delete-btn" style="margin-left:6px;">Deletar Pet</button>
    `;

    petForm.querySelectorAll('input, select, textarea').forEach(el => { el.disabled = false; });
    console.debug('showPetAdminActions: pet form enabled for editing, cachorroId=', cachorroId);

    document.getElementById('pet-update-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        const id = cachorroId || petForm.dataset.cachorroId;
        const payload = {
            nome_pet: document.getElementById('nome-pet').value.trim(),
            raca_id: parseInt(racaSelect.value) || null,
            idade: document.getElementById('idade-pet').value ? parseInt(document.getElementById('idade-pet').value) : null,
            peso:  document.getElementById('peso-pet').value  ? parseFloat(document.getElementById('peso-pet').value) : null,
            info_extra: document.getElementById('info-extra').value.trim()
        };
        const resp = await fetch(`${API_BASE_URL}/cachorros/${id}`, {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });
        if (!resp.ok) { displayMessage(petMessage, 'Falha ao atualizar pet.', 'error'); return; }
        const updated = await resp.json();
        displayMessage(petMessage, 'Pet atualizado com sucesso.', 'success');
        populatePetForm(updated);
        showAdminDogs();
    });

    document.getElementById('pet-delete-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        const id = cachorroId || petForm.dataset.cachorroId;
        if (!confirm('Confirma a exclusão deste cachorro?')) return;
        const resp = await fetch(`${API_BASE_URL}/cachorros/${id}`, { method: 'DELETE' });
        if (!resp.ok) { displayMessage(petMessage, 'Falha ao deletar pet.', 'error'); return; }
        displayMessage(petMessage, 'Pet deletado com sucesso.', 'success');
        petForm.reset();
        showAdminDogs();
    });
}

// --- Admin de TUTORES ---

async function showAdminUsers() {
    try {
        const resp = await fetch(`${API_BASE_URL}/usuarios`);
        if (!resp.ok) throw new Error('Falha ao buscar usuários');
        const users = await resp.json();
        renderAdminUsersList(users);
    } catch (err) {
        console.error(err);
        displayMessage(userMessage, 'Não foi possível carregar os usuários para administração.', 'error');
    }
}

function renderAdminUsersList(users) {
    const panel = userAdminPanel;
    if (!panel) return;

    panel.style.display = 'block';
    panel.classList.remove('hidden');
    panel.innerHTML = '';

    const title = document.createElement('h4');
    title.textContent = 'Gerenciar Tutores';
    panel.appendChild(title);

    if (!users || users.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'Nenhum tutor cadastrado.';
        panel.appendChild(p);
        return;
    }

    const ul = document.createElement('ul');
    users.forEach(u => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${u.nome_completo}</strong> (id: ${u.id}) - ${u.email}
            <div style="margin-top:6px;">
                <button data-id="${u.id}" class="admin-view-user">Visualizar</button>
                <button data-id="${u.id}" class="admin-edit-user">Editar</button>
                <button data-id="${u.id}" class="admin-delete-user">Deletar</button>
            </div>`;
        ul.appendChild(li);
    });
    panel.appendChild(ul);

    panel.querySelectorAll('.admin-view-user').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const resp = await fetch(`${API_BASE_URL}/usuarios/${id}`);
            if (!resp.ok) { displayMessage(userMessage, 'Usuário não encontrado.', 'error'); return; }
            const user = await resp.json();
            populateUserForm(user);
            showUserAdminActions(user.id);
        });
    });
    panel.querySelectorAll('.admin-edit-user').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const resp = await fetch(`${API_BASE_URL}/usuarios/${id}`);
            if (!resp.ok) { displayMessage(userMessage, 'Usuário não encontrado.', 'error'); return; }
            const user = await resp.json();
            populateUserForm(user);
            showUserAdminActions(user.id);
        });
    });
    panel.querySelectorAll('.admin-delete-user').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            if (!confirm('Confirma a exclusão deste usuário e seus cães?')) return;
            const resp = await fetch(`${API_BASE_URL}/usuarios/${id}`, { method: 'DELETE' });
            if (!resp.ok) { displayMessage(userMessage, 'Falha ao deletar usuário.', 'error'); return; }
            displayMessage(userMessage, 'Usuário deletado com sucesso.', 'success');
            showAdminUsers();
        });
    });
}

function populateUserForm(user) {
    if (!user) return;
    console.debug('populateUserForm called for user id=', user.id);
    document.getElementById('nome-completo').value   = user.nome_completo || '';
    document.getElementById('email-usuario').value   = user.email || '';
    document.getElementById('telefone-usuario').value= user.telefone || '';

    currentUserId = user.id;

    userForm.querySelector('button[type="submit"]').style.display = 'none';
    userForm.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
    console.debug('populateUserForm: user form disabled after populate (for login-flow)');
    if (logoutButton) logoutButton.style.display = 'inline-block';
}

function showUserAdminActions(userId) {
    let actions = document.getElementById('user-admin-actions');
    if (!actions) {
        actions = document.createElement('div');
        actions.id = 'user-admin-actions';
        actions.style.marginTop = '8px';
        userForm.appendChild(actions);
    }
    actions.innerHTML = `
        <button id="user-update-btn">Atualizar Tutor</button>
        <button id="user-delete-btn" style="margin-left:6px;">Deletar Tutor</button>
    `;

    userForm.querySelectorAll('input, select, textarea').forEach(el => { el.disabled = false; });
    console.debug('showUserAdminActions: user form enabled for editing, userId=', userId);

    document.getElementById('user-update-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        const payload = {
            nome_completo: document.getElementById('nome-completo').value.trim(),
            email:        document.getElementById('email-usuario').value.trim(),
            telefone:     document.getElementById('telefone-usuario').value.trim()
        };
        const resp = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });
        if (!resp.ok) { displayMessage(userMessage, 'Falha ao atualizar tutor.', 'error'); return; }
        const updated = await resp.json();
        displayMessage(userMessage, 'Tutor atualizado com sucesso.', 'success');
        populateUserForm(updated);
        showAdminUsers();
    });

    document.getElementById('user-delete-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        if (!confirm('Confirma a exclusão deste tutor e seus cães?')) return;
        const resp = await fetch(`${API_BASE_URL}/usuarios/${userId}`, { method: 'DELETE' });
        if (!resp.ok) { displayMessage(userMessage, 'Falha ao deletar tutor.', 'error'); return; }
        displayMessage(userMessage, 'Tutor deletado com sucesso.', 'success');
        userForm.reset();
        showAdminUsers();
    });
}

// --- Conectar botões admin ---

adminButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const text = e.currentTarget.textContent.trim();
        console.debug('admin button clicked:', text);
        if (text.startsWith('Seu Cão')) {
            showAdminDogs();
        } else if (text.startsWith('Tutores')) {
            showAdminUsers();
        } else {
            displayMessage(userMessage, `${text} ainda não implementado.`, 'info');
        }
    });
});