import "./Dashboard.css";
import Navbar from "./Navbar";
export default function Dashboard() {
  const token = localStorage.getItem("token");
  if (token != null && token != undefined) {
    // async function getFirstName(token) {
    //   const response = await fetch(
    //     "http:localhost:8080/api/v1/user/getFirstName"
    //   );
    // }
    // const firstName = await getFirstName(token);

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
