import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { initializeBlogs } from '../reducers/blogReducer'
import blogService from '../services/blogs'
import { Container, Button } from 'react-bootstrap'

const BlogDetails = ({ handleLike }) => {
  const { id } = useParams()
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  )
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')

  const handleLikeClick = () => {
    handleLike(blog.id)
  }

  const handleComment = async (event) => {
    event.preventDefault()
    await blogService.addComment(blog.id, comment)
    dispatch(initializeBlogs())
    setComment('')
  }

  return (
    <Container>
      <div>
        <h2>{blog.title}</h2>
        <p>
          <Link to={blog.url}>{blog.url}</Link>
        </p>
        <p>
          {blog.likes} likes <button onClick={handleLikeClick}>Like</button>
        </p>
        <p>added by {blog.user.name}</p>

        <h3>Comments</h3>

        <form onSubmit={handleComment}>
          <input
            type="text"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <Button variant="secondary" type="submit">
            Add comment
          </Button>
        </form>
        <ul>
          {blog.comments.map((comment, i) => (
            <li key={i}>{comment}</li>
          ))}
        </ul>
      </div>
    </Container>
  )
}

export default BlogDetails
