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
          <p>Category: {ticket.category}</p>
          <p>Priority: {ticket.priority}</p>
          <p>Status: {ticket.status}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default TicketList;