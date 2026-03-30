import { Button, Container } from 'dazo'
import React from 'react'

const TestingContainer = () => {
  return (
    <Container
        paddingHorizontal="md"
        paddingVertical="lg"
        backgroundColor="#f0f0f0"
        borderRadius="md"
        borderWidth={1}
        borderColor="#ccc"
        
    >
      <Button label='here'/>
    </Container>
  )
}

export default TestingContainer
