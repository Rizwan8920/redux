import { useDispatch, useSelector } from "react-redux"
import { decrement, increment, incrementByAmount, reset, selectCount } from "../features/counterSlice.js";
import { useEffect } from "react";


function Counter() {

  const value = useSelector(selectCount);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(increment());

    return () => dispatch(decrement());
  }, [])

  return (
    <div>
      <h1>{value}</h1>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  )
}

export default Counter
