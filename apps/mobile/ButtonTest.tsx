import { View, Text } from 'react-native'
import { Button } from 'dazo'

export const ButtonTest = () :React.JSX.Element => {
  return (
    <View style={{ gap: 12 }}>

      <Text>Variants</Text>
      <Button variant='solid'   size='md' label='Solid'   onPress={() => {console.log("solid,md")}} fullWidth={true} />
      <Button variant='outline' size='md' label='Outline' onPress={() => {console.log("outline,md")}} />
      <Button variant='ghost'   size='md' label='Ghost'   onPress={() => {console.log("Ghost,md")}} />

      <Text>Sizes</Text>
      <Button size='sm' label='Small'  onPress={() => {console.log("solid,sm")}} style={{}} />
      <Button size='md' label='Medium' onPress={() => {console.log("solid,md")}} />
      <Button size='lg' label='Large'  onPress={() => {console.log("solid,lg")}} />

      <Text>States</Text>
      <Button label='Disabled' disabled onPress={() => {console.log("Disabled")}} />
      <Button label='Loading'  loading  onPress={() => {console.log("Loading")}} />

    </View>
  )
}