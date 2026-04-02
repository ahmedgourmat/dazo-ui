import { Button, Checkbox, Container, FileInput, Icon, Input, RadioGroup, Select, Table } from 'dazo'
import { useState } from 'react'

const TestingButtons = () => {

    const [selectedOption, setSelectedOption] = useState('option1')
    const [rememberMe, setRememberMe] = useState(false)
    const [agreeTerms, setAgreeTerms] = useState(false)
    const tableData = [
        { id: '1', name: 'Amina', role: 'Admin', score: 98, status: 'Active' },
        { id: '2', name: 'Omar', role: 'Editor', score: 84, status: 'Pending' },
        { id: '3', name: 'Sara', role: 'Viewer', score: 76, status: 'Inactive' },
    ]

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
            {/* <RadioGroup
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
            /> */}
            <Table
                columns={[
                    {
                        key: 'name',
                        title: 'Name',
                        width: 140,
                        align: 'left',
                    },
                    {
                        key: 'role',
                        title: 'Role',
                        flex: 1,
                        align: 'center',
                    },
                    {
                        key: 'score',
                        title: 'Score',
                        width: 100,
                        align: 'right',
                        render: (value) => `${value as number}%`,
                    },
                    {
                        key: 'status',
                        title: 'Status',
                        width: 140,
                        align: 'center',
                        render: (value) => value === 'Active' ? 'Online' : String(value),
                    },
                ]}
                data={tableData}
                keyExtractor={(row) => row.id}
                emptyText='No users found'
                stripedRow
                rowColor="#22c55e"
                rowStripeOpacity={0.18}
                stripedColumn
                columnColor="#3b82f6"
                columnStripeOpacity={0.08}
                horizontalScroll
                style={{ borderRadius: 16 }}
                headerStyle={{ backgroundColor: '#eef2ff' }}
                rowStyle={{ minHeight: 52 }}
                cellTextStyle={{ fontSize: 13 }}
                marginVertical={10}
            />
            <FileInput
                label='file testing'
                placeholder=''
                multiple={true}
                accept='image/*'
                labelStyle={{ color: 'red' }}
                rightIcon={<Icon name="ActivityIcon" color='blue' />}
            />
            <Select
                label='select here'
                options={[
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                    { label: 'Option 3', value: 'option3' },
                    { label: 'Option 4', value: 'option4', icon: <Icon name="ActivityIcon" color='blue' /> },
                ]}
                value={selectedOption}
                onChange={setSelectedOption}
                rightIcon={<Icon name="ActivityIcon" color='blue' />}
            />
            <Input textColor='red' variant='solid' marginVertical={20} placeholderTextColor='grey' placeholder='here is another placeholder' backgroundColor='#245242' />
            
            {/* Checkbox Examples */}
            <Checkbox
                label='Remember me'
                checked={rememberMe}
                onChange={setRememberMe}
                checkedColor='#3b82f6'
                uncheckedColor='red'
                checkmarkColor='white'
                marginVertical={10}
            />
            <Checkbox
                label='I agree to the terms and conditions'
                checked={agreeTerms}
                onChange={setAgreeTerms}
                checkedColor='#22c55e'
                checkmarkColor='white'
                marginVertical={10}
            />
            <Checkbox
                label='Disabled checkbox'
                checked={false}
                disabled
                marginVertical={10}
            />


            
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
