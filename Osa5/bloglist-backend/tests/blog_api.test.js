const { test, after, describe, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')


let token = null

beforeEach(async () => {  
    await Blog.deleteMany({}) 
    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'testuser', passwordHash })
    await user.save()
    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'password'})

    token = loginResponse.body.token
    
    let blogObject = new Blog(helper.initialBlogs[0])  
    await blogObject.save()  
    blogObject = new Blog(helper.initialBlogs[1])  
    await blogObject.save()
    })

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs have an id field named id', async () =>{
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
    assert.ok('id' in blog)
    })
})
test('a valid blog can be added ', async () => {
    const newBlog = {
        
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: `Bearer ${token}` })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    assert(titles.includes('Canonical string reduction'))
})

test('adding a blog without token fails 401 error', async () => {
    const newBlog = {
        
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })


test('blog without likes has zero likes', async () => {
    const newBlog = {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
  
    const response = await api.get('/api/blogs')
    const addedBlog = response.body.find(blog => blog.title === newBlog.title)
  
    assert.strictEqual(addedBlog.likes, 0)
  })

test('blog without title gives 400 Bad Request error', async () => {
    const newBlog = {
        _id: "5a422b3a1b54a676234d17f9",
        title: "",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0 
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)

})

test('blog without url gives 400 Bad Request error', async () => {
    const newBlog = {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "",
        likes: 12,
        __v: 0 
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)

})

test('deletion of a blog succeeds', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    console.log('eka', token)

    
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({Authorization: `Bearer ${token}`})
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    
})

test('updating blog succeeds', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
        title: 'Update React patterns',
        author: 'Update Michael Chan',
        url: 'Update https://reactpatterns.com/',
        likes: 10
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlogInDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

    assert.strictEqual(updatedBlogInDb.title, updatedBlog.title)
    assert.strictEqual(updatedBlogInDb.author, updatedBlog.author)
    assert.strictEqual(updatedBlogInDb.url, updatedBlog.url)
    assert.strictEqual(updatedBlogInDb.likes, updatedBlog.likes)
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('missing password returns 400 error', async () => {
    const newUser = {
        username: 'user',
        name: 'test user'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect({ error: 'password missing' })
  })
  test('too short password returns 400 error', async () => {
    const newUser = {
        username: 'user',
        name: 'test user',
        password: 'sa'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect({ error: 'password is too short' })
  })
})

after(async () => {
  await mongoose.connection.close()
})