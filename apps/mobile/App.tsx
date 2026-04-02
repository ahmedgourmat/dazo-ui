import { View, StyleSheet, ScrollView } from 'react-native'
import { Button, Checkbox, Container, FileInput, Icon, RadioGroup, Select, Table, Text, ThemeProvider } from 'dazo'
import { ButtonTest } from './ButtonTest'
import { useState } from 'react'

export default function App(): React.JSX.Element {
  const [selectedOption, setSelectedOption] = useState('option1')
  const tableData = [
    { id: '1', name: 'Amina', role: 'Admin', score: 98, status: 'Active', testing: 50 },
    { id: '2', name: 'Omar', role: 'Editor', score: 84, status: 'Pending' },
    { id: '3', name: 'Sara', role: 'Viewer', score: 76, status: 'Inactive', testing: 50 },
  ]


  const [rememberMe, setRememberMe] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  return (
    <ThemeProvider colorScheme='system'>
      <Container scrollable padding={20} paddingBottom={40}>
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
            {
              key: 'testing',
              title: 'Score',
              width: 100,
              align: 'right',
              render: (value) => `${value as number}%`,
            },
          ]}
          data={tableData}
          keyExtractor={(row) => row.id}
          emptyText='No users found'
          striped
          backgroundColor='red'
          horizontalScroll
          style={{ borderRadius: 16 }}
          headerStyle={{ backgroundColor: '#eef2ff' }}
          rowStyle={{ minHeight: 52 }}
          cellTextStyle={{ fontSize: 13 }}
          marginVertical={10}
        />
        <Checkbox
          label='Remember me'
          checked={rememberMe}
          onChange={setRememberMe}
          checkedColor='#3b82f6'
          checkmarkColor='white'
          marginVertical={10}
          textColor='red'
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
        <ButtonTest />
        <ButtonTest />
        <Text
          letters={80}
          marginBottom={20}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          venenatis, dolor in finibus malesuada, lectus ipsum porta nunc, at
          iaculis arcu nisi sed mauris. Nulla fermentum vestibulum ex, eget
          tristique tortor pretium ut. Curabitur elit justo, consequat id
          condimentum ac, volutpat ornare.
        </Text>
      </Container>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})