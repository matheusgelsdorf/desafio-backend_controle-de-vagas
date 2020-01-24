
### Introdução
Este projeto consiste em uma API de controle de candidatos para vagas de empregos.

---


### Algumas das tecnologias utilizadas
#### Backend
* Node.Js.
* Express.Js.
* Passport.
* Bcrypt.
* PostgreSQL.
* Knex.Js.


---


### Como testar?
##### 1. Após clonar o projeto para o seu computador, entre na pasta clonada e digite pelo terminal:
  * `npm i` para instalar as dependências do backend.

##### 2. Após instalar as dependências. Atualize o arquivo `knexfile.js` colocando o seu usuário e senha do PostGreSQL nos campos de _user_ e _password_ respectivamente.
* OBS: No arquivo .env o _authSecret_ que pode ser alterado para o segredo de sua preferência. Foi feito o upload do arquivo .env para facilitar os testes de quem for testar a API.

##### 3. Para iniciar o servidor digite através do terminal:
  * `npm start`
  * O servidor é executado na porta 3000.

##### 4. Em um primeiro momento somente o usuario "AdminRoot" está cadastrado, sendo necessários alimentar o banco de dados através das rotas.

##### 5. A autenticação é realizada inserindo o JWT (JSON Web Token) que é retornado das rotas `/signin/admin` e `/signin/candidate` no header `Auth` como um _bearer token_.

---


### Documentação 

#### 1. `/signin/admin`	
  * **POST** - Realiza o login como Administrador.    
    * **Requisição**  
      - _Body_
        ```json
        {
            "email":"administrador@gmail.com",
            "password":"abc123"
        }
        ``` 
      - **Não requer autenticação.**
    

#### 2. `/signin/candidate` 
  * **POST** - Realiza o login como Candidato.  
    * **Requisição**
      - _Body_
        ```json
        {
            "email":"candidato@gmail.com",
            "password":"abc123"
        }
        ```
      - **Não requer autenticação.**

#### 3. `'/validateToken'` 
  * **POST** - Verifica se um token de autenticação é válido.  
    * **Requisição**
      - _Body_
        ```json
        {
        "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NywibmFtZSI6Ik1hdGhldXMgQWRtaW40IiwiZW1haWwiOiJtYXRoZXVzNEBhZG1pbi5jb20iLCJjcGYiOiIwMzM5NDU3MDI3NCIsInBob25lIjoiNTM5OTkyNzE5NCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU3OTc1OTk2OSwiZXhwIjoxNTc5Nzk1OTY5fQ.bRFf-iAFRh2Z7wgJfqF-x0R1RsDUJtnz26-pzNn3LPM"
        }
        ```
      - **Não requer autenticação.**

#### 4. `'/signup/candidate'`    
  * **POST** - Cadastra um candidato. Utilizado para que os candidatos possam se cadastrar.  
    * **Requisição**
      - _Body_
        ```json
        {
            "name":"Candidato 1",
	        "email":"candidato1@hotmail.com",
	        "cpf":"03358968511",
	        "phone":"53999999999",
	        "password":"abc123",
	        "confirmPassword":"abc123"
        }
        ```
      - **Não requer autenticação.**

#### 5. `'/candidate/getByCpf'`     
  * **GET** - Retorna os dados de um candidato logado.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Candidato.**

#### 6. `'/candidate/getByCpf/:cpf'`     
  * **GET** - Retorna os dados do candidato correspondente ao valor do `:cpf`.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador.**

#### 7. `'/candidate'`     
  
  * **GET** - Retorna todos os candidatos cadastrados.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador.**

  * **PUT** - Atualiza os dados de um candidato. So pode ser acessado pelo próprio candidato. Permite atualizar o nome, cpf, email e senha.  
    * **Requisição**
      - _Body_
        ```json
        {
            "name": " Nome do Candidato Editado",
            "password":"novasenha",
	          "confirmPassword":"novasenha"
        }
        ```
      - **Requer autenticação. Nivel de acesso de Candidato.**
  
  * **DELETE** - Remove um candidato. So pode ser executado pelo próprio candidato.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Candidato.**

#### 8. `'/admin/getByCpf'`     
  * **GET** - Retorna os dados do admin logado.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador.**

