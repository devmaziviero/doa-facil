import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { CidadeIBGE, EstadoIBGE, listarCidades, listarEstados } from "../ibge";

interface Props {
  estado: string;
  cidade: string;
  onEstadoChange: (uf: string) => void;
  onCidadeChange: (cidade: string) => void;
  obrigatorio?: boolean;
  rotuloEstado?: string;
  rotuloCidade?: string;
}

export default function SeletorEstadoCidade({
  estado,
  cidade,
  onEstadoChange,
  onCidadeChange,
  obrigatorio = false,
  rotuloEstado = "Estado",
  rotuloCidade = "Cidade",
}: Props) {
  const [estados, setEstados] = useState<EstadoIBGE[]>([]);
  const [cidades, setCidades] = useState<CidadeIBGE[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);

  useEffect(() => {
    listarEstados()
      .then(setEstados)
      .catch(() => setEstados([]));
  }, []);

  useEffect(() => {
    if (!estado) {
      setCidades([]);
      return;
    }
    setCarregandoCidades(true);
    listarCidades(estado)
      .then(setCidades)
      .catch(() => setCidades([]))
      .finally(() => setCarregandoCidades(false));
  }, [estado]);

  const estadoSelecionado = estados.find((e) => e.sigla === estado) ?? null;
  const cidadeSelecionada = cidade ? { nome: cidade } : null;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <Autocomplete
        sx={{ minWidth: 220, flex: 1 }}
        options={estados}
        getOptionLabel={(uf) => uf.nome}
        isOptionEqualToValue={(a, b) => a.sigla === b.sigla}
        value={estadoSelecionado}
        onChange={(_, novoValor) => {
          onEstadoChange(novoValor?.sigla ?? "");
          onCidadeChange("");
        }}
        renderInput={(params) => (
          <TextField {...params} label={rotuloEstado} required={obrigatorio} />
        )}
      />

      <Autocomplete
        sx={{ minWidth: 220, flex: 1 }}
        options={cidades}
        getOptionLabel={(c) => c.nome}
        isOptionEqualToValue={(a, b) => a.nome === b.nome}
        value={cidadeSelecionada as CidadeIBGE | null}
        onChange={(_, novoValor) => onCidadeChange(novoValor?.nome ?? "")}
        disabled={!estado}
        loading={carregandoCidades}
        renderInput={(params) => (
          <TextField
            {...params}
            label={rotuloCidade}
            required={obrigatorio}
            placeholder={!estado ? "Escolha o estado primeiro" : undefined}
          />
        )}
      />
    </Stack>
  );
}
