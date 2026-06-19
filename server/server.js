const express = require('express');
const cors = require('cors');
const conexao = require('./db');
const bcrypt = require('bcrypt'); // O pacote bônus para criptografia

const app = express();

app.use(cors());
app.use(express.json()); // Usamos express.json() no lugar do bodyParser

// 1. Rota de Cadastro (Com Criptografia Bcrypt)
app.post('/api/cadastro', async (req, res) => {
    const { email, nome, senha } = req.body;
    try {
        // Verifica se o email já existe
        const [usuarios] = await conexao.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (usuarios.length > 0) {
            return res.status(400).json({ message: 'Este email já está cadastrado' });
        }

        // Gera o hash da senha
        const saltRounds = 10;
        const hashSenha = await bcrypt.hash(senha, saltRounds);

        // Salva com a senha criptografada
        await conexao.execute(
            'INSERT INTO usuarios (email, nome, senha) VALUES (?, ?, ?)', 
            [email, nome, hashSenha]
        );
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: `Erro ao cadastrar: ${error.message}` });
    }
});

// 2. Rota de Login (Com Validação Bcrypt)
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [usuario] = await conexao.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (usuario.length === 0) {
            return res.status(400).json({ message: 'Email ou senha inválidos', tipoMensagem: 'danger' });
        }

        const verificaUsuario = usuario[0];

        // Compara a senha digitada com o hash salvo no banco
        const senhaValida = await bcrypt.compare(senha, verificaUsuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ message: "Senha inválida!", tipoMensagem: 'danger' });
        }

        const userData = {
            id: verificaUsuario.ID, // Essencial para a inscrição em eventos
            email: verificaUsuario.email,
            nome: verificaUsuario.nome,
            admin: verificaUsuario.admin,
        }
        res.json({ message: 'Login realizado com sucesso!', userData, tipoMensagem: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao logar!' });
    }
});

// 3. Rota Cadastro de Palestra (Área Admin)
app.post('/api/admin', async (req, res) => {
    const { titulo, descricao, nomePalestrante, localEvento, dataEvento } = req.body;
    const dadosEvento = [titulo, descricao, nomePalestrante, localEvento, dataEvento];
    try {
        await conexao.execute(
            "INSERT INTO palestra(titulo, descricao, nomePalestrante, localEvento, dataEvento) VALUES(?,?,?,?,?)", 
            dadosEvento
        );
        res.status(201).json({ message: "Evento cadastrado com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar evento!' });
    }
});

// 4. Rota Listar Palestras
app.get("/api/palestras", async (req, res) => {
    try {
        const [rows] = await conexao.execute("SELECT * FROM palestra");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Erro interno" });
    }
});

// 5. Rota de Inscrição em Palestras
app.post("/api/inscricao", async (req, res) => {
    const { idUsuario, idPalestra } = req.body;
    try {
        await conexao.execute(
            "INSERT INTO inscricoes (idUsuario, idPalestra) VALUES (?,?)",
            [idUsuario, idPalestra]
        );
        res.status(201).json({ message: "Inscrição realizada :)" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            res.status(400).json({ message: "Você já se inscreveu nesse evento!" });
        } else {
            res.status(500).json({ message: "Erro ao realizar a inscrição :(" });
        }
    }
});

// 6. Rota para buscar as inscrições do usuário logado
app.get("/api/inscricoes/:idUsuario", async (req, res) => {
    try {
        const [rows] = await conexao.execute(
            "SELECT idPalestra FROM inscricoes WHERE idUsuario = ?", 
            [req.params.idUsuario]
        );
        // Transforma o resultado em um array simples só com os IDs [1, 2, 5...]
        const ids = rows.map(row => row.idPalestra);
        res.json(ids);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar inscrições" });
    }
});

// Rota para cancelar inscrição
app.delete("/api/inscricao/:idUsuario/:idPalestra", async (req, res) => {
    try {
        await conexao.execute(
            "DELETE FROM inscricoes WHERE idUsuario = ? AND idPalestra = ?",
            [req.params.idUsuario, req.params.idPalestra]
        );
        res.json({ message: "Inscrição cancelada com sucesso!" });
    } catch (err) {
        res.status(500).json({ message: "Erro ao cancelar inscrição" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));