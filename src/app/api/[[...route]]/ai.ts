import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI();

const app = new Hono().post(
  "/generate-image",
  zValidator(
    "json",
    z.object({
      prompt: z.string().min(3).max(1000),
    }),
  ),
  async (c) => {
    const { prompt } = c.req.valid("json");

    // TODO: Refatorar para uma arquitetura melhor

    const image = await openai.images.generate({ prompt: prompt });

    if (!image.data[0].url) {
      return c.json({ data: "Erro ao gerar imagem" }, 500);
    }

    const imageUrl = image.data[0].url;

    const baseUrl = new URL(c.req.url);
    baseUrl.pathname = "/api/save-image";

    const saveResponse = await fetch(baseUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });

    if (!saveResponse.ok) {
      return c.json({ data: "Erro ao salvar a imagem" }, 500);
    }

    const saveData = await saveResponse.json();

    return c.json({ data: saveData.path as string }, 200);
  },
);

export default app;
