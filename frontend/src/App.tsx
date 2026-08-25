import { Link, Route, Routes, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AddIcon from "@mui/icons-material/Add";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Home from "./pages/Home";
import NovaDoacao from "./pages/NovaDoacao";
import DoacaoDetalhe from "./pages/DoacaoDetalhe";
import GerenciarDoacao from "./pages/GerenciarDoacao";

export default function App() {
  const location = useLocation();

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar sx={{ gap: 2 }}>
          <VolunteerActivismIcon />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, color: "inherit", textDecoration: "none", fontWeight: 700 }}
          >
            Doa Fácil
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              component={Link}
              to="/nova"
              color="inherit"
              variant={location.pathname === "/nova" ? "outlined" : "text"}
              startIcon={<AddIcon />}
              sx={{ borderColor: "rgba(255,255,255,0.6)" }}
            >
              Anunciar
            </Button>
            <Button
              component={Link}
              to="/gerenciar"
              color="inherit"
              variant={location.pathname === "/gerenciar" ? "outlined" : "text"}
              startIcon={<ManageAccountsIcon />}
              sx={{ borderColor: "rgba(255,255,255,0.6)" }}
            >
              Gerenciar
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, minHeight: "calc(100vh - 140px)" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nova" element={<NovaDoacao />} />
          <Route path="/doacao/:id" element={<DoacaoDetalhe />} />
          <Route path="/gerenciar" element={<GerenciarDoacao />} />
        </Routes>
      </Container>

      <Typography
        variant="body2"
        align="center"
        sx={{ py: 3, color: "text.secondary" }}
      >
        Projeto acadêmico — Doa Fácil
      </Typography>
    </>
  );
}
