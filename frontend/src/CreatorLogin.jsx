export default function CreatorLogin() {
  // window.history.
  const token = localStorage.getItem("token");
  // alert(token);
  console.log(token);
  if (token != null && token != undefined) {
    localStorage.setItem("mode", "creator");
    window.location.href = "/creator/dashboard";
  } else {
    const handleCreatorLogin = async (event) => {
      event.preventDefault();
      const formData = {
        email: event.target.email.value,
        password: event.target.password.value,
      };
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/creator/login",
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
        // alert(JSON.stringify(result));
        // console.log(result);
        if (response.status == 200) {
          localStorage.setItem("token", result.token);

          localStorage.setItem("mode", "creator");
          window.location.href = "/creator/dashboard";
          window.history.forward();
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
        <form className="form" onSubmit={handleCreatorLogin}>
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
          Dont have an account? <a href="/creator/signup">Creator Signup</a>
          <br></br>
        </p>
      </div>
    );
  }
}
