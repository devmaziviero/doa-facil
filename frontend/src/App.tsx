import { Link, Route, Routes, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
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
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar
        position="sticky"
        color="inherit"
        sx={{
          bgcolor: "rgba(250,248,244,0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 2, maxWidth: 1200, width: "100%", mx: "auto" }}>
          <Stack
            component={Link}
            to="/"
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", flexGrow: 1, color: "primary.main", textDecoration: "none" }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2.5,
                bgcolor: "primary.main",
                color: "#fff",
                display: "grid",
                placeItems: "center",
              }}
            >
              <VolunteerActivismIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              Doa Fácil
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              component={Link}
              to="/gerenciar"
              color="inherit"
              variant={location.pathname === "/gerenciar" ? "outlined" : "text"}
              startIcon={<ManageAccountsIcon />}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Gerenciar
            </Button>
            <Button
              component={Link}
              to="/nova"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Anunciar
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="*"
            element={
              <Container maxWidth="lg" sx={{ py: 4 }}>
                <Routes>
                  <Route path="/nova" element={<NovaDoacao />} />
                  <Route path="/doacao/:id" element={<DoacaoDetalhe />} />
                  <Route path="/gerenciar" element={<GerenciarDoacao />} />
                </Routes>
              </Container>
            }
          />
        </Routes>
      </Box>

      <Box component="footer" sx={{ bgcolor: "primary.dark", color: "#fff", mt: 6 }}>
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{ justifyContent: "space-between" }}
          >
            <Box sx={{ maxWidth: 420 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                <VolunteerActivismIcon />
                <Typography variant="h6">Doa Fácil</Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Conectamos quem tem algo para doar com quem precisa, na sua região.
                Sem cadastro, sem taxa, direto entre as pessoas.
              </Typography>
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                Navegar
              </Typography>
              <Typography component={Link} to="/" sx={{ color: "inherit", textDecoration: "none" }}>
                Doações disponíveis
              </Typography>
              <Typography component={Link} to="/nova" sx={{ color: "inherit", textDecoration: "none" }}>
                Anunciar uma doação
              </Typography>
              <Typography component={Link} to="/gerenciar" sx={{ color: "inherit", textDecoration: "none" }}>
                Gerenciar minha doação
              </Typography>
            </Stack>
          </Stack>
          <Typography variant="caption" sx={{ display: "block", mt: 4, opacity: 0.6 }}>
            © {new Date().getFullYear()} Doa Fácil · Projeto acadêmico
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
