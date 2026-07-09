import { useEffect, useState } from "react";
import axios from "axios";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
}

interface Props {
  refresh: boolean;
}

function TicketList({ refresh }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/tickets"
      );

      setTickets(response.data);

    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const updateStatus = async (
    id: string,
    status: string
  ) => {
    try {
      await axios.put(
        `http://localhost:5001/api/tickets/${id}`,
        {
          status,
        }
      );

      fetchTickets();

    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refresh]);

  return (
    <div>
      <h2>Helpdesk Tickets</h2>

      {tickets.map((ticket) => (
        <div key={ticket._id}>

          <h3>{ticket.title}</h3>

          <p>{ticket.description}</p>

          <p>
            Category: {ticket.category}
          </p>

          <p>
            Priority: {ticket.priority}
          </p>

          <label>
            Status:
          </label>

          <select
            value={ticket.status}
            onChange={(e) =>
              updateStatus(
                ticket._id,
                e.target.value
              )
            }
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>In Review</option>
            <option>Done</option>
          </select>

          <hr />

        </div>
      ))}
    </div>
  );
}

export default TicketList;