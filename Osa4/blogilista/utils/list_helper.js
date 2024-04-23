const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const total = blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
  console.log('total likes:', total)
  return total
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  const maxLikes = blogs.reduce((max, blog) => 
    Math.max(max, blog.likes), blogs[0].likes)
  
  const favorite = blogs.find(blog =>
    blog.likes === maxLikes)
    console.log('favorite blog:', {title: favorite.title, author: favorite.author, likes: favorite.likes })
    return {title: favorite.title, author: favorite.author, likes: favorite.likes }
  }

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  const blogsByAuthor = lodash.groupBy(blogs, 'author')
  const blogsCount = lodash.map(blogsByAuthor, (blogs, author) => ({
    author,
    blogs: blogs.length
  }))

  const maxBlogs = lodash.maxBy(blogsCount, 'blogs').blogs
  const most = lodash.find(blogsCount, { 'blogs': maxBlogs})

  console.log('most blogs:', most)
  return most

}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const likesByAuthor = lodash.mapValues(lodash.groupBy(blogs, 'author'), authorBlogs =>
    lodash.sumBy(authorBlogs, 'likes'))

  const mostLikedAuthor = lodash.maxBy(lodash.keys(likesByAuthor), author => likesByAuthor[author])

  console.log('most likes:', {author: mostLikedAuthor, likes: likesByAuthor[mostLikedAuthor]})
  return { author: mostLikedAuthor, likes: likesByAuthor[mostLikedAuthor]}
}
  
  module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }

