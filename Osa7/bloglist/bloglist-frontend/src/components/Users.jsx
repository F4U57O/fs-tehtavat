import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUsers } from '../reducers/usersReducer'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'

const Users = () => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  return (
    <Container>
      <div>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  )
}

export default Users
