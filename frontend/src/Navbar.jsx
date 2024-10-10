import "./Navbar.css";
import MyCourses from "./MyCourses";
import AllCourses from "./AllCourses";
import BuyCoffee from "./BuyCoffee";
import { useState } from "react";

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

  return (
    <div>
      <nav className="navbar">
        <button id="my-courses" onClick={handleMyCoursesClick}>
          My Courses
        </button>
        <button id="all-courses" onClick={handleAllCoursesClick}>
          All Courses
        </button>
        <button id="buy-coffee" onClick={handleBuyCoffeeClick}>
          Buy me a coffee
        </button>
      </nav>

      {activeComponent === "MyCourses" && <MyCourses token={token} />}
      {activeComponent === "AllCourses" && <AllCourses />}
      {activeComponent === "BuyCoffee" && <BuyCoffee />}
    </div>
  );
}
