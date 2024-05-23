import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const initialState = []

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    deleteBlog: (state, action) => {
      return state.filter((blog) => blog.id !== action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    console.log('Blogs fetched:', blogs)
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content)
    console.log('Content: ', newBlog)
    dispatch(appendBlog(newBlog))
  }
}

export const { deleteBlog, setBlogs, appendBlog } = blogSlice.actions

export default blogSlice.reducer
