import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, selectAllUsers, selectUsersError, selectUsersStatus } from '../features/userSlice';
import { Link } from 'react-router-dom';

function Users() {

    const dispatch = useDispatch();
    const users = useSelector(selectAllUsers);
    const status = useSelector(selectUsersStatus);
    const error = useSelector(selectUsersError);

    useEffect(() => {
        if(status === "idle"){
            dispatch(fetchUsers());
        }
    }, [status, dispatch])

    if(status === "loading") return <p>Loading users</p>;
    if(status === "failed") return <p>Error: {error}</p>;
  return (
    <ul>
        {users.map((user) => (
            <li key={user.id}>
                <strong><Link to={`/users/${user.id}`}>{user.name}</Link></strong> ({user.email})
            </li>
        ))}
    </ul>
  )
}

export default Users