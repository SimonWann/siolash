import React from "react";
import ReactDOM from "react-dom/client";
import {ConfigProvider} from 'antd'
import {themes} from './themes'
import "./style.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
    theme={themes}
    >
    <RouterProvider
    router={router}
    ></RouterProvider>
    </ConfigProvider>
  </React.StrictMode>
);
