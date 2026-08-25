import { FormEvent, useState } from "react";
import { buscarDoacaoPorCodigo, editarDoacao, excluirDoacao } from "../api";
import type { Doacao, StatusDoacao } from "../types";
import SeletorImagem from "../components/SeletorImagem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import DeleteOutlineIcon from "@mui/icons-material/Delete";

const OPCOES_STATUS: { valor: StatusDoacao; rotulo: string; Icone: typeof CheckCircleIcon }[] = [
  { valor: "disponivel", rotulo: "Disponível", Icone: CheckCircleIcon },
  { valor: "reservada", rotulo: "Reservada", Icone: BookmarkIcon },
  { valor: "retirada", rotulo: "Retirada", Icone: Inventory2Icon },
];

export default function GerenciarDoacao() {
  const [codigoBusca, setCodigoBusca] = useState("");
  const [codigo, setCodigo] = useState<string | null>(null);
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [erroBusca, setErroBusca] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState<StatusDoacao>("disponivel");
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  async function buscar(e: FormEvent) {
    e.preventDefault();
    setErroBusca(null);
    try {
      const encontrada = await buscarDoacaoPorCodigo(codigoBusca.trim());
      setDoacao(encontrada);
      setCodigo(codigoBusca.trim());
      setTitulo(encontrada.titulo);
      setDescricao(encontrada.descricao ?? "");
      setStatus(encontrada.status);
      setImagem(null);
      setImagemPreview(encontrada.imagem_url);
    } catch (e: any) {
      setDoacao(null);
      setCodigo(null);
      setErroBusca(e.message);
    }
  }

  function aoSelecionarImagem(arquivo: File) {
    setImagem(arquivo);
    setImagemPreview(URL.createObjectURL(arquivo));
  }

  async function salvar() {
    if (!doacao || !codigo) return;
    setErro(null);
    setMensagem(null);
    setSalvando(true);
    try {
      const atualizada = await editarDoacao(doacao.id, codigo, {
        titulo,
        descricao,
        status,
        imagem,
      });
      setDoacao(atualizada);
      setImagem(null);
      setImagemPreview(atualizada.imagem_url);
      setMensagem("Alterações salvas.");
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir() {
    if (!doacao || !codigo) return;
    setErro(null);
    try {
      await excluirDoacao(doacao.id, codigo);
      setDoacao(null);
      setCodigo(null);
      setMensagem("Anúncio excluído.");
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setConfirmarExclusao(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 520, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Gerenciar meu anúncio
      </Typography>

      {!doacao && (
        <>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Cole o código de gerenciamento que você recebeu na hora da publicação.
          </Typography>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack component="form" spacing={2} onSubmit={buscar}>
              <TextField
                label="Código de gerenciamento"
                value={codigoBusca}
                onChange={(e) => setCodigoBusca(e.target.value)}
                required
                fullWidth
              />
              <Button type="submit" variant="contained">
                Buscar
              </Button>
            </Stack>

            {erroBusca && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {erroBusca}
              </Alert>
            )}
            {mensagem && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {mensagem}
              </Alert>
            )}
          </Paper>
        </>
      )}

      {doacao && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <SeletorImagem preview={imagemPreview} onSelecionar={aoSelecionarImagem} />

            <TextField
              label="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              fullWidth
            />

            <TextField
              label="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              multiline
              minRows={3}
              fullWidth
            />

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Status
              </Typography>
              <ToggleButtonGroup
                value={status}
                exclusive
                fullWidth
                color="primary"
                onChange={(_, novoStatus) => novoStatus && setStatus(novoStatus)}
              >
                {OPCOES_STATUS.map(({ valor, rotulo, Icone }) => (
                  <ToggleButton key={valor} value={valor} sx={{ textTransform: "none", gap: 0.75 }}>
                    <Icone fontSize="small" />
                    {rotulo}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            {erro && <Alert severity="error">{erro}</Alert>}
            {mensagem && <Alert severity="success">{mensagem}</Alert>}

            <Button
              variant="contained"
              size="large"
              onClick={salvar}
              disabled={salvando}
              startIcon={salvando ? <CircularProgress size={18} color="inherit" /> : undefined}
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="text"
            color="error"
            size="small"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => setConfirmarExclusao(true)}
          >
            Excluir anúncio
          </Button>
        </Paper>
      )}

      <Dialog open={confirmarExclusao} onClose={() => setConfirmarExclusao(false)}>
        <DialogTitle>Excluir anúncio?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Essa ação não pode ser desfeita. O anúncio "{doacao?.titulo}" será removido
            permanentemente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmarExclusao(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={excluir}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
