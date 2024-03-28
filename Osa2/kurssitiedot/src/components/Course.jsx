const Header = ({course}) => {
    console.log(course)
    return (
      <div>
        <h2>{course.name}</h2>
      </div>
    )
  }
  
  const Part = ({part}) => (
    <p>
      {part.name} {part.exercises}
    </p>
  )
  
  
  const Content = ({parts}) => (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
  
  
  const Total = ({parts}) => {
    console.log(parts)
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <div>
        <b>Total of {total} exercises</b>
      </div>
    )
  }
  
  const Course = ({ course }) => {
      console.log(course)
      return (
        <div>
          <Header course={course} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
        </div>
      )
    }      
export default Course 