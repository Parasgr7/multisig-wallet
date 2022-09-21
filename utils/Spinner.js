import React, { Component } from "react";
import { usePromiseTracker } from "react-promise-tracker";
import ReactLoading from 'react-loading';

export const LoadingSpinerComponent = () => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    <div className="">
      {promiseInProgress === true ? (
        <div class="loading">
          <ReactLoading type={"spinningBubbles"} color={"#d11b85"} height={90} width={90}  />
        </div>
      ) : null}
    </div>
  );
};
