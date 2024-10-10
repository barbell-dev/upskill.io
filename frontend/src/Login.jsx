import { Link } from "react-router-dom";

export default function Login() {
  // alert("here");
  const token = localStorage.getItem("token");
  // alert(token);
  console.log(token);
  if (token != null && token != undefined) {
    window.location.href = "/dashboard";
  } else {
    const handleLogin = async (event) => {
      event.preventDefault();
      const formData = {
        email: event.target.email.value,
        password: event.target.password.value,
      };
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/user/login",
          {
            method: "POST",
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        const result = await response.json();
        if (result.status == 200) {
          localStorage.setItem("token", result.token);
          window.location.href = "/dashboard";
        } else {
          alert("Incorrect email/password");
          return;
        }
      } catch (e) {
        alert(e);
        return;
      }
    };
    return (
      <div>
        <h2>Login</h2>
        <br></br>
        <form className="form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            required
          ></input>
          <br></br>
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            required
          ></input>
          <br></br>
          <button type="submit">Login</button>
          <br></br>
        </form>
        <p>
          Dont have an account? <a href="/signup">Signup</a>
        </p>
      </div>
    );
  }
}
