import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { listarDoacoes } from "../api";
import type { Doacao } from "../types";
import DoacaoCard, { DoacaoCardSkeleton } from "../components/DoacaoCard";
import SeletorEstadoCidade from "../components/SeletorEstadoCidade";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import InboxIcon from "@mui/icons-material/Inbox";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ForumIcon from "@mui/icons-material/Forum";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { CATEGORIAS } from "../constants";

const PASSOS = [
  {
    Icone: PostAddIcon,
    titulo: "Anuncie em 1 minuto",
    texto: "Publique fotos, descrição e onde fica. Sem cadastro e sem senha.",
  },
  {
    Icone: ForumIcon,
    titulo: "Combine pelo WhatsApp",
    texto: "Quem tem interesse chama você direto para combinar a retirada.",
  },
  {
    Icone: HandshakeIcon,
    titulo: "Gerencie com seu código",
    texto: "Use o código que você recebe para editar ou marcar como retirada.",
  },
];

export default function Home() {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [categoria, setCategoria] = useState("");
  const [busca, setBusca] = useState("");
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

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return doacoes;
    return doacoes.filter((d) =>
      `${d.titulo} ${d.descricao ?? ""}`.toLowerCase().includes(termo)
    );
  }, [doacoes, busca]);

  const cidades = useMemo(() => new Set(doacoes.map((d) => `${d.cidade}-${d.estado}`)).size, [doacoes]);

  return (
    <>
      {/* HERO */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #115740 0%, #1B7F5C 60%, #2A9D74 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: -80,
            top: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            bgcolor: "rgba(245,158,11,.25)",
          }}
        />
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 }, position: "relative" }}>
          <Chip
            label="Sem cadastro · Sem taxa"
            sx={{ bgcolor: "rgba(255,255,255,.16)", color: "#fff", mb: 2 }}
          />
          <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3.4rem" }, maxWidth: 720 }}>
            Doe o que não usa mais. Encontre o que você precisa.
          </Typography>
          <Typography sx={{ mt: 2, maxWidth: 560, fontSize: "1.1rem", opacity: 0.9 }}>
            Roupas, móveis, materiais e mais, de pessoas da sua região. Combine a retirada
            direto pelo WhatsApp.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
            <Button
              component={RouterLink}
              to="/nova"
              size="large"
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
            >
              Quero doar
            </Button>
            <Button
              href="#doacoes"
              size="large"
              variant="outlined"
              sx={{ color: "#fff", borderColor: "rgba(255,255,255,.6)" }}
            >
              Ver doações
            </Button>
          </Stack>

          <Stack direction="row" spacing={4} sx={{ mt: 5 }}>
            <Box>
              <Typography variant="h4">{carregando ? "–" : doacoes.length}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                doações disponíveis
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4">{carregando ? "–" : cidades}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                cidades
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* BUSCA E FILTROS */}
        <Box id="doacoes" sx={{ scrollMarginTop: 90 }}>
          <Typography variant="h4" gutterBottom>
            Doações perto de você
          </Typography>

          <Paper variant="outlined" sx={{ p: 2.5, mb: 3 }}>
            <Stack spacing={2}>
              <TextField
                placeholder="Buscar por título ou descrição (ex: sofá, bicicleta)"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <SeletorEstadoCidade
                estado={estado}
                cidade={cidade}
                onEstadoChange={setEstado}
                onCidadeChange={setCidade}
                rotuloEstado="Estado"
                rotuloCidade="Cidade"
              />
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                <Chip
                  label="Todas"
                  clickable
                  color={categoria === "" ? "primary" : "default"}
                  variant={categoria === "" ? "filled" : "outlined"}
                  onClick={() => setCategoria("")}
                />
                {CATEGORIAS.map(({ valor, rotulo, Icone }) => (
                  <Chip
                    key={valor}
                    icon={<Icone />}
                    label={rotulo}
                    clickable
                    color={categoria === valor ? "primary" : "default"}
                    variant={categoria === valor ? "filled" : "outlined"}
                    onClick={() => setCategoria(categoria === valor ? "" : valor)}
                  />
                ))}
              </Stack>
            </Stack>
          </Paper>

          {erro && <Alert severity="error">{erro}</Alert>}

          {!carregando && !erro && visiveis.length === 0 && (
            <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
              <InboxIcon sx={{ fontSize: 56, color: "text.disabled" }} />
              <Typography variant="h6">Nenhuma doação encontrada</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Tente outros filtros ou seja o primeiro a anunciar na sua região.
              </Typography>
              <Button component={RouterLink} to="/nova" variant="contained" startIcon={<AddIcon />}>
                Anunciar doação
              </Button>
            </Paper>
          )}

          <Grid container spacing={3}>
            {carregando
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                    <DoacaoCardSkeleton />
                  </Grid>
                ))
              : visiveis.map((d) => (
                  <Grid key={d.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <DoacaoCard doacao={d} />
                  </Grid>
                ))}
          </Grid>
        </Box>

        {/* COMO FUNCIONA */}
        <Box sx={{ mt: 10 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Como funciona
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {PASSOS.map(({ Icone, titulo, texto }, i) => (
              <Grid key={titulo} size={{ xs: 12, md: 4 }}>
                <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      bgcolor: "#E7F3EE",
                      color: "primary.main",
                      display: "grid",
                      placeItems: "center",
                      mb: 2,
                    }}
                  >
                    <Icone />
                  </Box>
                  <Typography variant="h6">
                    {i + 1}. {titulo}
                  </Typography>
                  <Typography color="text.secondary">{texto}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}
