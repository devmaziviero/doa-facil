import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { Doacao } from "../types";
import { COR_STATUS, ROTULO_STATUS, iconePorCategoria, rotuloPorCategoria } from "../constants";

export default function DoacaoCard({ doacao }: { doacao: Doacao }) {
  const Icone = iconePorCategoria(doacao.categoria);
  const capa = doacao.imagens_urls[0];

  return (
    <Card variant="outlined">
      <CardActionArea component={Link} to={`/doacao/${doacao.id}`}>
        {capa && <CardMedia component="img" height="140" image={capa} alt={doacao.titulo} />}
        <CardContent>
          <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
            {!capa && (
              <Avatar sx={{ bgcolor: "primary.light" }}>
                <Icone fontSize="small" />
              </Avatar>
            )}

            <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
                  {doacao.titulo}
                </Typography>
              </Stack>

              <Chip
                size="small"
                label={ROTULO_STATUS[doacao.status]}
                color={COR_STATUS[doacao.status]}
                sx={{ alignSelf: "flex-start" }}
              />

              <Typography variant="body2" color="text.secondary">
                {rotuloPorCategoria(doacao.categoria)}
              </Typography>

              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: "center", color: "text.secondary" }}
              >
                <LocationOnIcon fontSize="inherit" />
                <Typography variant="body2">
                  {doacao.cidade} - {doacao.estado}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
