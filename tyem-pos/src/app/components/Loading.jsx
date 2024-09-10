import React from "react";
import { ThreeDots } from "react-loader-spinner";

const LoadingScreen = ({ message }) => {
  return (
    <div className="z-99999  bg-slate-300 h-full flex items-center justify-center">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="slate-900"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      >
        <div>
          <p>{message}</p>
        </div>
      </ThreeDots>
    </div>
  );
};

export default LoadingScreen;
