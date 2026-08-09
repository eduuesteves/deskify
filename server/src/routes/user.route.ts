import Router from "express";
import bcrypt from "bcrypt";
import { prisma } from "../database/connection";

export const routerUser = Router();

routerUser.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ error: "Email e senha são obrigatórios." });
        }

        const user = await prisma.users.findUnique({
            where: { email: email }
        })

        if(!user) {
            return res.status(401).json({ error: "Email ou senha incorretos." });
        }

        if(user.password_hash !== password) {
            return res.status(401).json({ error: "E-mail ou senha incorretos." });
        }


        return res.status(200).json({ 
            message: "Logado com sucesso!",
            user: {
                id: user.id,
                email: user.email
            }
         });
    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
})

routerUser.post("/register", async (req, res) => {
    try {
        const { name, password_hash, email } = req.body;

        if(!name || !password_hash || !email) {
            return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios!"})
        }

        const newUser = await prisma.users.create({
            data: {
                name: name,
                password_hash: password_hash,
                email: email
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })

        return res.status(201).json(newUser);
    } catch(error) {
        console.error(error);

        return res.status(500).json({ error: "Erro interno no servidor ao tentar criar o usuário"});
    }
})