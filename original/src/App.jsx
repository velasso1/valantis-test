import React from "react";
import Header from "./components/ui/header";
import ProductList from "./components/ui/product-list";
import { Routes, Route } from "react-router-dom";

import "./scss/style.scss";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/page/:pageUrl/from/:from"
          element={<ProductList />}
        ></Route>
      </Routes>
    </>
  );
};

export default App;
