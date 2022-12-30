import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Container from "../containers/Container/Container";

const RoutesList = (): JSX.Element => {
  return (
    <main className="content">
      <Routes>
        <Route
          path="/"
          element={<Navigate replace to="/currency/btc" />}
        ></Route>
        <Route path="/currency/btc" element={<Container />}></Route>
        <Route path="/currency/eth" element={<Container />}></Route>
        <Route path="/currency/sol" element={<Container />}></Route>
        <Route path="/currency/udc" element={<Container />}></Route>
      </Routes>
    </main>
  );
};

export default RoutesList;
