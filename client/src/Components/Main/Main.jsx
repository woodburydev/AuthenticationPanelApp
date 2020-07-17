import React from "react";
import Home from "../Home/Home";
import Register from "../Register/Register";
import Login from "../Login/Login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../Contexts/UserContext";
import NavBar from "../NavBar/NavBar";
import SuperAdminPanel from "../SuperAdminPanel/SuperAdminPanel";

export default function Main() {
  const data = useContext(UserContext);
  console.log(data);

  return (
    <div>
      <Router>
        <NavBar></NavBar>
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/register" component={Register}></Route>
          <Route path="/login" component={Login}></Route>
        </Switch>

        {data ? (
          data.admin ? (
            <Route path="/superadmin" component={SuperAdminPanel}></Route>
          ) : null
        ) : null}
      </Router>
    </div>
  );
}
