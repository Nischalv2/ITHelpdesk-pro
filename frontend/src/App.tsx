import TicketList from "./components/TicketList";
import CreateTicket from "./components/CreateTicket";

function App() {

  return (
    <div>

      <h1>ITHelpdesk-pro 🚀</h1>

      <CreateTicket />

      <hr />

      <TicketList refresh={false} />

    </div>
  );
}

export default App;