import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, selectTodo, setFilter, toggleTodo } from "../features/todoSlice";

function Todo() {
  const [todoTitle, setTodoTitle] = useState("");
  const dispatch = useDispatch();
  const {todos, filter} = useSelector(selectTodo);
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTodo(todoTitle));
    setTodoTitle("");
  }

  const visibleTodos = useMemo(() => {
    let visibleTodosT = todos;
    if(filter == "active"){
        visibleTodosT = todos.filter((item) => !item.completed);
    }else if(filter == "done"){
        visibleTodosT = todos.filter((item) => item.completed);
    }
    return visibleTodosT.filter((item) => item.title.includes(search));
  }, [todos, filter, search])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="todoTitle"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
        />
        <button type="submit">Save</button>
      </form>
      <h1>Todos</h1>
      <select name="filter" value={filter} onChange={(e) => dispatch(setFilter(e.target.value))}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="done">Done</option>
      </select>
      <span>Completed: {todos.filter((item) => item.completed).length}</span>
      <input type="text" name="search" value={search} onChange={(e) => setSearch(e.target.value)}  />
      <ul>
        {
            visibleTodos.map((item) => (
                <li key={item.id}>
                    <span><input type="checkbox" checked={item.completed} onChange={() => dispatch(toggleTodo(item.id))} /></span>
                    <span>{item.title}</span>
                </li>
            ))
        }
      </ul>
    </div>
  );
}

export default Todo;
