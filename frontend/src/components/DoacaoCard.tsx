import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { Doacao } from "../types";
import { COR_STATUS, ROTULO_STATUS, iconePorCategoria, rotuloPorCategoria } from "../constants";

function tempoRelativo(iso: string) {
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (dias <= 0) return "hoje";
  if (dias === 1) return "ontem";
  if (dias < 30) return `há ${dias} dias`;
  const meses = Math.floor(dias / 30);
  return meses === 1 ? "há 1 mês" : `há ${meses} meses`;
}

export function DoacaoCardSkeleton() {
  return (
    <Card variant="outlined">
      <Skeleton variant="rectangular" height={180} />
      <CardContent>
        <Skeleton width="70%" height={28} />
        <Skeleton width="40%" />
        <Skeleton width="55%" />
      </CardContent>
    </Card>
  );
}

export default function DoacaoCard({ doacao }: { doacao: Doacao }) {
  const Icone = iconePorCategoria(doacao.categoria);
  const capa = doacao.imagens_urls[0];

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        transition: "transform .2s, box-shadow .2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 28px rgba(17,87,64,.12)" },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/doacao/${doacao.id}`}
        sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <Box sx={{ position: "relative", height: 180, bgcolor: "#E7F3EE" }}>
          {capa ? (
            <Box
              component="img"
              src={capa}
              alt={doacao.titulo}
              loading="lazy"
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <Box sx={{ height: "100%", display: "grid", placeItems: "center", color: "primary.main" }}>
              <Icone sx={{ fontSize: 56, opacity: 0.55 }} />
            </Box>
          )}
          <Chip
            size="small"
            label={ROTULO_STATUS[doacao.status]}
            color={COR_STATUS[doacao.status]}
            sx={{ position: "absolute", top: 12, left: 12 }}
          />
        </Box>

        <CardContent sx={{ flex: 1 }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
            {rotuloPorCategoria(doacao.categoria)}
          </Typography>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, mb: 0.5 }}>
            {doacao.titulo}
          </Typography>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: "center", color: "text.secondary", justifyContent: "space-between" }}
          >
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", minWidth: 0 }}>
              <LocationOnIcon fontSize="inherit" />
              <Typography variant="body2" noWrap>
                {doacao.cidade} - {doacao.estado}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ flexShrink: 0 }}>
              {tempoRelativo(doacao.criado_em)}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
