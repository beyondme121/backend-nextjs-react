import React, { useState, useEffect } from 'react'

function Counter () {
  const [counter, setCounter] = useState(0)
  useEffect(() => {
    document.title = `you click ${counter} times`
  })

  useEffect( () => {
    function log (status) {
      console.log("status", status)
    }
    log('inline')
    return () => {
      log('offline')
    }
  })
  return (
    <div>
      <p>you click {counter} times</p>
      <button onClick={ () => setCounter(counter + 1)}>
        click me
      </button>
    </div>
  )
}

export default Counter