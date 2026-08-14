import request from "supertest";
import { app } from "../app.ts";
import { prismaMock } from "../database/prisma.mock.ts";

describe("POST /register (Register Route)", () => {
    it("should successfully create a new user", async() => {
        prismaMock.users.findUnique.mockResolvedValue(null);

        prismaMock.users.create.mockResolvedValue({
            id: "1",
            name: "Eduardo",
            email: "contato@deskify.com",
            password: "hashed_password",
            created_at: new Date(),
            updated_at: new Date()
        } as any);

        const response = await request(app)
            .post("/register")
            .send({
                name: "Eduardo",
                email: "contato@deskify.com",
                password: "Password123!"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.email).toBe("contato@deskify.com");
    });
});