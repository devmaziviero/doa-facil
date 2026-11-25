import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obterDoacao } from "../api";
import type { Doacao } from "../types";
import { COR_STATUS, ROTULO_STATUS, iconePorCategoria, rotuloPorCategoria } from "../constants";
import { linkWhatsApp } from "../whatsapp";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import ShareIcon from "@mui/icons-material/Share";
import EventIcon from "@mui/icons-material/Event";

function dataPublicacao(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function DoacaoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [imagemSelecionada, setImagemSelecionada] = useState(0);
  const [aviso, setAviso] = useState(false);

  useEffect(() => {
    if (!id) return;
    obterDoacao(id)
      .then((encontrada) => {
        setDoacao(encontrada);
        setImagemSelecionada(0);
      })
      .catch((e) => setErro(e.message));
  }, [id]);

  async function compartilhar() {
    const url = window.location.href;
    if (navigator.share && doacao) {
      try {
        await navigator.share({ title: doacao.titulo, url });
        return;
      } catch {
        // usuário cancelou, cai no copiar
      }
    }
    await navigator.clipboard.writeText(url);
    setAviso(true);
  }

  if (erro) return <Alert severity="error">{erro}</Alert>;
  if (!doacao) {
    return (
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Skeleton variant="rounded" height={420} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Skeleton width="60%" height={44} />
          <Skeleton width="40%" />
          <Skeleton variant="rounded" height={160} sx={{ mt: 3 }} />
        </Grid>
      </Grid>
    );
  }

  const Icone = iconePorCategoria(doacao.categoria);
  const whatsapp = doacao.status === "disponivel" ? linkWhatsApp(doacao.contato) : null;
  const temFotos = doacao.imagens_urls.length > 0;

  return (
    <Box>
      <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Voltar para as doações
      </Button>

      <Grid container spacing={4}>
        {/* GALERIA */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            <Box sx={{ bgcolor: "#E7F3EE", height: { xs: 280, md: 440 } }}>
              {temFotos ? (
                <Box
                  component="img"
                  src={doacao.imagens_urls[imagemSelecionada]}
                  alt={doacao.titulo}
                  sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <Box sx={{ height: "100%", display: "grid", placeItems: "center", color: "primary.main" }}>
                  <Icone sx={{ fontSize: 96, opacity: 0.5 }} />
                </Box>
              )}
            </Box>
            {doacao.imagens_urls.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ p: 1.5, overflowX: "auto" }}>
                {doacao.imagens_urls.map((url, indice) => (
                  <Box
                    key={url}
                    component="img"
                    src={url}
                    alt={`Foto ${indice + 1}`}
                    onClick={() => setImagemSelecionada(indice)}
                    sx={{
                      width: 72,
                      height: 72,
                      flexShrink: 0,
                      objectFit: "cover",
                      borderRadius: 2,
                      cursor: "pointer",
                      border: "3px solid",
                      borderColor: indice === imagemSelecionada ? "primary.main" : "transparent",
                      opacity: indice === imagemSelecionada ? 1 : 0.7,
                    }}
                  />
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* INFORMAÇÕES */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Chip size="small" label={ROTULO_STATUS[doacao.status]} color={COR_STATUS[doacao.status]} />
              <Chip size="small" variant="outlined" icon={<Icone />} label={rotuloPorCategoria(doacao.categoria)} />
            </Stack>

            <Typography variant="h4">{doacao.titulo}</Typography>

            <Stack spacing={0.5} sx={{ color: "text.secondary" }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">
                  {doacao.cidade} - {doacao.estado}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <EventIcon fontSize="small" />
                <Typography variant="body2">Publicado em {dataPublicacao(doacao.criado_em)}</Typography>
              </Stack>
            </Stack>

            {doacao.descricao && (
              <Typography sx={{ whiteSpace: "pre-line" }}>{doacao.descricao}</Typography>
            )}

            {doacao.status === "disponivel" ? (
              <Paper
                variant="outlined"
                sx={{ p: 2.5, bgcolor: "#E7F3EE", borderColor: "primary.light" }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                  <ContactPhoneIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle2">Contato para combinar a retirada</Typography>
                </Stack>
                <Typography sx={{ fontWeight: 700, mb: whatsapp ? 2 : 0 }}>{doacao.contato}</Typography>
                {whatsapp && (
                  <Button
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<WhatsAppIcon />}
                  >
                    Conversar no WhatsApp
                  </Button>
                )}
              </Paper>
            ) : (
              <Alert severity="info">Esta doação não está mais disponível.</Alert>
            )}

            <Button variant="outlined" startIcon={<ShareIcon />} onClick={compartilhar}>
              Compartilhar
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={aviso}
        autoHideDuration={2500}
        onClose={() => setAviso(false)}
        message="Link copiado!"
      />
    </Box>
  );
}
