import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/page/1/from/0");
  }, []);
  return (
    <>
      <header className="header">
        <div className="header__top">
          <h1 className="header__title">
            Страница, которая отображает список товаров
          </h1>
        </div>
        <div className="header__bottom">
          <a
            href="https://github.com/velasso1"
            target="_blank"
            className="header__link"
          >
            GitHub
          </a>

          <a
            href="https://t.me/reynold495"
            target="_blank"
            className="header__link"
          >
            Telegram
          </a>

          <a href="mailto:alexandr.vasin1@yandex.ru" className="header__link">
            alexandr.vasin1@yandex.ru
          </a>

          <a
            href="https://hh.ru/resume/ed2524a4ff0b45f0b50039ed1f7a6348637044"
            target="_blank"
            className="header__link"
          >
            Resume
          </a>
        </div>
      </header>
    </>
  );
};

export default Header;
