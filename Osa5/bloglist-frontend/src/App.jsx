import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'


const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return (
    <div style={errorStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })


      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
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
    window.location.reload()

  }

  const addBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    newBlog.user = { username: user.username, name: user.name }
    setBlogs(blogs.concat(newBlog))
  }

  const blogFormRef = useRef()

  const handleLike = async (id) => {
    try {
      const blogToLike = blogs.find((blog) => blog.id === id)
      const likedBlog = { ...blogToLike, likes: blogToLike.likes + 1 }
      await blogService
        .update(id, likedBlog)
      setBlogs(blogs.map((blog) => (blog.id === id ? likedBlog : blog)))

    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  const sortedBlogs = [...blogs].sort((a,b) => b.likes - a.likes)

  const deleteBlogs = async (id, blog) => {

    try {
      const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
      if (confirmDelete) {
        await blogService
          .remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        setMessage('Blog deleted')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    } catch (error) {
      console.error('Error deleting blog', error)
    }
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <Error message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
          username
            <input
              type="text"
              data-testid='username'
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              data-testid='password'
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <Error message={errorMessage} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create" ref={blogFormRef}>
        <BlogForm
          setMessage={setMessage}
          setErrorMessage={setErrorMessage}
          createBlog={addBlog}/>
      </Togglable>
      <p></p>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleLike={handleLike} onDelete={deleteBlogs}/>
      )}

    </div>
  )
}

export default App