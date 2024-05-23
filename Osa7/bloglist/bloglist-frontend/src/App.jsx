import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogDetails from './components/BlogDetails'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import { setNotification } from './reducers/notificationReducer'
import { createBlog, deleteBlog, initializeBlogs } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Navbar,
  Nav,
  Alert,
} from 'react-bootstrap'

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert variant="danger" onClose={() => {}} dismissible>
      {message}
    </Alert>
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('Initializing blogs...')
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage('Invalid username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
    window.location.reload()
  }

  const addBlog = async (newBlog) => {
    try {
      await dispatch(createBlog(newBlog))
      dispatch(initializeBlogs())
      dispatch(setNotification(`a new blog "${newBlog.title}" added`))
    } catch (error) {
      console.error('Error creating blog:', error)
      setErrorMessage('Creating blog failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const blogFormRef = useRef()

  const handleLike = async (id) => {
    try {
      const blogToLike = blogs.find((blog) => blog.id === id)
      const likedBlog = { ...blogToLike, likes: blogToLike.likes + 1 }
      await blogService.update(id, likedBlog)
      dispatch(initializeBlogs())
    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const deleteBlogs = async (id, blog) => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(id)
        dispatch(deleteBlog(id))
        dispatch(setNotification('blog deleted'))
      } catch (error) {
        console.error('error deleting blog', error)
        dispatch(setNotification('failed to delete blog'))
      }
    }
  }

  if (user === null) {
    return (
      <Container>
        <div>
          <h2>Log in to application</h2>
          <Notification />
          <Error message={errorMessage} />
          <Form onSubmit={handleLogin}>
            <div>
              username
              <input
                type="text"
                data-testid="username"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password
              <input
                type="password"
                data-testid="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <Button variant="primary" type="submit">
              login
            </Button>
          </Form>
        </div>
      </Container>
    )
  }

  return (
    <Router>
      <Container>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#">BlogApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">
                Blogs
              </Nav.Link>
              <Nav.Link as={Link} to="/users">
                Users
              </Nav.Link>
            </Nav>
            {user.name} logged in{' '}
            <Button variant="secondary" onClick={handleLogout}>
              logout
            </Button>
          </Navbar.Collapse>
        </Navbar>
        <h2>blogs</h2>
        <Notification />
        <Error message={errorMessage} />

        <Routes>
          <Route path="/users" element={<Users />} />
          {users.map((user) => (
            <Route
              key={user.id}
              path={`/users/${user.id}`}
              element={<User user={user} blogs={blogs} />}
            />
          ))}
          <Route
            path="/blogs/:id"
            element={<BlogDetails handleLike={handleLike} />}
          />
          <Route
            path="/"
            element={
              <>
                <Togglable buttonLabel="create" ref={blogFormRef}>
                  <BlogForm
                    setErrorMessage={setErrorMessage}
                    createBlog={addBlog}
                    user={user}
                  />
                </Togglable>
                <br></br>
                <Row>
                  {sortedBlogs.map((blog) => (
                    <Col key={blog.id} md={6}>
                      <Blog
                        blog={blog}
                        user={user}
                        handleLike={handleLike}
                        onDelete={deleteBlogs}
                      />
                    </Col>
                  ))}
                </Row>
              </>
            }
          />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
