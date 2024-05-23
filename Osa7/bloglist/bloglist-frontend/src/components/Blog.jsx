import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'

const Blog = ({ blog, handleLike, onDelete, user }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 2,
    marginBottom: 5,
  }

  const handleLikeClick = () => {
    handleLike(blog.id)
  }

  const handleDeleteClick = () => {
    onDelete(blog.id, blog)
  }

  return (
    <Container>
      <div style={blogStyle}>
        <div className="blog">
          <div>
            <strong>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </strong>{' '}
            by {blog.author}{' '}
            <button onClick={toggleExpanded}>
              {expanded ? 'hide' : 'view'}
            </button>
          </div>
          {expanded && (
            <div className="details">
              <p>{blog.url}</p>
              <p>
                Likes: {blog.likes}{' '}
                <button onClick={handleLikeClick}>Like</button>
              </p>
              <p>{blog.user.name}</p>
              {user && blog.user && blog.user.username === user.username && (
                <button onClick={handleDeleteClick}>Delete</button>
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
export default Blog
