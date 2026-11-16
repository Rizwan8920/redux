import { useSelector } from "react-redux"
import { selectTodo } from "../features/todoSlice"
import { selectCount } from "../features/counterSlice";


function Summary() {

    const {todos, filter} = useSelector(selectTodo);
    const value = useSelector(selectCount);
  return (
    <div>
        <div>Todos: {todos.length}</div>
        <div>Counter: {value}</div>
    </div>
  )
}

export default Summary