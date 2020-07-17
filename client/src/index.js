import React from "react";
import ReactDOM from "react-dom";
import "./GlobalStyles.css";
import Main from "./Components/Main/Main";
import UserContextProvider from "./Contexts/UserContext";

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <Main />
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
