const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Fausto Testaaja',
        username: 'faustotest',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'faustotest', 'salainen')  
      await expect(page.getByText('Fausto Testaaja logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'faustotest', 'wrong')  
      await expect(page.getByText('Invalid username or password')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.waitForTimeout(2000)
      await loginWith(page, 'faustotest', 'salainen') 
      })
      
      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'newTitle', 'newAuthor', 'newUrl')  
        await expect(page.getByText('a new blog newTitle by newAuthor added')).toBeVisible()
        })
      test('a blog can be liked', async ({ page }) => {
        await createBlog(page, 'newTitle', 'newAuthor', 'newUrl')
        await page.getByRole('button', { name: 'view'}).click()
        await page.getByRole('button', { name: 'Like'}).click()
        await expect(page.getByText('Likes: 1')).toBeVisible()

        })
        test('a blog can be deleted', async ({ page }) => {
            await createBlog(page, 'newTitle', 'newAuthor', 'newUrl')
            await page.getByRole('button', { name: 'view'}).click()
            await page.getByRole('button', { name: 'delete'}).click()
            await page.on('dialog', async (dialog) => {
                await dialog.accept()
            })
            await page.getByRole('button', { name: 'delete'}).click()
            await expect(page.getByText('Blog deleted')).toBeVisible()
    
            })
      })
    })
      describe('Many users', async () => {
        beforeEach(async ({ page, request }) => {
          await request.post('/api/testing/reset')
          await request.post('/api/users', {
            data: {
              name: 'Fausto Testaaja',
              username: 'faustotest',
              password: 'salainen'
            }
          })
        
          await request.post('/api/users', {
            data: {
              name: 'Testaaja2',
              username: 'test2',
              password: 'salainen'
            }
          })
      
          await page.goto('/')
        })
        test('user can only delete own blogs', async ({ page }) => {
          await loginWith(page, 'faustotest', 'salainen')
          await createBlog(page, 'testBlog', 'testAuthor', 'testUrl')
          await page.getByRole('button', { name: 'view'}).click()
          await expect(page.getByRole('button', { name: 'delete'})).toBeVisible()

          await page.getByRole('button', { name: 'logout'}).click()
          await loginWith(page, 'test2', 'salainen')
          await page.getByRole('button', { name: 'view'}).click()
          await expect(page.getByRole('button', { name: 'delete'})).not.toBeVisible()
        
        })

      })
describe('Many blogs with different likes', async () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Fausto Testaaja',
        username: 'faustotest',
        password: 'salainen'
      }
    })
    await page.goto('/')
    await page.waitForTimeout(2000)
    await loginWith(page, 'faustotest', 'salainen') 
    await page.waitForTimeout(2000)
    await createBlog(page, 'Blog 1', 'Author 1', 'URL 1')
    await page.waitForTimeout(2000)
    await createBlog(page, 'Blog 2', 'Author 2', 'URL 2')
    await page.waitForTimeout(2000)
    await createBlog(page, 'Blog 3', 'Author 3', 'URL 3')
    await page.waitForTimeout(2000)
  })

  test('blog with most likes shows first', async ({ page}) => {
    const blog2 = await page.locator('text=Blog 2 by Author 2')
    await blog2.getByRole('button', { name: 'view'}).click()
    await page.getByRole('button', { name: 'Like'}).click()
    await page.getByRole('button', { name: 'Like'}).click()
    await page.getByRole('button', { name: 'Like'}).click()
    await page.getByRole('button', { name: 'hide'}).click()
    await page.waitForTimeout(2000)
    const elements = await page.$$('.blog')
    const expectedOrder = ['Blog 2 by Author 2 view', 'Blog 1 by Author 1 view', 'Blog 3 by Author 3 view']
    const actualOrder = await Promise.all(elements.map(async (element) => {
      return await element.textContent()
  }))
    expect(actualOrder).toEqual(expectedOrder)
})
      })
    