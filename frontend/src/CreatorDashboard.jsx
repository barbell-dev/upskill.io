import { useState, useEffect } from "react";

export default function CreatorDashboard() {
  const [image, setImage] = useState();
  async function createCourse(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");

    let formData = new FormData();
    // console.log(image);
    formData.append("image", image);
    formData.append("courseName", event.target.courseName.value);
    formData.append("amount", event.target.amount.value);
    for (let i of formData.values()) {
      console.log(i);
    }
    const response = await fetch(
      "http://localhost:8080/api/v1/creator/createCourse",
      {
        method: "POST",
        headers: {
          token: token,
        },
        body: formData,
      }
    );
    const result = await response.json();
    console.log(result);
    if (result.status === 200) {
      alert("Course created successfully.");
      return;
    } else {
      alert(result.message);
      return;
    }
  }
  function handleThumbnailChange(e) {
    e.preventDefault();
    setImage(e.target.files[0]);
  }
  return (
    <div>
      <h1>Create a course</h1>
      <br></br>
      <form onSubmit={createCourse}>
        <label> Thumbnail</label>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleThumbnailChange}
        />
        <br></br>
        <label>Course name</label>
        <input type="text" name="courseName" />
        <br></br>
        <label>Amount</label>
        <input type="number" name="amount" min="1" />
        <br></br>

        <button type="submit">Create course</button>
      </form>
      {/*Course creator ID can be fetched from token */}
    </div>
  );
}
