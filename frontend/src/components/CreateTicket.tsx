import { useState } from "react";
import axios from "axios";

interface Props {
  onTicketCreated: () => void;
}

function CreateTicket({ onTicketCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Network");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5001/api/tickets", {
        title,
        description,
        category,
        priority,
      });

      alert("Ticket created successfully!");
       onTicketCreated();
      setTitle("");
      setDescription("");
      setCategory("Network");
      setPriority("Medium");

    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket");
    }
  };

  return (
    <div>
      <h2>Create New Ticket</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Title:</label>
          <br />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter issue title"
          />
        </div>

        <br />

        <div>
          <label>Description:</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem"
          />
        </div>

        <br />

        <div>
          <label>Category:</label>
          <br />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Network</option>
            <option>Hardware</option>
            <option>Software</option>
            <option>Account</option>
          </select>
        </div>

        <br />

        <div>
          <label>Priority:</label>
          <br />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>

        <br />

        <button type="submit">
          Create Ticket
        </button>

      </form>
    </div>
  );
}

export default CreateTicket;