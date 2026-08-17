import request from "supertest";
import { app } from "../app.ts";
import { prismaMock } from "../database/prisma.mock.ts";

describe("POST /tickets (Tickets Route)", () => {
    it("should successfully create a new support ticket", async () => {
        prismaMock.ticket.create.mockResolvedValue({
            id: "ticket-uuid-123",
            title: "Erro ao carregar painel",
            description: "A tela fica em branco ao acessar o dashboard.",
            status: "OPEN",
            priority: "HIGH",
            userId: "user-uuid-123",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const response = await request(app)
            .post("/tickets")
            .send({
                title: "Erro ao carregar painel",
                description: "A tela fica em branco ao acessar o dashboard",
                priority: "HIGH"
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body.status).toBe("OPEN");
    })
})