import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'


const BlogForm = ({ setMessage, setErrorMessage, createBlog }) => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState('')
  const [createVisible, setCreateVisible] = useState(false)

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleCreateNew = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService
        .create({
          title: title,
          author: author,
          url: url,
          user: {
            name: user.name
          }
        })

      createBlog(newBlog)
      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)

      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      console.error('error creating new blog', exception)
      setErrorMessage('Failed to create new blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }

  BlogForm.propTypes = {
    setMessage: PropTypes.func.isRequired,
    setErrorMessage: PropTypes.func.isRequired,
    createBlog: PropTypes.func.isRequired,
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateNew}>
        <div>
          title:
          <input
            type="text"
            data-testid='title'
            value={title}
            name="title"
            onChange={handleTitleChange}
            placeholder='add title'
          />
        </div>
        <div>
          author:
          <input
            type="text"
            data-testid='author'
            value={author}
            name="author"
            onChange={handleAuthorChange}
            placeholder='add author'
          />
        </div>
        <div>
          url:
          <input
            type="text"
            data-testid='url'
            value={url}
            name="url"
            onChange={handleUrlChange}
            placeholder='add url'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}
export default BlogForm