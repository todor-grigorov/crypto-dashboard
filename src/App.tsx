import React from "react";
import { ThemeModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import RoutesList from "./components/RoutesList";
import "./App.css";

function App() {
  const [theme, themeMode] = useMode();

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <RoutesList />
        </div>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export default App;
