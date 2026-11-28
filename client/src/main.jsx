import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainRoutes from "./routes/MainRoutes.jsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme.js";
import CssBaseline from "@mui/material/CssBaseline";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainRoutes />
    </ThemeProvider>
  </StrictMode>,
);
