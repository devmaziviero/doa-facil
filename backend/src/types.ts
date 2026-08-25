export type StatusDoacao = "disponivel" | "reservada" | "retirada";

export const STATUS_VALIDOS: StatusDoacao[] = [
  "disponivel",
  "reservada",
  "retirada",
];

export interface Doacao {
  id: string;
  titulo: string;
  descricao: string | null;
  categoria: string;
  estado: string;
  cidade: string;
  contato: string;
  imagens_urls: string[];
  status: StatusDoacao;
  criado_em: string;
}

// Doacao como ela sai do banco, incluindo a coluna que nunca deve
// ser exposta em listagens/detalhe público.
export interface DoacaoComCodigo extends Doacao {
  codigo_gerenciamento: string;
}
