export type StatusDoacao = "disponivel" | "reservada" | "retirada";

export interface Doacao {
  id: string;
  titulo: string;
  descricao: string | null;
  categoria: string;
  estado: string;
  cidade: string;
  contato: string;
  status: StatusDoacao;
  criado_em: string;
}

export interface NovaDoacaoResposta extends Doacao {
  codigo_gerenciamento: string;
}
