import { describe, expect, test } from "bun:test";
import { createWhatsAppMessage, leadSchema } from "./lead-data";

const lead = {
  nome: "Contato Teste", telefone: "(24) 99931-3230",
  email: "contato@example.com", cidade: "Rio de Janeiro",
  cargo: "Gerente", servico: "Locação & suporte",
};

describe("required lead information", () => {
  for (const field of ["email", "cidade", "cargo"]) {
    test(`${field} must be provided`, () => {
      expect(leadSchema.safeParse({ ...lead, [field]: "" }).success).toBe(false);
      expect(leadSchema.safeParse(lead).success).toBe(true);
    });
  }
  test("rejects an invalid email", () => {
    expect(leadSchema.safeParse({ ...lead, email: "invalid" }).success).toBe(false);
  });
  test("WhatsApp receives email, city, job title and service without breaking URL parameters", () => {
    const url = new URL(`https://wa.me/5524999313230?text=${createWhatsAppMessage(lead)}`);
    expect(url.searchParams.get("text")).toContain("E-mail: contato@example.com\nCidade: Rio de Janeiro\nCargo: Gerente\nServiço: Locação & suporte");
    expect([...url.searchParams.keys()]).toEqual(["text"]);
  });
});