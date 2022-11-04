import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D81B60",
      light: "#c51162",
      dark: "#880e4f",
    },
    secondary: {
      main: "#E64848",
    },
    action: {
      hover: "#c51162",
    },
  },
  shape: {
    borderRadius: 25,
  },
});

export default theme;
