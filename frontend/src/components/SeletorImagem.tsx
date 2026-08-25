import { ChangeEvent, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface Props {
  preview: string | null;
  onSelecionar: (arquivo: File) => void;
  altura?: number;
}

export default function SeletorImagem({ preview, onSelecionar, altura = 200 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function aoMudarArquivo(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (arquivo) onSelecionar(arquivo);
    e.target.value = "";
  }

  return (
    <Box>
      <input type="file" accept="image/*" hidden ref={inputRef} onChange={aoMudarArquivo} />
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 2,
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          "&:hover": { borderColor: "primary.main" },
        }}
      >
        {preview ? (
          <Box
            component="img"
            src={preview}
            alt="Prévia da doação"
            sx={{ width: "100%", height: altura, objectFit: "cover", display: "block" }}
          />
        ) : (
          <Stack spacing={1} sx={{ alignItems: "center", color: "text.secondary", py: 4 }}>
            <AddPhotoAlternateIcon fontSize="large" />
            <Typography variant="body2">Adicionar foto (opcional)</Typography>
          </Stack>
        )}

        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            bgcolor: "background.paper",
            borderRadius: 999,
            px: 1.5,
            py: 0.5,
            boxShadow: 1,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {preview ? "Trocar foto" : "Adicionar foto"}
        </Box>
      </Box>
    </Box>
  );
}