#### 9. `'/admin'`     
  * **POST** - Cadastra um administrador. Utilizado para que administradores cadastrem administradores.  
    * **Requisição**
      - _Body_
        ```json
        {
          "name":"Admin 1",
	        "email":"matheus@hotmail.com",
	        "cpf":"03358968511",
	        "phone":"53999999999",
	        "password":"abc123",
	        "confirmPassword":"abc123"
        }
        ```
      - **Requer autenticação. Nivel de acesso de Administrador.**
  * **GET** - Retorna todos os administradores cadastrados.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador.**

  * **PUT** - Atualiza os dados de um administrador. So pode ser acessado pelo próprio administrador. Permite atualizar o nome, cpf, email e senha.  
    * **Requisição**
      - _Body_
        ```json
        {
            "name": "Nome Do Admin Editado",
            "password":"novasenha",
	          "confirmPassword":"novasenha"
        }
        ```
      - **Requer autenticação. Nivel de acesso de Administrador.**
  
  * **DELETE** - Remove um administrador. So pode ser executado pelo próprio administrador.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador.**

#### 10. `'/vacancy/getById/:id'`     
  * **GET** - Retorna os dados sobre a candidatura que corresponde ao valor de `:id`.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador ou Candidato.**

#### 11. `'/vacancy/getAllVacancyCandidates/:vacancy_id'`     
  * **GET** - Retorna dados sobre todas as candidaturas e candidatos associados a vaga correspondente ao `vacancy_id`.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador.**

#### 12. `'/vacancy/getAllAdminVacancies'`     
  * **GET** - Retorna dados sobre todas as vagas associadas ao administrador logado.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador.**

#### 13. `'/vacancy'`     
  * **POST** - Cadastra uma vaga. Utilizado para que administradores cadastrem vagas de emprego.  
    * **Requisição**
      - _Body_
        ```json
        {
          "title":"Desevolvedor Backend Junior - Node.Js",
          "description":"Bla bla bla bla",
        }
        ```
      - **Requer autenticação. Nivel de acesso de Administrador.**
  * **GET** - Retorna dados sobre todas as vagas cadastradas.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador ou Candidato.**

  * **PUT** - Atualiza os dados de uma vaga. So pode ser acessado pelo administrador que criou a vaga. Permite atualizar o titulo e a descrição.  
    * **Requisição**
      - _Body_
        ```json
        {
          "title":"Titulo editado",
          "description":"Bla bla bla bla editado",
        }
        ```
      - **Requer autenticação. Nivel de acesso de Administrador.**
  
  * **DELETE** - Remove uma vaga de emprego. So pode ser executado pelo administrador que criou a vaga.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador.**

#### 14. `'/application/getAllById'`     
  * **GET** - Retorna dados sobre todas as candidaturas de um candidato logado.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Candidato.**

#### 15. `'/application/getById/:id'`     
  * **GET** - Retorna dados sobre a candidatura que corresponde ao `:id`. Candidatos apenas podem ver os dados de suas candidaturas. Administradores apenas podem ver dados sobre candidaturas que estão relacionadas com as vagas de sua autoria.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Candidato ou Administrador.**

#### 16. `'/application'`     
  * **POST** - Cadastra um conjunto de candidaturas.   
    * **Requisição**
      - _Body_
        ```json
        {
          "vacancy_id_set":[21,22,23,24,25]
        }
        ```
      - **Requer autenticação. Nivel de acesso de Candidato.**

  * **PUT** - Atualiza o estágio de uma candidatura. É possivel definir 3 tipos de estágio: `'Em Andamento'`,  `'Aprovado` e  `'Reprovado`.  
    * **Requisição**
      - _Body_
        ```json
        {
          "id":1,
          "stage":"Reprovado"
        }
        ```
      - **Requer autenticação. Nivel de acesso de Administrador.**
  
  * **DELETE** - Remove uma candidatura. So pode ser executado pelo candidato que criou a candidatura.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Candidato.**

#### 17. `'/comment/getById/:id'`     
  * **GET** - Retorna os dados de um comentario correspondente ao valor do `:id`.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador.**

#### 18. `'/comment/application/getAllByID/:application_id'`     
  * **GET** - Retorna os comentários relativos a uma candidatura cujo o id é correspondente ao valor do `:application_id`.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador.**

#### 16. `'/comment'`     
  * **POST** - Cadastra um comentario.   
    * **Requisição**
      - _Body_
        ```json
        {
          "application_id":11,
          "content": "Bla bla bla bla"
        }
        ```
      - **Requer autenticação. Nivel de acesso de Administrador.**

  * **PUT** - Edita um comentário.  
    * **Requisição**
      - _Body_
        ```json
        {
          "application_id":11,
          "content": "Bla bla bla bla"
        }
        ```
      - **Requer autenticação. Nivel de acesso de Administrador.**
  
  * **DELETE** - Remove um comentário. So pode ser executado pelo administrador que realizou o comentário.
    * **Requisição**  
      - **Requer autenticação. Nivel de acesso de Administrador.**

---

### Contato
Casou houver alguma duvida, sugestao ou um relato de bug sinta-se à vontade de me contatar pelo email: matheusgelsdorf@gmail.com
