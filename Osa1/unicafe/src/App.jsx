import { useState } from 'react'


const Header = ({header}) => {
  return (
    <div>
      <h1>{header}</h1>
    </div>
  )
}

const StatisticLine = ({text, value}) => {
  return (
  <div>
    <table>
      <tbody>
        <tr>
          <td style={{width: '50px'}}>{text}</td> 
          <td>{value}</td>
        </tr>
      </tbody>
    </table>
  </div>
  )
}

const Statistics = (props) => {
  console.log(props)
  if (props.allClicks.length === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  const average = (props.good - props.bad) / (props.allClicks.length || 1)
  const positive = (props.good / (props.allClicks.length || 1)) * 100
  return (
    <div>
      <StatisticLine text="good" value ={props.good} />
      <StatisticLine text="neutral" value ={props.neutral} />
      <StatisticLine text="bad" value ={props.bad} />
      <StatisticLine text="all" value ={props.allClicks.length} />
      <StatisticLine text="average" value ={average} />
      <StatisticLine text="positive" value ={positive + "%"} />

    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  // tallenna napit omaan tilaansa
  const header = 'give feedback'
  const header2 = 'statistics'
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    setAll(allClicks.concat(allClicks.length + 1))
  }
  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setAll(allClicks.concat(allClicks.length + 1))
  }
  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    setAll(allClicks.concat(allClicks.length + 1))
  }

  return (
    <div>
      <div>
        <Header header={header} />
        <Button handleClick={handleGoodClick} text='good' />
        <Button handleClick={handleNeutralClick} text='neutral' />
        <Button handleClick={handleBadClick} text='bad' />
        <Header header={header2} />
        <Statistics good={good} neutral={neutral} bad={bad} allClicks={allClicks} />
      </div>
    </div>
  )
}

export default App
