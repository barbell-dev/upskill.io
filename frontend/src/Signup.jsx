import React from "react";

export default function Signup() {
  const handleSignup = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = {
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });
      console.log(response);
      const result = await response.json();
      console.log(result);
      if (result.status === 200) {
        // const result = await response.json();
        alert("Signup successful!"); // Show success alert
        window.location.href = "/dashboard";
      } else {
        alert(result.message); // Show error alert for non-2xx responses
      }
    } catch (error) {
      alert("An error occurred. Please try again later." + error); // Show alert for network errors
    }
  };

  return (
    <div>
      <p>Signup form</p>
      <br></br>
      <form onSubmit={handleSignup}>
        {/* Removed action and method attributes */}
        <label>First name</label>
        <input
          type="text"
          name="firstName"
          placeholder="Enter your first name"
          required
        ></input>{" "}
        <br></br>
        <label>Last name</label>
        <input
          type="text"
          name="lastName"
          placeholder="Enter your last name"
          required
        ></input>{" "}
        <br></br>
        <label>Email</label>{" "}
        <input
          type="email"
          placeholder="Enter your email"
          name="email"
          required
        ></input>{" "}
        <br></br>
        <label>Password</label>{" "}
        <input
          type="password"
          name="password"
          placeholder="Enter a password"
          required
        ></input>
        <br></br>
        <button type="submit">Signup</button>
      </form>
      <br></br>
    </div>
  );
}
