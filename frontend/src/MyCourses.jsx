import { useEffect, useState } from "react";

export default function MyCourses(props) {
  const [courses, setCourses] = useState([]);
  const token = props.token;
  //   console.log("h");
  //   console.log(courses);
  useEffect(() => {
    async function fetchMyCourses() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/courses/viewPurchasedCourses",
          {
            method: "GET",
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
          }
        );
        const result = response.json();
        setCourses((courses) => {
          result;
        });
        return;
      } catch (e) {
        alert(e);
        return;
      }
    }
    fetchMyCourses();
  }, []);
  return <div>{courses}</div>;
}
