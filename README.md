🎤 Sistema de Gerenciamento de Palestras

Sistema para gerenciamento de inscrições em palestras, composto por um backend em Node.js e um frontend em Angular.


🚀 Tecnologias Utilizadas

Frontend


Angular — Framework principal
Bootstrap — Estilização e design responsivo
TypeScript


Backend


Node.js com Express
MySQL — Banco de dados relacional
Bcrypt — Criptografia de senhas



⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:


Node.js
XAMPP (ou outro servidor MySQL)
Angular CLI



🛠️ Como Rodar o Projeto

1. Banco de Dados


Importe o arquivo .sql no phpMyAdmin (via XAMPP).
Certifique-se de que o servidor MySQL está rodando na porta padrão 3306.

**SQL:** O script de criação do banco de dados encontra-se no arquivo `sistema_palestras.sql` na raiz do repositório.

2. Backend


Navegue até a pasta server:


bash cd server


Instale as dependências:


bash npm install


Inicie o servidor:


bash nodemon server.js


3. Frontend


Na raiz do projeto, abra um novo terminal e instale as dependências:


bash npm install


Inicie a aplicação Angular:


bash ng serve


Acesse http://localhost:4200 no seu navegador.



👤 Funcionalidades


✅ Cadastro e login de usuários com criptografia de senha
📋 Listagem de palestras disponíveis
🔔 Inscrição e cancelamento de inscrição com confirmação via interface
🛡️ Área administrativa para gerenciamento