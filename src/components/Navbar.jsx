import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/counter">Counter</NavLink>
        <NavLink to="/todo">Todo</NavLink>
        <NavLink to="/summary">Summary</NavLink>
        <NavLink to="/users">Users</NavLink>
    </nav>
  )
}

export default Navbar