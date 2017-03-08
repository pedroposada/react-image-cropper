import React from 'react'
// import styles from './CoreLayout.sass'

export const CoreLayout = ({ children }) => (
  <div>
    {children}
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout
