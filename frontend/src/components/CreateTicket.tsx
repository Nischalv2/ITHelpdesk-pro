import { useState } from "react";
import axios from "axios";

function CreateTicket() {

  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Low"
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value
    });
  };


  const createTicket = async () => {
    try {
      await axios.post(
        "http://localhost:5001/api/tickets",
        ticket
      );

      alert("Ticket created!");

      window.location.reload();

    } catch(error) {
      console.error(error);
      alert("Error creating ticket");
    }
  };


  return (
    <div>

      <h2>Create Ticket</h2>

      <input
        name="title"
        placeholder="Issue title"
        value={ticket.title}
        onChange={handleChange}
      />

      <br />

      <textarea
        name="description"
        placeholder="Description"
        value={ticket.description}
        onChange={handleChange}
      />

      <br />

      <input
        name="category"
        placeholder="Category"
        value={ticket.category}
        onChange={handleChange}
      />

      <br />

      <select
        name="priority"
        value={ticket.priority}
        onChange={handleChange}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <br />

      <button onClick={createTicket}>
        Submit Ticket
      </button>

    </div>
  );
}

export default CreateTicket;