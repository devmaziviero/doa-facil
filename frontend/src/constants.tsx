import CheckroomIcon from "@mui/icons-material/Checkroom";
import ChairIcon from "@mui/icons-material/Chair";
import ConstructionIcon from "@mui/icons-material/Construction";
import DevicesIcon from "@mui/icons-material/Devices";
import CategoryIcon from "@mui/icons-material/Category";
import type { ChipProps } from "@mui/material/Chip";
import type { StatusDoacao } from "./types";

export const CATEGORIAS = [
  { valor: "roupas", rotulo: "Roupas", Icone: CheckroomIcon },
  { valor: "moveis", rotulo: "Móveis", Icone: ChairIcon },
  { valor: "materiais", rotulo: "Materiais", Icone: ConstructionIcon },
  { valor: "eletronicos", rotulo: "Eletrônicos", Icone: DevicesIcon },
  { valor: "outros", rotulo: "Outros", Icone: CategoryIcon },
] as const;

export function iconePorCategoria(categoria: string) {
  return CATEGORIAS.find((c) => c.valor === categoria)?.Icone ?? CategoryIcon;
}

export function rotuloPorCategoria(categoria: string) {
  return CATEGORIAS.find((c) => c.valor === categoria)?.rotulo ?? categoria;
}

export const ROTULO_STATUS: Record<StatusDoacao, string> = {
  disponivel: "Disponível",
  reservada: "Reservada",
  retirada: "Retirada",
};

export const COR_STATUS: Record<StatusDoacao, ChipProps["color"]> = {
  disponivel: "success",
  reservada: "warning",
  retirada: "default",
};
