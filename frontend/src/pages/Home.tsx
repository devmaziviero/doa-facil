import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarDoacoes } from "../api";
import type { Doacao } from "../types";
import DoacaoCard from "../components/DoacaoCard";
import SeletorEstadoCidade from "../components/SeletorEstadoCidade";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import { CATEGORIAS } from "../constants";

export default function Home() {
  const navigate = useNavigate();
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [categoria, setCategoria] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setCarregando(true);
    setErro(null);
    listarDoacoes({ estado, cidade, categoria })
      .then(setDoacoes)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [estado, cidade, categoria]);

  return (
    <Box sx={{ position: "relative", pb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Doações disponíveis na sua região
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Encontre doações de roupas, móveis, materiais e mais perto de você.
      </Typography>

      <Paper variant="outlined" sx={{ p: 2.5, mb: 3 }}>
        <Stack spacing={2}>
          <SeletorEstadoCidade
            estado={estado}
            cidade={cidade}
            onEstadoChange={setEstado}
            onCidadeChange={setCidade}
            rotuloEstado="Filtrar por estado"
            rotuloCidade="Filtrar por cidade"
          />
          <TextField
            select
            label="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            sx={{ maxWidth: 260 }}
          >
            <MenuItem value="">Todas as categorias</MenuItem>
            {CATEGORIAS.map((c) => (
              <MenuItem key={c.valor} value={c.valor}>
                {c.rotulo}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      {carregando && (
        <Stack sx={{ alignItems: "center", py: 4 }}>
          <CircularProgress />
        </Stack>
      )}

      {erro && <Alert severity="error">{erro}</Alert>}

      {!carregando && !erro && doacoes.length === 0 && (
        <Alert severity="info">Nenhuma doação encontrada com esses filtros.</Alert>
      )}

      <Grid container spacing={2}>
        {doacoes.map((d) => (
          <Grid key={d.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <DoacaoCard doacao={d} />
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        variant="extended"
        onClick={() => navigate("/nova")}
        sx={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Anunciar doação
      </Fab>
    </Box>
  );
}
