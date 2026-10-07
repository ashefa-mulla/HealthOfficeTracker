import React from "react";
import { Link } from "react-router-dom";

const EmployeeMenu = (props: any) => {
  return (
    <>
      <li className="menu-title">{props.t ? props.t("Menu") : "Menu"} </li>
      <li>
        <Link to="/dashboard" onClick={props.onItemClick}>
          <i className="bx bx-home-circle"></i>
          <span>{props.t ? props.t("Dashboard") : "Dashboard"}</span>
        </Link>
      </li>
      <li>
        <Link to="/timer" onClick={props.onItemClick}>
          <i className="bx bx-time-five"></i>
          <span>{props.t ? props.t("Clock In / Out") : "Clock In / Out"}</span>
        </Link>
      </li>
    </>
  );
};

export default EmployeeMenu;
