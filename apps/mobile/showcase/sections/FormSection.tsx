import { Checkbox, FileInput, Icon, Input, RadioGroup, Select, Text } from 'dazo-ui'
import * as DocumentPicker from 'expo-document-picker'
import { useState } from 'react'
import { ShowcaseSection } from '../components/ShowcaseSection'

const code = `import { Checkbox, FileInput, Input, RadioGroup, Select } from 'dazo-ui'

<Input value={email} onChangeText={setEmail} />
<Select value={plan} onChange={setPlan} options={plans} />
<RadioGroup value={role} onChange={setRole} options={roles} />
<Checkbox label='Remember me' checked={rememberMe} onChange={setRememberMe} />
<FileInput multiple onFilesSelected={(files) => {}} />`

export const FormSection = (): React.JSX.Element => {
  const [email, setEmail] = useState('')
  const [search, setSearch] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [selectedRole, setSelectedRole] = useState('admin')
  const [rememberMe, setRememberMe] = useState(false)
  const [newsletter, setNewsletter] = useState(true)
  const [pickedFileNames, setPickedFileNames] = useState('')

  return (
    <ShowcaseSection
      title='Inputs + Checklist + Select + Radio + FileInput'
      subtitle='Interactive form controls with controlled states.'
      codeTitle='form-controls.tsx'
      code={code}
    >
      <Input
        placeholder='name@company.com'
        value={email}
        onChangeText={setEmail}
        leftIcon={<Icon name='Mail' color='#475569' size={16} />}
        marginBottom='sm'
      />

      <Input
        placeholder='Search by keyword'
        variant='outline'
        value={search}
        onChangeText={setSearch}
        leftIcon={<Icon name='Search' color='#475569' size={16} />}
        rightIcon={<Icon name='SlidersHorizontal' color='#475569' size={16} />}
        marginBottom='sm'
      />

      <Checkbox
        label='Remember me'
        checked={rememberMe}
        onChange={setRememberMe}
        textColor='red'
        checkedColor='green'
        uncheckedColor='red'
        checkmarkColor='blue'
        marginBottom='xs'
      />
      <Checkbox
        label='Subscribe to newsletter'
        checked={newsletter}
        onChange={setNewsletter}
        checkedColor='#059669'
        icon={<Icon name='Bell' size={16} color='#059669' />}
        marginBottom='md'
      />

      <Select
        label='Plan'
        value={selectedPlan}
        onChange={setSelectedPlan}
        options={[
          { label: 'Starter', value: 'starter', icon: <Icon name='Leaf' size={16} color='#166534' /> },
          { label: 'Pro', value: 'pro', icon: <Icon name='Zap' size={16} color='#1d4ed8' /> },
          { label: 'Enterprise', value: 'enterprise', icon: <Icon name='Building2' size={16} color='#7c2d12' /> },
        ]}
        leftIcon={<Icon name='Layers' size={16} color='#334155' />}
        marginBottom='md'
      />

      <RadioGroup
        value={selectedRole}
        onChange={setSelectedRole}
        direction='row'
        circleColor='#0ea5e9'
        textColor='#0f172a'
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'Editor', value: 'editor' },
          { label: 'Viewer', value: 'viewer' },
        ]}
      />

      <FileInput
        label='Upload files'
        placeholder='Select one or more files'
        accept='image/*,application/pdf'
        multiple
        rightIcon={<Icon name='Upload' size={16} color='#334155' />}
        customPicker={async () => {
          const result = await DocumentPicker.getDocumentAsync({
            multiple: true,
            type: ['image/*', 'application/pdf'],
          })
          if (result.canceled) return []
          return result.assets.map((asset) => ({
            name: asset.name,
            uri: asset.uri,
            size: asset.size,
            mimeType: asset.mimeType,
          }))
        }}
        onFilesSelected={(files) => {
          setPickedFileNames(files.map((file) => file.name).join(', '))
        }}
        marginTop='md'
        marginBottom='sm'
      />

      <Text variant='caption' color='#64748b'>
        Last file event: {pickedFileNames || 'No files selected yet'}
      </Text>
    </ShowcaseSection>
  )
}
