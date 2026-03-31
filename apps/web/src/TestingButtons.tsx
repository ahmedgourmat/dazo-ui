import { Button, Container } from 'dazo'

const TestingButtons = () => {
    return (
        <Container
            backgroundColor='red'
            margin='xxl'
            padding='xxl'
            paddingTop='sm'
            scrollable
        >
            <Button label='solid' padding={20}/>
            <Button variant='outline'  padding={20} size='md' label='Outline' onPress={() => { console.log("outline,md") }} fullWidth={false}/>
            <Button variant='ghost'  padding={20} size='md' label='Ghost' onPress={() => { console.log("Ghost,md") }} fullWidth={false}/>
            <Button size='sm'  padding={20} label='Small'  onPress={() => { console.log("solid,sm") }} fullWidth={false}/>
            <Button size='md'  padding={20} label='Medium' onPress={() => { console.log("solid,md") }} fullWidth={false}/>
            <Button size='lg'  padding={20} label='Large' onPress={() => { console.log("solid,lg") }} fullWidth={false}/>
            <Button label='Disabled'  padding={20} disabled onPress={() => { console.log("Disabled") }} fullWidth={false}/>
            <Button label='Loading'  padding={20} loading onPress={() => { console.log("Loading") }} fullWidth={false} style={{alignSelf: 'flex-start'}}/>
        </Container>
    )
}

export default TestingButtons
