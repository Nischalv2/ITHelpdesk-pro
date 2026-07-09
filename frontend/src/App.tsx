import { useState } from "react";
import TicketList from "./components/TicketList";
import CreateTicket from "./components/CreateTicket";

function App() {

  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h1>ITHelpdesk-pro</h1>

      <CreateTicket
        onTicketCreated={() => setRefresh(!refresh)}
      />

      <hr />

      <TicketList refresh={refresh} />

    </div>
  );
}

export default App;