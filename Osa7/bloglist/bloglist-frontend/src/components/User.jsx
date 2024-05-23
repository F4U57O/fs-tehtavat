import React from 'react'
import { Container } from 'react-bootstrap'

const User = ({ user, blogs }) => {
  if (!user) {
    return null
  }

  const userBlogs = blogs.filter((blog) => blog.user.id === user.id)

  return (
    <Container>
      <div>
        <h2>{user.name}</h2>
        <h3>Added blogs</h3>
        <ul>
          {userBlogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    </Container>
  )
}

export default User
