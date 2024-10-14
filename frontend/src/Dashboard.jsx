import { useEffect } from "react";
import "./Dashboard.css";
import Navbar from "./Navbar";
export default function Dashboard() {
  const token = localStorage.getItem("token");
  const mode = localStorage.getItem("mode");
  // if(mode!="creator"){}
  if (mode == undefined) {
    window.location.href = "/";
  } else if (mode == "creator" && (token != null || token != undefined)) {
    // alert("h");
    // console.log("HHH");
    window.location.href = "/creator/dashboard";
  } else {
    if (token != null && token != undefined) {
      // async function getFirstName(token) {
      //   const response = await fetch(
      //     "http:localhost:8080/api/v1/user/getFirstName"
      //   );
      // }
      // const firstName = await getFirstName(token);
      // useEffect(function)
      return (
        <div className="dashboard">
          <Navbar />
          <hr />
          <div>Hi</div>
        </div>
      );
    } else {
      window.location.href = "/";
    }
  }
}
