import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { expect } from 'vitest'

describe('<Blog />', () => {

  test('renders blog title and author but not url or likes', () => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Author of the blog',
      url: 'http://testblog.com',
      likes: 5,
    }

    render(<Blog blog={blog} />)


    const titleElement = screen.getByText('Component testing is done with react-testing-library')
    const authorElement = screen.getByText('by Author of the blog')
    const urlElement = screen.queryByText('http://testblog.com')
    const likesElement = screen.queryByText('5')
    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()
    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })
  test('clicking the button shows all blog details', async () => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Author of this blog',
      url: 'http://thisblog.com',
      likes: 3,
      name: 'testuser',
    }

    const mockHandler = vi.fn()

    render(
      <Blog blog={blog} toggleExpanded={mockHandler} />

    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)


    const titleElement = screen.getByText('Component testing is done with react-testing-library')
    const authorElement = screen.getByText('by Author of this blog')
    const urlElement = screen.getByText('http://thisblog.com')
    const likesElement = screen.getByText('Likes: 3')
    const nameElement = screen.getByText('tuntematon')
    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()
    expect(urlElement).toBeDefined()
    expect(likesElement).toBeDefined()
    expect(nameElement).toBeDefined()
  })

  test('clicking like button twice gives two likes', async () => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Author of this blog',
      url: 'http://thisblog.com',
      likes: 3,
      name: 'testuser',
    }
    const mockHandler = vi.fn()

    render(
      <Blog blog={blog} handleLike={mockHandler} />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

describe('<BlogForm />', () => {
  test('Blogform callbacks correct data when blog created', () => {
    const handleCreateNew = vi.fn()

    render(<BlogForm handleCreateNew={handleCreateNew} />)
    const titleInput = screen.getByPlaceholderText('add title')
    const authorInput = screen.getByPlaceholderText('add author')
    const urlInput = screen.getByPlaceholderText('add url')

    const user = userEvent.setup()
    user.type(titleInput, 'Blog title')
    user.type(authorInput, 'Blog author')
    user.type(urlInput, 'http://testblog.com')
    const submitButton = screen.getByText('create')
    user.click(submitButton)

    waitFor(() => {
      expect(handleCreateNew).toHaveBeenCalled()

      expect(handleCreateNew).toBeCalledWith({
        title: 'Blog title',
        author: 'Blog author',
        url: 'http://testblog.com',
      })
    })

  })
})