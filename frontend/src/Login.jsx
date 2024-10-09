export default function Login() {
  return (
    <div>
      <h2>Login</h2>
      <br></br>
      <form className="form" action="http:localhost:8080/api/v1/user/login">
        <input type="email" placeholder="Enter email" required></input>
        <br></br>
        <input type="password" placeholder="Enter password" required></input>
        <br></br>
        <button type="submit">Login</button>
        <br></br>
        <p>
          Dont have an account? <a href="/signup">Signup</a>
        </p>
      </form>
    </div>
  );
}
