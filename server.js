// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./usuarios.db');

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Cria tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
)`);

// Cadastro
app.post('/api/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;
    db.run(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, senha],
        function (err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.json({ message: 'Email já cadastrado!' });
                }
                return res.json({ message: 'Erro ao cadastrar!' });
            }
            res.json({ message: 'Cadastro realizado com sucesso!' });
        }
    );
});

// Login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    db.get(
        'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
        [email, senha],
        (err, row) => {
            if (err) return res.json({ message: 'Erro ao logar!' });
            if (row) {
                res.json({ message: 'Login realizado com sucesso!' });
            } else {
                res.json({ message: 'Email ou senha inválidos!' });
            }
        }
    );
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
