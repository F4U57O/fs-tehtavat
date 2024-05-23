import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Container, Button } from 'react-bootstrap'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <Container>
      <div>
        <div style={hideWhenVisible}>
          <Button variant="secondary" onClick={toggleVisibility}>
            {props.buttonLabel}
          </Button>
        </div>
        <div style={showWhenVisible} className="togglableContent">
          {props.children}
          <Button variant="secondary" onClick={toggleVisibility}>
            cancel
          </Button>
        </div>
      </div>
    </Container>
  )
})
Togglable.displayName = 'Togglable'

export default Togglable
