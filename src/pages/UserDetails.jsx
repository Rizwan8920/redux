import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchUserById, selectUserById } from '../features/userSlice';

function UserDetails() {
    const dispatch = useDispatch();
    const {id} = useParams();
    const entry = useSelector(selectUserById(id));

    useEffect(() => {
        const promise = dispatch(fetchUserById(id));

        return () => {
            promise.abort();
        }
    }, [id, dispatch]);

    if(!entry || entry.status === "loading") return <p>Loading user...</p>;
    if(entry.status === "failed") return <p>Error: {entry.error}</p>;

    const {name, email, phone, webiste, company} = entry.data;

  return (
    <div>
        <h2>{name}</h2>
        <p>{email}</p>
        <p>{phone}</p>
        <p>{webiste}</p>
        <p>{company.name}</p>
    </div>
  )
}

export default UserDetails