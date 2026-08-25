import { ChangeEvent, useRef } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

export interface ImagemNova {
  arquivo: File;
  preview: string;
}

interface Props {
  imagensExistentes: string[];
  imagensNovas: ImagemNova[];
  onAdicionar: (arquivos: File[]) => void;
  onRemoverExistente: (url: string) => void;
  onRemoverNova: (preview: string) => void;
  maximo?: number;
}

const TAMANHO = 96;

const estiloMiniatura = {
  position: "relative" as const,
  width: TAMANHO,
  height: TAMANHO,
  flexShrink: 0,
};

const estiloBotaoRemover = {
  position: "absolute" as const,
  top: -8,
  right: -8,
  bgcolor: "background.paper",
  boxShadow: 1,
  width: 24,
  height: 24,
  "&:hover": { bgcolor: "error.light" },
};

export default function SeletorImagens({
  imagensExistentes,
  imagensNovas,
  onAdicionar,
  onRemoverExistente,
  onRemoverNova,
  maximo = 5,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const total = imagensExistentes.length + imagensNovas.length;

  function aoMudarArquivos(e: ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(e.target.files ?? []).slice(0, Math.max(0, maximo - total));
    if (arquivos.length) onAdicionar(arquivos);
    e.target.value = "";
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
        Fotos (até {maximo}, opcional)
      </Typography>

      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={inputRef}
        onChange={aoMudarArquivos}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        {imagensExistentes.map((url) => (
          <Box key={url} sx={estiloMiniatura}>
            <Box
              component="img"
              src={url}
              alt="Foto da doação"
              sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 2 }}
            />
            <IconButton size="small" onClick={() => onRemoverExistente(url)} sx={estiloBotaoRemover}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
        ))}

        {imagensNovas.map((img) => (
          <Box key={img.preview} sx={estiloMiniatura}>
            <Box
              component="img"
              src={img.preview}
              alt="Prévia da nova foto"
              sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 2 }}
            />
            <IconButton
              size="small"
              onClick={() => onRemoverNova(img.preview)}
              sx={estiloBotaoRemover}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
        ))}

        {total < maximo && (
          <Box
            onClick={() => inputRef.current?.click()}
            sx={{
              ...estiloMiniatura,
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "text.secondary",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <AddPhotoAlternateIcon />
          </Box>
        )}
      </Box>
    </Box>
  );
}
