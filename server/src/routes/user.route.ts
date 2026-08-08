import Router from "express";
import { prisma } from "../database/connection";

export const routerUser = Router();

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