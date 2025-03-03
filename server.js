import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();

// Middleware para parsing de JSON
app.use(express.json());

// Configurar CORS para permitir requisições do frontend
app.use(cors({
  origin: 'https://cadastro-usuario-mocha.vercel.app', // Domínio do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type'], // Cabeçalhos permitidos
}));

// Rota para listar usuários
app.get('/usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Rota para criar um usuário
app.post('/usuarios', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        age: req.body.age,
        name: req.body.name,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(400).json({ error: 'Erro ao criar usuário' });
  }
});

// Rota para atualizar um usuário
app.put('/usuarios/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        email: req.body.email,
        age: req.body.age,
        name: req.body.name,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(400).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Rota para deletar um usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(204).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(400).json({ error: 'Erro ao deletar usuário' });
  }
});

// Usar a porta dinâmica fornecida pelo ambiente (necessário para o Onrender)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Garantir que o Prisma desconecte ao encerrar o processo
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});