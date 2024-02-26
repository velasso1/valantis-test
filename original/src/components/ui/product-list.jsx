import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getIds,
  getItems,
  getError,
  checkQtyProducts,
} from "../../store/slices/data-slice";
import { useParams } from "react-router-dom";
import Product from "./product";
import PaginationComponent from "./pagination";
import Filter from "./filter";
import Loader from "./loader";
import { Alert } from "@mui/material";

const ProductList = () => {
  const dispatch = useDispatch();
  const { pageUrl, from } = useParams();

  const {
    items,
    status,
    error,
    currentIds,
    isFiltering,
    filterError,
    emptyResult,
  } = useSelector((state) => state.dataSlice);

  useEffect(() => {
    // repeat query if has error
    if (error) {
      dispatch(getItems(currentIds));
      dispatch(getError(false));
    }
  }, [error]);

  useEffect(() => {
    // send query for get items when component mount and update
    if (!isFiltering) {
      dispatch(checkQtyProducts());
      dispatch(getIds(+from));
    }
  }, [pageUrl, from, isFiltering]);

  return (
    <>
      <section className="catalog">
        {filterError && (
          <Alert severity="error">Произошла ошибка, повторите фильтрацию</Alert>
        )}
        <Filter />
        <PaginationComponent />
        {status && <Loader />}
        {!status && items.length ? (
          <div className="product-list">
            {items.map((item, index) => {
              return (
                <Product
                  key={index}
                  id={item.id}
                  name={item.product}
                  price={item.price}
                  brand={item.brand}
                />
              );
            })}
          </div>
        ) : (
          <div>Товаров не найдено</div>
        )}
      </section>
    </>
  );
};

export default ProductList;
