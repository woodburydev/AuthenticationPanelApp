import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { UserContext } from "../../Contexts/UserContext";
import Axios from "axios";

export default function NavBar() {
  const data = useContext(UserContext);
  const logout = () => {
    Axios.get("http://localhost:4000/logout", {
      withCredentials: true,
    }).then((res) => {
      console.log(res.data);
      if (res.data == "success") {
        return (window.location.href = "/");
      }
    });
  };
  return (
    <nav className={styles.NavBar}>
      <ul>
        {data ? (
          <li>
            <a onClick={logout}>Logout</a>
          </li>
        ) : null}

        <li>
          <Link to="/">Home</Link>
        </li>

        {data ? null : (
          <li>
            <Link to="/Register">Register</Link>
          </li>
        )}

        {data ? null : (
          <li>
            <Link to="/Login">Login</Link>
          </li>
        )}

        {data ? (
          data.admin ? (
            <li>
              <Link to="/superadmin">Admin Panel</Link>
            </li>
          ) : null
        ) : null}
      </ul>
    </nav>
  );
}
