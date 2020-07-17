import React, { useState } from "react";
import styles from "./SuperAdminPanel.module.css";
import { useContext } from "react";
import { UserContext } from "../../Contexts/UserContext";
import { useEffect } from "react";
import Axios from "axios";
export default function SuperAdminPanel() {
  const [users, setUsers] = useState([]);
  const [deletedItem, setDeletedItem] = useState(false);
  // Lets Collect All Users And Display Them
  useEffect(() => {
    Axios.get("http://localhost:4000/admin/getUsers", {
      withCredentials: true,
    }).then((res) => {
      console.log(res.data);
      setUsers(res.data);
    });
  }, [deletedItem]);

  const deleteAccount = (id) => {
    // I want to use a post method because its cooler.
    Axios.post(
      "http://localhost:4000/admin/deleteUser",
      { id: id },
      { withCredentials: true }
    ).then((res) => {
      if (res.data === "complete") {
        setDeletedItem(!deletedItem);
      }
    });
  };

  const context = useContext(UserContext);
  return (
    <div className={styles.AdminPage}>
      <div className={styles.WelcomeContainer}>
        <h1>Administration Panel</h1>

        <br />
        <p>Welcome Back {context.username}</p>
      </div>
      <br />

      <div className={styles.RegisteredUsersContainer}>
        <p>Below You Can See All Of The Registered Users:</p>
        <div className={styles.RegisteredUsers}>
          {users.map((item) => {
            return (
              <div className={styles.UserContainer} key={item._id}>
                <p className={styles.userId}>UserID: {item._id}</p>
                <p className={styles.username}>Username: {item.username}</p>
                <p className={styles.password}>
                  Hashed Password: {item.password}
                </p>
                <button onClick={() => deleteAccount(item._id)}>
                  Delete Account
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
