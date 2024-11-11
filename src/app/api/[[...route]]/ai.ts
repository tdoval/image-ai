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

    const image = await openai.images.generate({ prompt: prompt });
    // let placeholder =
    //   "https://oaidalleapiprodscus.blob.core.windows.net/private/org-pkF0ilxMiAKHrGEhGc5XR4hO/user-uTEab1mf3XqNIpz6XPeSf5xK/img-AwfQ8jfwTZ0ff1BVf0RR08VU.png?st=2024-11-11T19%3A40%3A59Z&se=2024-11-11T21%3A40%3A59Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-11-11T18%3A05%3A40Z&ske=2024-11-12T18%3A05%3A40Z&sks=b&skv=2024-08-04&sig=JA9F/6Y9VCfAGLJjUKDdN1swNrefAAJT5vWxhWgY19A%3D";

    if (image.data[0].url) return c.json({ data: image.data[0].url });
    // if (placeholder) return c.json({ data: placeholder });

    return c.json({ data: "Something went wrong" });
  },
);

export default app;
