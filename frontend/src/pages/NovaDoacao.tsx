import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { criarDoacao } from "../api";
import type { NovaDoacaoResposta } from "../types";
import SeletorEstadoCidade from "../components/SeletorEstadoCidade";
import SeletorImagem from "../components/SeletorImagem";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";
import { CATEGORIAS } from "../constants";

export default function NovaDoacao() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("roupas");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [contato, setContato] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<NovaDoacaoResposta | null>(null);
  const [copiado, setCopiado] = useState(false);

  function aoSelecionarImagem(arquivo: File) {
    setImagem(arquivo);
    setImagemPreview(URL.createObjectURL(arquivo));
  }

  async function aoEnviar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      const doacao = await criarDoacao({
        titulo,
        descricao: descricao || undefined,
        categoria,
        estado,
        cidade,
        contato,
        imagem,
      });
      setResultado(doacao);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  async function copiarCodigo() {
    if (!resultado) return;
    await navigator.clipboard.writeText(resultado.codigo_gerenciamento);
    setCopiado(true);
  }

  if (resultado) {
    return (
      <Paper variant="outlined" sx={{ p: 4, maxWidth: 480, mx: "auto", textAlign: "center" }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h5" gutterBottom>
          Doação publicada!
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Guarde este código — é ele que permite marcar a doação como reservada, retirada ou
          excluir o anúncio depois. Ele não aparece em nenhum outro lugar.
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "warning.light",
            borderRadius: 2,
            py: 1.5,
            px: 2,
            mb: 1,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 2 }}>
            {resultado.codigo_gerenciamento}
          </Typography>
          <Tooltip title={copiado ? "Copiado!" : "Copiar código"}>
            <IconButton onClick={copiarCodigo} size="small">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
          Voltar para as doações
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: 560, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Anunciar uma doação
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
        <Stack component="form" spacing={2.5} onSubmit={aoEnviar}>
          <SeletorImagem preview={imagemPreview} onSelecionar={aoSelecionarImagem} />

          <TextField
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Descrição (opcional)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />

          <TextField
            select
            label="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            fullWidth
          >
            {CATEGORIAS.map((c) => (
              <MenuItem key={c.valor} value={c.valor}>
                {c.rotulo}
              </MenuItem>
            ))}
          </TextField>

          <SeletorEstadoCidade
            estado={estado}
            cidade={cidade}
            onEstadoChange={setEstado}
            onCidadeChange={setCidade}
            obrigatorio
          />

          <TextField
            label="Contato para combinar retirada (telefone, WhatsApp ou e-mail)"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
            required
            fullWidth
          />

          {erro && <Alert severity="error">{erro}</Alert>}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={enviando}
            startIcon={enviando ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {enviando ? "Publicando..." : "Publicar doação"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
