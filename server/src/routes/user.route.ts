dotenv.config();
import dotenv from "dotenv";
import Router, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../database/connection";

export const routerUser = Router();

routerUser.post("/login", async (req: Request, res: Response) => {
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

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({ error: "Email ou senha incorretos."})
        }

        const secret = (process.env.JWT_SECRET as string);

        const token = jwt.sign(
            { id: user.id, role: user.role },
            secret,
            { expiresIn: "1d" }
        )

        return res.status(200).json({ 
            message: "Logado com sucesso!",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                photo: user.photo
            }
         });
    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
})

routerUser.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, password, email } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios!"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.users.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
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