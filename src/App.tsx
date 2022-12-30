import React from "react";
import { ThemeModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import RoutesList from "./components/RoutesList";
import "./App.css";
import TopBar from "./containers/TopBar/TopBar";

function App() {
  const [theme, themeMode] = useMode();

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <div className="App">
          <TopBar />
          <RoutesList />
        </div>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export default App;
