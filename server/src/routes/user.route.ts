dotenv.config();
import dotenv from "dotenv";
import Router, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../database/connection.ts";

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
});

routerUser.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, password, email } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios!"})
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if(!passwordRegex.test(password)) {
            return res.status(400).json({
                error: "A senha deve ter no mínimo 8 caracteres, contendo letras maiúsculas, minúsculas, números e caracteres especiais."
            })
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
});

routerUser.patch("/users", async (req: Request, res: Response) => {
    try {

        const { name, photo } = req.body;
        const authHeader = req.headers.authorization;
        
        if(!authHeader) {
            return res.status(401).json({ error: "Token não fornecido" });
        }

    const [_, token] = authHeader.split(" ");

    const secret = process.env.JWT_SECRET as string;
    let userId: string;

    try {
        const decoded = jwt.verify(token, secret) as { id: string };
        userId = decoded.id;
    } catch(error) {
        return res.status(401).json({ error: "Token inválido ou expirado" })
    }

    if (!name && !photo) {
            return res.status(400).json({ error: "Envie pelo menos o nome ou a foto para atualizar." });
    }

    const updatedUser = await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                name: name,
                photo: photo
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                photo: true,
            }
        })

        return res.status(200).json({ 
            message: "Informações altaradas com sucesso",
            user: updatedUser
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno ao atualizar usuário" });
    }
});

routerUser.patch("/users/password", async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) { 
            return res.status(401).json({
                error: "Token não fornecido"
            })
        }

        const [_, token] = authHeader.split(" ");
        const secret = process.env.JWT_SECRET as string;
        let userId: string;

        try {
            const decoded = jwt.verify(token, secret) as { id: string };
            userId = decoded.id;
        } catch(error) {
            return res.status(401).json({ error: "Token inválido ou expirado." });
        }

        const { oldPassword, newPassword } = req.body;

        if(!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Informe a senha atual e a nova senha" });
        }

        const user = await prisma.users.findUnique({
            where: {
                id: userId
            }
        })

        if(!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, newPassword);
        if(!isOldPasswordValid) {
            return res.status(401).json({ error: "A senha atual está incorreta." });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                error: "A nova senha deve ter no mínimo 8 caracteres, contendo letras maiúsculas, minúsculas, números e caracteres especiais." 
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                password: hashedNewPassword
            }
        })

        return res.status(200).json({ message: "Senha alterada com sucesso" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno ao alterar a senha." });
    }
});