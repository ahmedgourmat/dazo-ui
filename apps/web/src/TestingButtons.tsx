import { Button, Container, Icon, Input, RadioGroup } from 'dazo'
import { useState } from 'react'

const TestingButtons = () => {

    const [selectedOption, setSelectedOption] = useState('option1')

    return (
        <Container
            margin='xxl'
            padding='xxl'
            paddingTop='sm'
            scrollable
        >
            <Icon
                name="star"
                color="green"
                backgroundColor='green'
                size={10}
            />
            <RadioGroup
                textColor='green'
                circleColor='red'
                value={selectedOption}
                onChange={setSelectedOption}
                options={[
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                    { label: 'Option 3', value: 'option3' },
                    { label: 'Option 4', value: 'option4', icon: <Icon name="ActivityIcon" color='blue' /> },
                ]}
            />
            <Input textColor='red' variant='solid' marginVertical={20} placeholderTextColor='grey' placeholder='here is another placeholder' backgroundColor='#245242' />
            <Button label='solid' padding={20} leftIcon={<Icon name="ActivityIcon" />} rightIcon={<Icon name="ActivityIcon" />} />
            <Button variant='outline' padding={20} size='md' label='Outline' onPress={() => { console.log("outline,md") }} fullWidth={false} />
            <Button variant='ghost' padding={20} size='md' label='Ghost' onPress={() => { console.log("Ghost,md") }} fullWidth={false} />
            <Button size='sm' padding={20} label='Small' onPress={() => { console.log("solid,sm") }} fullWidth={false} />
            <Button size='md' padding={20} label='Medium' onPress={() => { console.log("solid,md") }} fullWidth={false} />
            <Button size='lg' padding={20} label='Large' onPress={() => { console.log("solid,lg") }} fullWidth={false} />
            <Button label='Disabled' padding={20} disabled onPress={() => { console.log("Disabled") }} fullWidth={false} />
            <Button label='Loading' padding={20} loading onPress={() => { console.log("Loading") }} fullWidth={false} style={{ alignSelf: 'flex-start' }} />
        </Container>
    )
}

export default TestingButtons
