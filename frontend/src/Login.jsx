import { Link } from "react-router-dom";

export default function Login() {
  const handleLogin = async (event) => {
    const token = localStorage.getItem("token");
    event.preventDefault();
    const formData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    try {
      await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          alert(response.message);
          localStorage.setItem("token", response.token);
          if (response.status === 200) {
            console.log("here");
            <Link to="/home"></Link>;
          }
        })
        .catch((e) => {
          alert(e);
        });
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
