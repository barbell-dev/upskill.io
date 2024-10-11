export default function CreatorDashboard() {
  async function createCourse(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const formData = {
      thumbnail: event.target.thumbnail.value,
      amount: event.target.amount.value,
    };
    const response = await fetch(
      "http://localhost:8080/api/v1/creator/createCourse",
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
    if (result.status === 200) {
      alert("Course created successfully.");
      return;
    } else {
      alert(result.message);
      return;
    }
  }
  return (
    <div>
      <h1>Create a course</h1>
      <br></br>
      <form onSubmit={createCourse}>
        <input type="file" name="thumbnail">
          Thumbnail
        </input>
        <input type="number" name="amount">
          Amount
        </input>

        <button type="submit">Create course</button>
      </form>
      {/*Course creator ID can be fetched from token */}
    </div>
  );
}
