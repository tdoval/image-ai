import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;

  const filePath = path.join(process.cwd(), "public", "images", filename as string);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    res.setHeader("Content-Type", "image/png");
    res.send(data);
  });
}
