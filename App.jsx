import ListGroup from "./components/ListGroup"

function App() {
  let items = ["Baku", "Sumgait", "Ganja", "Jabrail", "Kalbajar"];

  return <div><ListGroup items={items} heading="Cities" /></div>
}

export default App;