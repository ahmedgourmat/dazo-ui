import { Checkbox, FileInput, Icon, Input, RadioGroup, Select, Text } from 'dazo-ui'
import { useState } from 'react'
import { ShowcaseSection } from '../components/ShowcaseSection'

const formCode = `import { Checkbox, FileInput, Icon, Input, RadioGroup, Select } from 'dazo-ui'

<Input placeholder='name@company.com' value={email} onChangeText={setEmail} />
<Select value={plan} onChange={setPlan} options={[{ label: 'Pro', value: 'pro' }]} />
<RadioGroup value={role} onChange={setRole} options={[{ label: 'Admin', value: 'admin' }]} />
<Checkbox label='Remember me' checked={rememberMe} onChange={setRememberMe} />
<FileInput multiple accept='image/*,application/pdf' onFilesSelected={(files) => {}} />`

export const FormSection = () => {
  const [email, setEmail] = useState('')
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [selectedRole, setSelectedRole] = useState('admin')
  const [rememberMe, setRememberMe] = useState(false)
  const [newsletter, setNewsletter] = useState(true)
  const [policyAccepted, setPolicyAccepted] = useState(false)
  const [pickedFileNames, setPickedFileNames] = useState('')

  return (
    <ShowcaseSection
      title='Inputs, Checklist, Select, Radio, File Input'
      subtitle='Interactive form controls with controlled state and visual variants.'
      codeTitle='form-controls.tsx'
      code={formCode}
    >
      <Input
        placeholder='name@company.com'
        value={email}
        onChangeText={setEmail}
        leftIcon={<Icon name='Mail' size={16} />}
        marginBottom='sm'
      />

      <Input
        placeholder='Search by keyword'
        variant='outline'
        value={search}
        onChangeText={setSearch}
        leftIcon={<Icon name='Search' size={16} />}
        rightIcon={<Icon name='SlidersHorizontal' size={16} />}
        marginBottom='sm'
      />

      <Input
        placeholder='Write quick notes...'
        variant='ghost'
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        marginBottom='md'
      />

      <Checkbox
        label='Remember me'
        checked={rememberMe}
        onChange={setRememberMe}
        marginBottom='xs'
      />
      <Checkbox
        label='Subscribe to newsletter'
        checked={newsletter}
        onChange={setNewsletter}
        icon={<Icon name='Bell' size={16} />}
        marginBottom='xs'
      />
      <Checkbox
        label='I agree to privacy policy'
        checked={policyAccepted}
        onChange={setPolicyAccepted}
        marginBottom='md'
      />

      <Select
        label='Plan'
        value={selectedPlan}
        onChange={setSelectedPlan}
        options={[
          { label: 'Starter Plan', value: 'starter', icon: <Icon name='Leaf' size={16} /> },
          { label: 'Pro Plan', value: 'pro', icon: <Icon name='Zap' size={16} /> },
          { label: 'Enterprise', value: 'enterprise', icon: <Icon name='Building2' size={16} /> },
          { label: 'Enterprise', value: 'enterprise', icon: <Icon name='Building2' size={16} /> },
          { label: 'Enterprise', value: 'enterprise', icon: <Icon name='Building2' size={16} /> },
          { label: 'Enterprise', value: 'enterprise', icon: <Icon name='Building2' size={16} /> },
          { label: 'Enterprise', value: 'enterprise', icon: <Icon name='Building2' size={16} /> },
          { label: 'Enterprise', value: 'enterprise', icon: <Icon name='Building2' size={16} /> },
          { label: 'Enterprise', value: 'enterprise', icon: <Icon name='Building2' size={16} /> },
          { label: 'Enterprise', value: 'enterprise', icon: <Icon name='Building2' size={16} /> },
          { label: 'Pro Plan', value: 'pro', icon: <Icon name='Zap' size={16} /> },

        ]}
        leftIcon={<Icon name='Layers' size={16} />}
        marginBottom='md'
      />

      <RadioGroup
        value={selectedRole}
        onChange={setSelectedRole}
        direction='row'
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'Editor', value: 'editor' },
          { label: 'Viewer', value: 'viewer' },
        ]}
      />

      <FileInput
        label='Upload Files'
        placeholder='Select one or more files'
        accept='image/*,application/pdf'
        multiple
        leftIcon={<Icon name='Upload' size={16} />}
        rightIcon={<Icon name='Upload' size={16} />}
        onFilesSelected={(files) => {
          setPickedFileNames(files.map((file) => file.name).join(', '))
        }}
        marginTop='md'
        marginBottom='sm'
      />

      <Text variant='caption'>
        Last file event: {pickedFileNames || 'No files selected yet'}
      </Text>
    </ShowcaseSection>
  )
}
