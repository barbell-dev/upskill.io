export default function Login() {
  return (
    <div>
      <h2>Login</h2>
      <br></br>
      <form className="form" action="">
        <input type="email" placeholder="Enter email"></input>
        <br></br>
        <input type="password" placeholder="Enter password"></input>
        <br></br>
        <p>
          Dont have an account? <a href="/signup">Signup</a>
        </p>
      </form>
    </div>
  );
}
