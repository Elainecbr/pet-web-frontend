# Pet Web - Full Stack SPA 

# 🐶 Pet Web - O nosso Dogginho Care System 🐾 🐕 🐕‍🦺 🦮

Bem-vindo ao Pet Web! Este sistema permite que você cadastre suas informações e as do seu cãozinho, recebendo dicas e cuidados personalizados baseados na raça, você pode visualizar as fotos respectivas da raça. As informações após o cadastro ou login serão amostradas nos cards abaixo do formulário. Além do cadastro e visualização, é possível também modificar ou deletar as informações. 


# ⚙️ Futuramente, poderá ser escolhido: 

> <span style="color:  #9543f9;"> 🥣 Diferentes tipos de Rações,</span> <span style="color:magenta;"> 🧴 Produtos de Cuidados para o seu cão</span>, <span style="color:#70CC87;"> 🩺 Veterinários na sua região,</span> <span style="color:#8A4C57">Forum - 📖 Dog-Book - para encontrar outros tutores que queiram socializar</span> e muito mais.
> > Futuramente será possivel Monetização de Conteúdo - converter o tráfego ou o conteúdo online em receita, (marketing de afiliados, publicidade direta, conteúdo patrocinado e outras estratégias).


# Frontend — Projeto Pet Web
Este diretório contém a Single Page Application (HTML/CSS/JS) do Projeto Pet Web.

# Explicando o projeto
## Pet Web - Full Stack SPA Project

Este é um projeto Full Stack desenvolvido como uma Single Page Application (SPA) para o "Pet Web", com desenho com aproximação conforme o wireframe gráfico. O objetivo é demonstrar a integração de um backend em Python (Flask) com um frontend interativo (HTML, CSS, JavaScript), utilizando Pydantic para validação de dados e Flask-OpenAPI3 para documentação de API (Swagger UI).

[ Link: O Wireframe gráfico simila a página](https://github.com/user-attachments/assets/222aa8f9-9262-4d1f-ad27-a35acae0f414)

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


# Frontend — Projeto Pet Web
<img width="1723" height="987" alt="image" src="https://github.com/user-attachments/assets/d25366ff-f1bf-4d46-a66b-9fd7a44722d0" />



**⚠️ IMPORTANTE:** Após clonar os dois repositórios (pet-web-backend e pet-web-frontend), renomeie as pastas para "backend" e "frontend" respectivamente, pois o backend serve tanto a API quanto o frontend na porta 5000, e o código busca a pasta frontend um nível acima do backend (../frontend). A linha de código responsável está em `app.py` linha 384:
```python
frontend_dir = os.path.abspath(os.path.join(basedir, '..', 'frontend'))
```
 


### A estrutura

```
frontend/
├── index.html
├── script.js
├── styles.css
├── assets/
└── README.md
 
```

# Este diretório contém a Single Page Application (HTML/CSS/JS) do Projeto Pet conforme Requisitos para o Desenvolvimento do MVP.

## Como usar localmente

1. Para visualiza a página no diretório `/frontend` (se foi baixado como .zip o diretório poderá ser pet-web-backend-main, renomeie as pastas para "backend" e "frontend" respectivamente,) abra  `index.html` no navegador (duplo clique ou `open` no macOS).Será aberto localmente, com os estilos, e JavaScript
2. Para usar o frontend com o API, o Frontend faz chamadas à API no backend em `http://127.0.0.1:5000`. Coloque no Navegador  esse enereço `http://127.0.0.1:5000`


Observações
- As imagens e ativos estão em `/frontend/assets`.
- Se o backend estiver em outra URL/porta, atualize as URLs (const API_BASE_URL) de fetch em `/frontend`.

# Pet Web — Frontend

Frontend estático da aplicação Pet Web (SPA) construído com HTML, CSS e JavaScript puro.

Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari)


**Integração com o backend**
- O frontend consome a API no endereço `http://127.0.0.1:5000` por padrão. Se seu backend estiver em outra porta, atualize `API_BASE_URL` em `/frontend/script.js`.
