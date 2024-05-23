import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Form, Button } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
      await createBlog({ title, author, url })
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      console.error('failed to create new blog', exception)
    }
  }

  BlogForm.propTypes = {
    setErrorMessage: PropTypes.func.isRequired,
    createBlog: PropTypes.func.isRequired,
  }

  return (
    <Container>
      <div>
        <h2>create new</h2>
        <Form onSubmit={handleCreateNew}>
          <Form.Group controlId="formTitle">
            <Form.Label>title:</Form.Label>
            <Form.Control
              type="text"
              data-testid="title"
              value={title}
              name="title"
              onChange={handleTitleChange}
              placeholder="add title"
              style={{ width: '300px' }}
            />
          </Form.Group>
          <Form.Group controlId="formAuthor">
            <Form.Label>author:</Form.Label>
            <Form.Control
              type="text"
              data-testid="author"
              value={author}
              name="author"
              onChange={handleAuthorChange}
              placeholder="add author"
              style={{ width: '300px' }}
            />
          </Form.Group>
          <Form.Group controlId="formUrl">
            <Form.Label>url:</Form.Label>
            <Form.Control
              type="text"
              data-testid="url"
              value={url}
              name="url"
              onChange={handleUrlChange}
              placeholder="add url"
              style={{ width: '300px' }}
            />
          </Form.Group>
          <br></br>
          <Button variant="primary" type="submit">
            create
          </Button>
        </Form>
        <br></br>
      </div>
    </Container>
  )
}
export default BlogForm
