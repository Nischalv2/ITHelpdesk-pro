import { useState } from "react";
import axios from "axios";

interface CreateTicketProps {
  onCreated: () => void;
}

function CreateTicket({ onCreated }: CreateTicketProps) {
  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    category: "Other",
    priority: "Low",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value,
    });
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticket.title.trim() || !ticket.description.trim()) {
      alert("Please enter a title and description.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://ithelpdesk-pro.onrender.com/api/tickets",
        ticket
      );

      alert("Ticket created successfully!");

      setTicket({
        title: "",
        description: "",
        category: "Other",
        priority: "Low",
      });

      onCreated();
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Error creating ticket. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="create-ticket-card">
      <div className="card-header">
        <div>
          <span className="card-icon">＋</span>
          <h2>Create Ticket</h2>
          <p>Submit a new IT support request.</p>
        </div>
      </div>

      <form onSubmit={createTicket} className="ticket-form">
        <div className="form-group">
          <label htmlFor="title">Issue Title</label>

          <input
            id="title"
            name="title"
            type="text"
            placeholder="Issue title"
            value={ticket.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            placeholder="Describe the issue..."
            value={ticket.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>

            <select
              id="category"
              name="category"
              value={ticket.category}
              onChange={handleChange}
            >
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Account">Account</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>

            <select
              id="priority"
              name="priority"
              value={ticket.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Ticket"}
        </button>
      </form>
    </section>
  );
}

export default CreateTicket;