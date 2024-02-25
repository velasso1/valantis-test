import React from "react";
import { TailSpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <TailSpin
      className="loader"
      visible={true}
      height="120"
      width="120"
      color="#000"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperClass="loader"
    />
  );
};

export default Loader;
