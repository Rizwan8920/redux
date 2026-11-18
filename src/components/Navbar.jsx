import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout, selectUser } from '../features/authSlice';

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    console.log(user);
  return (
    <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/counter">Counter</NavLink>
        <NavLink to="/todo">Todo</NavLink>
        <NavLink to="/summary">Summary</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/posts">Posts</NavLink>
        {user === null && <button onClick={() => navigate("/login")}>Login</button>}
        {user && <button onClick={() => dispatch(logout())}>Logout</button>}
        <p>{user?.firstName}</p>
    </nav>
  )
}

export default Navbar