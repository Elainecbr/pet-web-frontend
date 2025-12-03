# Pet Web - Full Stack SPA 

# 🐶 Pet Web - O nosso Dogginho Care System 🐾 🐕 🐕‍🦺 🦮

Bem-vindo ao Pet Web! Este sistema permite que você cadastre suas informações e as do seu cãozinho, recebendo dicas e cuidados personalizados baseados na raça, você pode visualizar as fotos respectivas da raça. As informações após o cadastro ou login serão amostradas nos cards abaixo do formulário. Além do cadastro e visualização, é possível também modificar ou deletar as informações. 


# 🔮 Futuramente, poderá escolher as 
> <span style="color:  #9543f9;"> 🥣 Rações,</span> <span style="color:magenta;"> 🧴 Produtos de Cuidados para o seu cão</span>, <span style="color:#70CC87;"> 🩺Veterinários na sua região,</span> <span style="color:#8A4C57">Forum - 📖 Dog-Book - para encontrar outros tutores que queiram socializar</span> e muito mais. 

# Frontend — Projeto Pet Web
Este diretório contém a Single Page Application (HTML/CSS/JS) do Projeto Pet Web.

# Explicando o projeto
## Pet Web - Full Stack SPA Project

Este é um projeto Full Stack desenvolvido como uma Single Page Application (SPA) para o "Pet Web", com desenho com aproximação conforme o wireframe gráfico. O objetivo é demonstrar a integração de um backend em Python (Flask) com um frontend interativo (HTML, CSS, JavaScript), utilizando Pydantic para validação de dados e Flask-OpenAPI3 para documentação de API (Swagger UI).

<img width="812" height="460" alt="wireframe" src="github.com/user-attachments/assets/e8bd6e83-ac34-411a-bfeb-2472433f32b9">


## Backend:

    Python3
    Flask: Microframework web
    Flask-OpenAPI3: Integração OpenAPI/Swagger UI com Flask e Pydantic
    Pydantic: Validação de dados (modelos para requests/responses)
    SQLAlchemy (ORM)
    SQLite3: Banco de dados relacional leve
    CORS (Cross-Origin Resource Sharing)
    
## Frontend:

    HTML5: Estrutura da página
    CSS3: Estilização responsiva
    JavaScript (ES6+): Interatividade SPA, manipulação do DOM, requisições Fetch API    
    para o backend


# Frontend — Projeto Pet

### A estrutura

```
pet-web-frontend/
├── index.html
├── script.js
├── styles.css
├── assets/
└── README.md
 
```

# Este diretório contém a Single Page Application (HTML/CSS/JS) do Projeto Pet conforme Requisitos para o Desenvolvimento do MVP.

## Como usar localmente

1. Para visualiza a página no diretório `projeto_pet_web/frontend` abra  `index.html` no navegador (duplo clique ou `open` no macOS).Será aberto localmente, com os estilos, e JavaScript
2. Para usar o frontend com o API, o Frontend faz chamadas à API no backend em `http://127.0.0.1:5000`. Coloque no Navegador  esse enereço `http://127.0.0.1:5000`


Observações
- As imagens e ativos estão em `projeto_pet_web/frontend`.
- Se o backend estiver em outra URL/porta, atualize as URLs (const API_BASE_URL) de fetch em `projeto_pet_web/frontend`.

# Pet Web — Frontend

Frontend estático da aplicação Pet Web (SPA) construído com HTML, CSS e JavaScript puro.

Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari)


**Integração com o backend**
- O frontend consome a API no endereço `http://127.0.0.1:5000` por padrão. Se seu backend estiver em outra porta, atualize `API_BASE_URL` em `projeto_pet_web/frontend/script.js`.
