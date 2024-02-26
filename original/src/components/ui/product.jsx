import React from "react";

const Product = ({ id, name, price, brand }) => {
  return (
    <div className="product-item">
      <div className="product-item__id">
        <p>{id}</p>
      </div>
      <div className="product-item__image">
        <picture>
          <img
            src="https://velasso1.github.io/valantis-test/images/picture.webp"
            alt="gold circle"
          />
        </picture>
      </div>
      <div className="product-item__info">
        <div className="product-item__brand">
          <p>{brand === null ? "Неизвестно" : brand}</p>
        </div>
        <div className="product-item__name">{name}</div>
        <div className="product-item__price">{price} ₽</div>
      </div>
    </div>
  );
};

export default Product;
