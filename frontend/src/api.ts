import type { Doacao, NovaDoacaoResposta } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

async function tratarResposta<T>(resp: Response): Promise<T> {
  if (!resp.ok) {
    const corpo = await resp.json().catch(() => ({}));
    throw new Error(corpo.erro ?? `Erro na requisição (${resp.status})`);
  }
  if (resp.status === 204) return undefined as T;
  return resp.json();
}

export interface FiltrosDoacoes {
  estado?: string;
  cidade?: string;
  categoria?: string;
}

export function listarDoacoes(filtros: FiltrosDoacoes = {}): Promise<Doacao[]> {
  const params = new URLSearchParams();
  if (filtros.estado) params.set("estado", filtros.estado);
  if (filtros.cidade) params.set("cidade", filtros.cidade);
  if (filtros.categoria) params.set("categoria", filtros.categoria);

  return fetch(`${BASE_URL}/doacoes?${params.toString()}`).then((r) =>
    tratarResposta<Doacao[]>(r)
  );
}

export function obterDoacao(id: string): Promise<Doacao> {
  return fetch(`${BASE_URL}/doacoes/${id}`).then((r) => tratarResposta<Doacao>(r));
}

export function buscarDoacaoPorCodigo(codigo: string): Promise<Doacao> {
  return fetch(`${BASE_URL}/doacoes/codigo/${encodeURIComponent(codigo)}`).then((r) =>
    tratarResposta<Doacao>(r)
  );
}

export interface DadosNovaDoacao {
  titulo: string;
  descricao?: string;
  categoria: string;
  estado: string;
  cidade: string;
  contato: string;
  imagem?: File | null;
}

export function criarDoacao(dados: DadosNovaDoacao): Promise<NovaDoacaoResposta> {
  const form = new FormData();
  form.append("titulo", dados.titulo);
  if (dados.descricao) form.append("descricao", dados.descricao);
  form.append("categoria", dados.categoria);
  form.append("estado", dados.estado);
  form.append("cidade", dados.cidade);
  form.append("contato", dados.contato);
  if (dados.imagem) form.append("imagem", dados.imagem);

  return fetch(`${BASE_URL}/doacoes`, { method: "POST", body: form }).then((r) =>
    tratarResposta<NovaDoacaoResposta>(r)
  );
}

export interface DadosEdicaoDoacao {
  titulo?: string;
  descricao?: string;
  status?: string;
  imagem?: File | null;
}

export function editarDoacao(
  id: string,
  codigoGerenciamento: string,
  dados: DadosEdicaoDoacao
): Promise<Doacao> {
  const form = new FormData();
  form.append("codigo_gerenciamento", codigoGerenciamento);
  if (dados.titulo !== undefined) form.append("titulo", dados.titulo);
  if (dados.descricao !== undefined) form.append("descricao", dados.descricao);
  if (dados.status !== undefined) form.append("status", dados.status);
  if (dados.imagem) form.append("imagem", dados.imagem);

  return fetch(`${BASE_URL}/doacoes/${id}`, { method: "PATCH", body: form }).then((r) =>
    tratarResposta<Doacao>(r)
  );
}

export function excluirDoacao(id: string, codigoGerenciamento: string): Promise<void> {
  return fetch(`${BASE_URL}/doacoes/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo_gerenciamento: codigoGerenciamento }),
  }).then((r) => tratarResposta<void>(r));
}
