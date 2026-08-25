// Lista pública de estados/municípios do IBGE (dados abertos do governo,
// sem chave, sem custo) — usada só para preencher os selects de
// estado/cidade, não é uma API de busca de endereço.
const IBGE_BASE = "https://servicodados.ibge.gov.br/api/v1/localidades";

export interface EstadoIBGE {
  id: number;
  sigla: string;
  nome: string;
}

export interface CidadeIBGE {
  id: number;
  nome: string;
}

export function listarEstados(): Promise<EstadoIBGE[]> {
  return fetch(`${IBGE_BASE}/estados?orderBy=nome`).then((r) => r.json());
}

export function listarCidades(uf: string): Promise<CidadeIBGE[]> {
  return fetch(`${IBGE_BASE}/estados/${uf}/municipios`).then((r) => r.json());
}
