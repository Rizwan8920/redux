import { createSlice, nanoid } from "@reduxjs/toolkit"

const initialState = {
    todos: [],
    filter: 'all' // all, active, done
}

const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: {
            reducer: (state, action) => {
                state.todos.push(action.payload);
            },
            prepare: (text) => {
                return {
                    payload: {
                        id:nanoid(),
                        title: text,
                        completed: false,
                        createdAt: new Date().toISOString(),
                    }
                }
            }
        },
        toggleTodo: (state, action) => {
            const todo = state.todos.find((item) => item.id === action.payload);
            if(todo){
                todo.completed = !todo.completed;
            }
        },
        deleteTodo: (state, action) => {
            state.todos = state.todos.filter((item) => item.id !== action.payload);
        },
        editTodo: (state, action) => {
            const todo = state.todos.find((item) => item.id === action.payload.id);
            if(todo){
                todo.title = action.payload.title;
            }
        },
        clearCompleted: (state) => {
            state.todos = state.todos.filter((item) => !item.completed);
        },
        setFilter: (state, action) => {
            state.filter = action.payload;
        }
    }
})

export const selectTodo = (state) => state.todo;

export const {addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, setFilter} = todoSlice.actions;
export default todoSlice.reducer;