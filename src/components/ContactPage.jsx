import React, { useState } from "react";

function ContactPage() {
  const [formState, setFormState] = useState({ subject: "", email: "", content: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formState),
    })
      .then(() => alert("Message sent!"))
      .catch((err) => console.error("Failed to send message:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="subject" placeholder="Subject" onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
      <textarea name="content" placeholder="Message" onChange={handleChange} required />
      <button type="submit">Send</button>
    </form>
  );
}

export default ContactPage;
