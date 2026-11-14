import { z } from "zod";

export const leadSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z.string().trim().max(20).refine((value) => /^\d{10,11}$/.test(value.replace(/\D/g, "")), "Informe um telefone válido com DDD"),
  email: z.string().trim().email("E-mail inválido").max(200),
  cidade: z.string().trim().min(2, "Informe a cidade").max(100),
  cargo: z.string().trim().min(2, "Informe seu cargo").max(100),
  servico: z.string().trim().min(2, "Informe o serviço").max(120),
});

export function createWhatsAppMessage(input: z.infer<typeof leadSchema>) {
  const lead = leadSchema.parse(input);
  return encodeURIComponent([
    `Olá! Meu nome é ${lead.nome}.`,
    `Telefone: ${lead.telefone}`,
    `E-mail: ${lead.email}`,
    `Cidade: ${lead.cidade}`,
    `Cargo: ${lead.cargo}`,
    `Serviço: ${lead.servico}`,
    "Gostaria de uma proposta.",
  ].join("\n"));
}