import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  filterItems,
  setFiltering,
  checkQtyProducts,
  getIds,
} from "../../store/slices/data-slice";
import { useParams } from "react-router-dom";
import { Input } from "@mui/material";
import { Tabs, Tab, TabList, TabPanel, Button, Alert } from "@mui/joy";

const Filter = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [state, setState] = useState({
    price: "",
    product: "",
    brand: "",
  });

  const { status } = useSelector((state) => state.dataSlice);

  const { pageUrl, from } = useParams();

  const applyFilter = (e) => {
    setError(false);
    if (state[`${e.target.getAttribute("value")}`].length > 0) {
      dispatch(
        filterItems(
          e.target.getAttribute("value"),
          state[`${e.target.getAttribute("value")}`]
        )
      );
      return;
    }
    setError(true);
  };

  const resetFilter = () => {
    dispatch(setFiltering(false));
    dispatch(checkQtyProducts());
    dispatch(getIds(+from));
    setState({ price: "", product: "", brand: "" });
  };

  return (
    <div className="filter">
      <div className="filter__title">Фильтр товаров</div>
      <div className="filter__buttons">
        <Button
          disabled={status}
          color="danger"
          onClick={() => resetFilter()}
          className="filter__reset-button"
        >
          Сбросить фильтр
        </Button>
        <Tabs
          size="lg"
          sx={{
            "--Tabs-spacing": "48px",
          }}
        >
          <TabList>
            <Tab disabled={status} className="filter__tab-item">
              По цене
            </Tab>
            <Tab disabled={status}>По названию</Tab>
            <Tab disabled={status}>По бренду</Tab>
          </TabList>
          <TabPanel value={0} className="filter__panel">
            <Input
              disabled={status}
              className="filter__input"
              value={state.price}
              onChange={(e) => setState({ ...state, price: +e.target.value })}
              type="number"
              placeholder="Введите цену"
            />
            <Button
              disabled={status}
              color="success"
              value="price"
              className="filter__button"
              onClick={(e) => applyFilter(e)}
            >
              Фильтровать
            </Button>
          </TabPanel>

          <TabPanel value={1} className="filter__panel">
            <Input
              disabled={status}
              className="filter__input"
              value={state.product}
              onChange={(e) => setState({ ...state, product: e.target.value })}
              placeholder="Введите название товара"
            />
            <Button
              disabled={status}
              color="success"
              value="product"
              className="filter__button"
              onClick={(e) => applyFilter(e)}
            >
              Фильтровать
            </Button>
          </TabPanel>

          <TabPanel value={2} className="filter__panel">
            <Input
              disabled={status}
              className="filter__input"
              value={state.brand}
              onChange={(e) => setState({ ...state, brand: e.target.value })}
              placeholder="Введите название бренда"
            />
            <Button
              disabled={status}
              color="success"
              value="brand"
              className="filter__button"
              onClick={(e) => applyFilter(e)}
            >
              Фильтровать
            </Button>
          </TabPanel>
        </Tabs>
      </div>
      {error && <Alert color="danger">Поле пустое</Alert>}
    </div>
  );
};

export default Filter;
