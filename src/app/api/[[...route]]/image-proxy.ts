import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const imageUrl = c.req.query("url");

  // Valida se a URL da imagem foi fornecida
  if (!imageUrl) {
    return c.json({ error: "URL da imagem é necessária" }, 400);
  }

  try {
    // Adiciona log para verificar a URL recebida
    console.log("Buscando imagem da URL:", imageUrl);

    const response = await fetch(imageUrl);

    // Verifica se a resposta é válida
    if (!response.ok) {
      console.error("Erro ao buscar a imagem, código de status:", response.status);
      return c.json({ error: "Falha ao buscar a imagem" }, 500);
    }

    // Converte a resposta em ArrayBuffer
    const imageArrayBuffer = await response.arrayBuffer();

    // Define os cabeçalhos para imagem e cache
    c.header("Content-Type", "image/png");
    c.header("Cache-Control", "public, max-age=86400");

    // Retorna a imagem como ArrayBuffer
    return c.body(imageArrayBuffer);
  } catch (error) {
    // Loga o erro para depuração
    console.error("Erro ao carregar a imagem:", error);
    return c.json({ error: "Erro ao carregar a imagem" }, 500);
  }
});

export default app;
