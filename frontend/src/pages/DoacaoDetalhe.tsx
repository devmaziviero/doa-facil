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
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

export default function DoacaoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    obterDoacao(id).then(setDoacao).catch((e) => setErro(e.message));
  }, [id]);

  if (erro) return <Alert severity="error">{erro}</Alert>;
  if (!doacao) {
    return (
      <Stack sx={{ alignItems: "center", py: 4 }}>
        <CircularProgress />
      </Stack>
    );
  }

  const Icone = iconePorCategoria(doacao.categoria);
  const whatsapp = doacao.status === "disponivel" ? linkWhatsApp(doacao.contato) : null;

  return (
    <Box sx={{ maxWidth: 560, mx: "auto" }}>
      <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Voltar
      </Button>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
          <Avatar sx={{ bgcolor: "primary.light", width: 56, height: 56 }}>
            <Icone />
          </Avatar>
          <Box>
            <Typography variant="h5">{doacao.titulo}</Typography>
            <Chip
              size="small"
              label={ROTULO_STATUS[doacao.status]}
              color={COR_STATUS[doacao.status]}
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Stack>

        <Typography color="text.secondary" gutterBottom>
          {rotuloPorCategoria(doacao.categoria)}
        </Typography>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ alignItems: "center", color: "text.secondary", mb: 2 }}
        >
          <LocationOnIcon fontSize="small" />
          <Typography variant="body2">
            {doacao.cidade} - {doacao.estado}
          </Typography>
        </Stack>

        {doacao.descricao && (
          <Typography sx={{ mb: 2 }}>{doacao.descricao}</Typography>
        )}

        {doacao.status === "disponivel" ? (
          <Paper variant="outlined" sx={{ p: 2, bgcolor: "success.light" }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
              <ContactPhoneIcon fontSize="small" />
              <Typography variant="subtitle2">Contato para combinar a retirada</Typography>
            </Stack>
            <Typography sx={{ mb: whatsapp ? 1.5 : 0 }}>{doacao.contato}</Typography>
            {whatsapp && (
              <Button
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
              >
                Conversar no WhatsApp
              </Button>
            )}
          </Paper>
        ) : (
          <Alert severity="info">Esta doação não está mais disponível.</Alert>
        )}
      </Paper>
    </Box>
  );
}
