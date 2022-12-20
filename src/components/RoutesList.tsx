import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Container from "../containers/Container/Container";
import Header from "../containers/Header/Header";
import Ticker from "./Ticker/Ticker";

const RoutesList = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/btc" />}></Route>
      <Route path="/btc" element={<Container />}></Route>
      <Route path="/eth" element={<Container />}></Route>
      <Route path="/sol" element={<Container />}></Route>
      <Route path="/udc" element={<Container />}></Route>
    </Routes>
  );
};

export default RoutesList;
