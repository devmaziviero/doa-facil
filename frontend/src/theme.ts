import { createTheme } from "@mui/material/styles";

// Identidade visual da v2: verde-folha como cor de marca, âmbar como
// destaque (calor / generosidade) e fundo off-white quente.
export const theme = createTheme({
  palette: {
    primary: {
      main: "#1B7F5C",
      dark: "#115740",
      light: "#5BBE96",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#F59E0B",
      dark: "#B45309",
      contrastText: "#1F2937",
    },
    success: { main: "#1B7F5C" },
    background: {
      default: "#FAF8F4",
      paper: "#ffffff",
    },
    text: {
      primary: "#1F2937",
      secondary: "#5B6472",
    },
    divider: "#E8E4DC",
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: ['"Plus Jakarta Sans"', "Roboto", "system-ui", "sans-serif"].join(","),
    h1: { fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontWeight: 800, letterSpacing: "-0.02em" },
    h4: { fontWeight: 800, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, textTransform: "none", fontWeight: 700 },
        sizeLarge: { padding: "12px 28px", fontSize: "1rem" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 20 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderColor: "#E8E4DC" },
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 14, backgroundColor: "#fff" },
      },
    },
  },
});
