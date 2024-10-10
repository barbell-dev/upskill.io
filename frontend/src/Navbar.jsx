import "./Navbar.css";
import MyCourses from "./MyCourses";
import AllCourses from "./AllCourses";
import BuyCoffee from "./BuyCoffee";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa"; // React Icons package

export default function Navbar() {
  const [activeComponent, setActiveComponent] = useState(null);
  const token = localStorage.getItem("token");

  const handleMyCoursesClick = () => {
    setActiveComponent("MyCourses");
  };

  const handleAllCoursesClick = () => {
    setActiveComponent("AllCourses");
  };

  const handleBuyCoffeeClick = () => {
    setActiveComponent("BuyCoffee");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    location.reload();
  };
  return (
    <div className="navbar">
      <nav>
        <button id="my-courses" onClick={handleMyCoursesClick}>
          My Courses
        </button>
        <button id="all-courses" onClick={handleAllCoursesClick}>
          All Courses
        </button>
        <button id="buy-coffee" onClick={handleBuyCoffeeClick}>
          Buy me a coffee
        </button>{" "}
        <i
          className="fa fa-sign-out"
          style={{ fontSize: "36px" }}
          id="logoutButton"
          onClick={handleLogout}
        ></i>
      </nav>

      {activeComponent === "MyCourses" && <MyCourses token={token} />}
      {activeComponent === "AllCourses" && <AllCourses />}
      {activeComponent === "BuyCoffee" && <BuyCoffee />}
    </div>
  );
}
