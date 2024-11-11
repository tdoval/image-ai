// pages/api/saveImage.ts
import fs from "fs";
import path from "path";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";

const app = new Hono();

app.post("/", async (c) => {
  const { imageUrl } = await c.req.json();

  if (!imageUrl) {
    return c.json({ error: "URL da imagem é necessária" }, 400);
  }

  try {
    // Busca a imagem
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Falha ao buscar a imagem");

    // Converte a resposta em ArrayBuffer e então para Uint8Array
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = new Uint8Array(arrayBuffer);

    const uniqueId = uuidv4();

    // Define o caminho onde a imagem será salva
    const filePath = path.join(process.cwd(), "public", "images", `imagem_openai_${uniqueId}.png`);

    // Salva a imagem localmente
    fs.writeFileSync(filePath, imageBuffer);

    return c.json({ success: true, path: `/images/imagem_openai_${uniqueId}.png` });
  } catch (error) {
    console.error("Erro ao salvar a imagem:", error);
    return c.json({ error: "Erro ao salvar a imagem" }, 500);
  }
});

export default app;
