import { FormEvent, useState } from "react";
import { atualizarStatusDoacao, buscarDoacaoPorCodigo, excluirDoacao } from "../api";
import type { Doacao } from "../types";
import { COR_STATUS, ROTULO_STATUS } from "../constants";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DeleteOutlineIcon from "@mui/icons-material/Delete";

export default function GerenciarDoacao() {
  const [codigo, setCodigo] = useState("");
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  async function buscar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setMensagem(null);
    try {
      const encontrada = await buscarDoacaoPorCodigo(codigo.trim());
      setDoacao(encontrada);
    } catch (e: any) {
      setDoacao(null);
      setErro(e.message);
    }
  }

  async function mudarStatus(novoStatus: string) {
    if (!doacao) return;
    setErro(null);
    setMensagem(null);
    try {
      const atualizada = await atualizarStatusDoacao(doacao.id, novoStatus, codigo.trim());
      setDoacao(atualizada);
      setMensagem("Status atualizado.");
    } catch (e: any) {
      setErro(e.message);
    }
  }

  async function excluir() {
    if (!doacao) return;
    setErro(null);
    try {
      await excluirDoacao(doacao.id, codigo.trim());
      setDoacao(null);
      setMensagem("Anúncio excluído.");
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setConfirmarExclusao(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 480, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Gerenciar meu anúncio
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Cole o código de gerenciamento que você recebeu na hora da publicação.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack component="form" spacing={2} onSubmit={buscar}>
          <TextField
            label="Código de gerenciamento"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained">
            Buscar
          </Button>
        </Stack>

        {erro && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {erro}
          </Alert>
        )}
        {mensagem && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {mensagem}
          </Alert>
        )}

        {doacao && (
          <>
            <Divider sx={{ my: 3 }} />
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Typography variant="h6">{doacao.titulo}</Typography>
              <Chip
                size="small"
                label={ROTULO_STATUS[doacao.status]}
                color={COR_STATUS[doacao.status]}
                sx={{ alignSelf: "flex-start" }}
              />
            </Stack>

            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => mudarStatus("reservada")}
                disabled={doacao.status !== "disponivel"}
              >
                Marcar como reservada
              </Button>
              <Button
                variant="outlined"
                color="success"
                onClick={() => mudarStatus("retirada")}
                disabled={doacao.status === "retirada"}
              >
                Marcar como retirada
              </Button>
              <Button
                variant="text"
                onClick={() => mudarStatus("disponivel")}
                disabled={doacao.status === "disponivel"}
              >
                Voltar para disponível
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => setConfirmarExclusao(true)}
              >
                Excluir anúncio
              </Button>
            </Stack>
          </>
        )}
      </Paper>

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
