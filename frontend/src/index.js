import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "remixicon/fonts/remixicon.css";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import "react-toastify/dist/ReactToastify.css";
import {NextUIProvider} from "@nextui-org/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <NextUIProvider>
        <main className="light">
          <App />
        </main>
      </NextUIProvider>
    </React.StrictMode>
  </Provider>
);
