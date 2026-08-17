import { Request, Response } from "express";
import { prisma } from "../database/connection.ts";
import { Router } from "express";
import jwt from "jsonwebtoken";

export const routerTicket = Router();

routerTicket.post("/ticket", async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("teste");

        if(!authHeader) {
            console.log(authHeader)
            return res.status(401).json({ error: "Token não fornecido." });
        }

        const [_, token] = authHeader.split(" ");

        const secret = process.env.JWT_SECRET as string;
        let userId: string;

        try {
            const decoded = jwt.verify(token, secret) as { id: string };
            userId = decoded.id;
            console.log("teste2")
        } catch(error) {
            console.log("teste3")
            return res.status(401).json({ error: "Token inválido ou expirado" })
        }

        const { title, description, priority } = req.body;


        if(!userId) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }

        const ticket = await prisma.ticket.create({
            data: {
                title,
                description,
                priority,
                userId
            }
        });

        return res.status(201).json(ticket);
    } catch(error) {
        return res.status(500).json({ error: "Erro ao criar ticket." });
    }
});

routerTicket.get("/ticket" , async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({ error: "Token não fornecido." });
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

        if(!userId) {
            return res.status(401).json({ error: "Usuário sem chamados." });
        }

        const tickets = await prisma.ticket.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return res.status(200).json(tickets);
    } catch(error) {
        return res.status(500).json({ error: "Erro ao buscar tickets" })
    }
})

routerTicket.get("/ticket/:id", async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token não fornecido." });
        }

        const [_, token] = authHeader.split(" ");
        const secret = process.env.JWT_SECRET as string;
        let userId: string;

        try {
            const decoded = jwt.verify(token, secret) as { id: string };
            userId = decoded.id;
        } catch (error) {
            return res.status(401).json({ error: "Token inválido ou expirado" });
        }

        if (!userId) {
            return res.status(401).json({ error: "Usuário sem chamados." });
        }
        
        const { id } = req.params;

        const ticket = await prisma.ticket.findFirst({
            where: { 
                id: id as string,        // Força a tipagem para string
                userId: userId as string // Força a tipagem para string
    }
        });

        if (!ticket) {
            return res.status(404).json({ error: "Chamado não encontrado." });
        }

        return res.status(200).json(ticket);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar detalhes do chamado." });
    }
});

// 4. PUT /ticket/:id - Atualizar o status ou dados do ticket
routerTicket.put("/ticket/:id", async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token não fornecido." });
        }

        const [_, token] = authHeader.split(" ");
        const secret = process.env.JWT_SECRET as string;
        let userId: string;

        try {
            const decoded = jwt.verify(token, secret) as { id: string };
            userId = decoded.id;
        } catch (error) {
            return res.status(401).json({ error: "Token inválido ou expirado" });
        }

        if (!userId) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }

        const { id } = req.params;
        const { status, title, description, priority } = req.body;

        const ticketExists = await prisma.ticket.findFirst({
            where: { 
                id: id as string,        // Força a tipagem para string
                userId: userId as string // Força a tipagem para string
    }
        });

        if (!ticketExists) {
            return res.status(404).json({ error: "Chamado não encontrado ou permissão negada." });
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: id as string },
            data: {
                status: status ?? ticketExists.status,
                title: title ?? ticketExists.title,
                description: description ?? ticketExists.description,
                priority: priority ?? ticketExists.priority
            }
        });

        return res.status(200).json(updatedTicket);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar o chamado." });
    }
});