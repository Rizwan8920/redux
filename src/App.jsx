import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Counter from "./pages/Counter"
import Todo from "./pages/Todo"
import Summary from "./pages/Summary"
import Users from "./pages/Users"
import UserDetails from "./pages/UserDetails"
import Post from "./pages/Post"
import Login from "./pages/Login"
import { useSelector } from "react-redux"
import { selectIsAuthenticated } from "./features/authSlice"

function ProtectedRoute({children}) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/counter" element={<ProtectedRoute><Counter /></ProtectedRoute>} />
        <Route path="/todo" element={<ProtectedRoute><Todo /></ProtectedRoute>} />
        <Route path="/summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/users/:id" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
        <Route path="/posts" element={<ProtectedRoute><Post /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
