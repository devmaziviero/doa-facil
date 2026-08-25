import { createTheme } from "@mui/material/styles";

// Paleta inspirada no WhatsApp (verde como cor de marca, cantos
// arredondados, cards limpos) — referência de "sistema moderno" pedida
// pelo grupo, sem copiar a interface, só a linguagem visual.
export const theme = createTheme({
  palette: {
    primary: {
      main: "#128C7E",
      dark: "#075E54",
      light: "#25D366",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#25D366",
    },
    background: {
      default: "#F5F3EF",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: [
      "Segoe UI",
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, textTransform: "none", fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: "none" },
      },
    },
  },
});
