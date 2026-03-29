import { Button } from 'dazo'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Component Library</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Button label='Text' variant='solid' size='lg' onPress={()=>{console.log("here")}}/>
    </div>
  )
}

export default App
