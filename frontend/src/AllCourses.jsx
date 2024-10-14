import { useEffect, useState } from "react";

export default function AllCourses() {
  const token = localStorage.getItem("token");
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/courses/viewAllCourses",
          {
            method: "GET",
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.status === 200) {
          setAllCourses(data.allCourses);
        }
      } catch (e) {
        alert("Error fetching courses");
      }
    }
    fetchData();
  }, [token]);

  return (
    <div>
      {allCourses.map((course) => (
        <div key={course._id}>
          <h3>{course.courseName}</h3>
          <p>Amount: {course.amount}</p>
          {course.courseThumbnailUrl && (
            <img
              src={course.courseThumbnailUrl}
              alt={`${course.courseName} thumbnail`}
              style={{ width: "200px", height: "auto" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
