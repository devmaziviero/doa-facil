import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { doacoesRouter } from "./routes/doacoes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/doacoes", doacoesRouter);

// captura qualquer erro não tratado nas rotas (ex: falha de banco) e
// responde com 500 em vez de derrubar o processo do servidor
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno no servidor." });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
