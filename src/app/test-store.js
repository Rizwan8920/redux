import { store } from "./store.js";
import { increment, decrement, incrementByAmount, reset } from "../features/counterSlice.js";
import { addTodo } from "../features/todoSlice.js";

const unsubscribe = store.subscribe(() => {
    console.log("State changed:", JSON.stringify(store.getState(), null, 2));
});

console.log("Initial state: ", store.getState());

// store.dispatch(addTodo("test"));

store.dispatch(increment());
// console.log("After increment: ", store.getState());

// store.dispatch(incrementByAmount(5));
// console.log("After incrementByAmount(5): ", store.getState());

// store.dispatch(decrement());
// console.log("After decrement: ", store.getState());

// store.dispatch(reset());
// console.log("After reset: ", store.getState());

// console.log(increment())

unsubscribe();