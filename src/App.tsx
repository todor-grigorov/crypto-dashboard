import React, { useEffect } from "react";
import RoutesList from "./components/RoutesList";
import logo from "./logo.svg";
import "./App.css";
import Header from "./containers/Header/Header";
import { SocketProvider } from "./contexts/SocketContext";
import Ticker from "./components/Ticker/Ticker";
import Main from "./containers/Main/Main";

function App() {
  return (
    // <SocketProvider>
    <div className="App">
      <RoutesList />
      {/* <Header /> */}
      {/* <Ticker /> */}
      {/* <Main /> */}
    </div>
    // </SocketProvider>
  );
}

export default App;
