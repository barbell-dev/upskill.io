import Login from "./Login";

export default function Home() {
  const token = localStorage.getItem("token");
  if (token) {
    return <div>Home page</div>;
  } else {
    return (
      <div>
        <Login />
      </div>
    );
  }
}
