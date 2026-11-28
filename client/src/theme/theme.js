import { createTheme } from "@mui/material/styles";

export default createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3B82F6", contrastText: "#101114" },
    background: { default: "#101114", paper: "#1C1D22" },
    text: { primary: "#FFFFFF", secondary: "#A1A1AA" },
    divider: "#303136",
    error: { main: "#F87171" },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: '"Inter", system-ui, sans-serif' },
});
