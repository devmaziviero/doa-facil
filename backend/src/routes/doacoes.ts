import { Router } from "express";
import { randomBytes } from "node:crypto";
import { pool } from "../db";
import { STATUS_VALIDOS } from "../types";
import { asyncHandler } from "../asyncHandler";

export const doacoesRouter = Router();

const COLUNAS_PUBLICAS = `
  id, titulo, descricao, categoria, estado, cidade, contato, status, criado_em
`;

function gerarCodigoGerenciamento() {
  return randomBytes(4).toString("hex").toUpperCase(); // ex: A3F9K2XZ
}

// GET /api/doacoes?estado=&cidade=&categoria=&status=
doacoesRouter.get("/", asyncHandler(async (req, res) => {
  const { estado, cidade, categoria, status } = req.query;

  const condicoes: string[] = [];
  const valores: unknown[] = [];

  // por padrão só mostra o que ainda está disponível para retirada
  const statusFiltro = typeof status === "string" ? status : "disponivel";
  if (statusFiltro !== "todas") {
    valores.push(statusFiltro);
    condicoes.push(`status = $${valores.length}`);
  }

  if (typeof estado === "string" && estado.trim()) {
    valores.push(estado.trim());
    condicoes.push(`estado = $${valores.length}`);
  }

  if (typeof cidade === "string" && cidade.trim()) {
    valores.push(cidade.trim());
    condicoes.push(`cidade = $${valores.length}`);
  }

  if (typeof categoria === "string" && categoria.trim()) {
    valores.push(categoria.trim());
    condicoes.push(`categoria = $${valores.length}`);
  }

  const where = condicoes.length ? `where ${condicoes.join(" and ")}` : "";

  const resultado = await pool.query(
    `select ${COLUNAS_PUBLICAS} from doacoes ${where} order by criado_em desc`,
    valores
  );

  res.json(resultado.rows);
}));

// GET /api/doacoes/codigo/:codigo — usado na página "gerenciar", já que o
// usuário só recebe o código na hora da publicação, nunca o id.
doacoesRouter.get("/codigo/:codigo", asyncHandler(async (req, res) => {
  const resultado = await pool.query(
    `select ${COLUNAS_PUBLICAS} from doacoes where codigo_gerenciamento = $1`,
    [req.params.codigo]
  );

  if (resultado.rowCount === 0) {
    return res.status(404).json({ erro: "Nenhuma doação encontrada com esse código." });
  }

  res.json(resultado.rows[0]);
}));

// GET /api/doacoes/:id
doacoesRouter.get("/:id", asyncHandler(async (req, res) => {
  const resultado = await pool.query(
    `select ${COLUNAS_PUBLICAS} from doacoes where id = $1`,
    [req.params.id]
  );

  if (resultado.rowCount === 0) {
    return res.status(404).json({ erro: "Doação não encontrada." });
  }

  res.json(resultado.rows[0]);
}));

// POST /api/doacoes
doacoesRouter.post("/", asyncHandler(async (req, res) => {
  const { titulo, descricao, categoria, estado, cidade, contato } = req.body;

  if (!titulo || !categoria || !estado || !cidade || !contato) {
    return res.status(400).json({
      erro: "titulo, categoria, estado, cidade e contato são obrigatórios.",
    });
  }

  const codigoGerenciamento = gerarCodigoGerenciamento();

  const resultado = await pool.query(
    `insert into doacoes (titulo, descricao, categoria, estado, cidade, contato, codigo_gerenciamento)
     values ($1, $2, $3, $4, $5, $6, $7)
     returning ${COLUNAS_PUBLICAS}`,
    [titulo, descricao ?? null, categoria, estado, cidade, contato, codigoGerenciamento]
  );

  // o código só é devolvido aqui, na criação — depois disso o servidor
  // nunca mais expõe esse valor em nenhuma outra rota.
  res.status(201).json({
    ...resultado.rows[0],
    codigo_gerenciamento: codigoGerenciamento,
  });
}));

// PATCH /api/doacoes/:id  { status, codigo_gerenciamento }
doacoesRouter.patch("/:id", asyncHandler(async (req, res) => {
  const { status, codigo_gerenciamento } = req.body;

  if (!codigo_gerenciamento) {
    return res.status(400).json({ erro: "codigo_gerenciamento é obrigatório." });
  }

  if (!STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({ erro: "status inválido." });
  }

  const resultado = await pool.query(
    `update doacoes set status = $1
     where id = $2 and codigo_gerenciamento = $3
     returning ${COLUNAS_PUBLICAS}`,
    [status, req.params.id, codigo_gerenciamento]
  );

  if (resultado.rowCount === 0) {
    return res.status(403).json({ erro: "Doação não encontrada ou código incorreto." });
  }

  res.json(resultado.rows[0]);
}));

// DELETE /api/doacoes/:id  { codigo_gerenciamento }
doacoesRouter.delete("/:id", asyncHandler(async (req, res) => {
  const { codigo_gerenciamento } = req.body;

  if (!codigo_gerenciamento) {
    return res.status(400).json({ erro: "codigo_gerenciamento é obrigatório." });
  }

  const resultado = await pool.query(
    `delete from doacoes where id = $1 and codigo_gerenciamento = $2 returning id`,
    [req.params.id, codigo_gerenciamento]
  );

  if (resultado.rowCount === 0) {
    return res.status(403).json({ erro: "Doação não encontrada ou código incorreto." });
  }

  res.status(204).send();
}));
