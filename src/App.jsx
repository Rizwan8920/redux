import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Counter from "./pages/Counter"
import Todo from "./pages/Todo"
import Summary from "./pages/Summary"
import Users from "./pages/Users"
import UserDetails from "./pages/UserDetails"


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </div>
  )
}

export default App
