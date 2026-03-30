import { Button, Container } from 'dazo'

const TestingButtons = () => {
    return (
        <Container
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Button variant='solid' size='md' label='Solid' onPress={() => { console.log("solid,md") }} fullWidth={true} style={{backgroundColor : 'red'}}/>
            <Button variant='outline' size='md' label='Outline' onPress={() => { console.log("outline,md") }} fullWidth={false}/>
            <Button variant='ghost' size='md' label='Ghost' onPress={() => { console.log("Ghost,md") }} fullWidth={false}/>
            <Button size='sm' label='Small'  onPress={() => { console.log("solid,sm") }} fullWidth={false}/>
            <Button size='md' label='Medium' onPress={() => { console.log("solid,md") }} fullWidth={false}/>
            <Button size='lg' label='Large' onPress={() => { console.log("solid,lg") }} fullWidth={false}/>
            <Button label='Disabled' disabled onPress={() => { console.log("Disabled") }} fullWidth={false}/>
            <Button label='Loading' loading onPress={() => { console.log("Loading") }} fullWidth={false} style={{alignSelf: 'flex-start'}}/>
        </Container>
    )
}

export default TestingButtons
