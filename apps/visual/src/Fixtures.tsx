import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Container,
  Divider,
  FileInput,
  FormField,
  Input,
  Progress,
  RadioGroup,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Table,
  Text,
  Textarea,
  type Tone,
} from 'dazo-ui'
import type { ReactNode } from 'react'

// Every component in every state that changes how it looks. Each section is
// one screenshot (its testID becomes data-testid on the web). Values are fixed
// and nothing depends on time or the network, so the page never changes on its own.

const Section = ({ id, title, children }: { id: string; title: string; children: ReactNode }) => (
  <Container testID={id} width={760} padding='lg' gap='md' marginBottom='md'>
    <Text variant='caption'>{title}</Text>
    {children}
  </Container>
)

const Row = ({ children }: { children: ReactNode }) => (
  <Container flexDirection='row' flexWrap='wrap' alignItems='center' gap='sm'>
    {children}
  </Container>
)

const arrow = <Text color='inherit'>→</Text>
const plans = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Legacy', value: 'legacy', disabled: true },
]
const tones: Tone[] = ['neutral', 'danger', 'success', 'warning', 'info']
const members = [
  { name: 'Ada Lovelace', role: 'Admin', status: 'Active' },
  { name: 'Alan Turing', role: 'Editor', status: 'Invited' },
  { name: 'Grace Hopper', role: 'Viewer', status: 'Active' },
]
const columns = [
  { key: 'name' as const, title: 'Name' },
  { key: 'role' as const, title: 'Role' },
  { key: 'status' as const, title: 'Status' },
]

export const Fixtures = () => (
  <>
    <Section id='buttons' title='Button'>
      <Row>
        <Button label='Solid' />
        <Button label='Secondary' variant='secondary' />
        <Button label='Outline' variant='outline' />
        <Button label='Ghost' variant='ghost' />
      </Row>
      <Row>
        <Button label='Small' size='sm' />
        <Button label='Medium' size='md' />
        <Button label='Large' size='lg' />
        <Button label='Extra large' size='xl' />
      </Row>
      <Row>
        <Button label='Disabled' disabled />
        <Button label='Disabled' variant='outline' disabled />
        <Button label='Saving' loading />
        <Button label='Continue' rightIcon={arrow} />
      </Row>
      <Button label='Full width' fullWidth />
      <Row>
        <Button testID='focus-target' label='Keyboard focus' variant='outline' />
        <Button testID='hover-target' label='Hovered' variant='secondary' />
      </Row>
    </Section>

    <Section id='text' title='Text'>
      <Text variant='title'>Title</Text>
      <Text variant='subtitle'>Subtitle</Text>
      <Text>Default body text</Text>
      <Text variant='caption'>Caption</Text>
      <Row>
        {(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const).map((size) => (
          <Text key={size} size={size}>
            Aa
          </Text>
        ))}
      </Row>
      <Row>
        <Text color='foregroundMuted'>Muted</Text>
        <Text color='success'>Success</Text>
        <Text color='warning'>Warning</Text>
        <Text color='danger'>Danger</Text>
      </Row>
      <Container maxWidth={320}>
        <Text lines={2}>
          A long paragraph that is clamped to two lines, so the rest of this sentence is cut with an
          ellipsis instead of pushing the layout down.
        </Text>
      </Container>
    </Section>

    <Section id='inputs' title='Input and Textarea'>
      <Input placeholder='Solid (default)' />
      <Input variant='outline' placeholder='Outline' />
      <Input variant='ghost' placeholder='Ghost' />
      <Input value='ada@example.com' />
      <Input value='not-an-email' invalid />
      <Input value='Disabled' editable={false} />
      <Row>
        <Input size='sm' placeholder='sm' width={160} />
        <Input size='lg' placeholder='lg' width={160} />
        <Input size='xl' placeholder='xl' width={160} />
      </Row>
      <Textarea placeholder='Tell us about yourself' rows={3} maxLength={280} showCount />
      <Textarea value='Too long' invalid rows={2} />
    </Section>

    <Section id='choices' title='Checkbox, RadioGroup and Switch'>
      <Row>
        <Checkbox label='Unchecked' />
        <Checkbox label='Checked' defaultChecked />
        <Checkbox label='Disabled' disabled />
        <Checkbox label='Disabled, checked' defaultChecked disabled />
      </Row>
      <RadioGroup direction='row' options={plans} defaultValue='pro' />
      <RadioGroup options={plans} defaultValue='starter' disabled />
      <Container gap='sm' width={320}>
        <Switch label='Off' />
        <Switch label='On' defaultChecked />
        <Switch label='Disabled' disabled />
        <Switch label='Small, label after' size='sm' labelPosition='end' defaultChecked />
      </Container>
    </Section>

    <Section id='select-file' title='Select and FileInput'>
      <Select testID='select-target' label='Plan' options={plans} />
      <Select options={plans} defaultValue='pro' />
      <Select label='Plan' options={plans} defaultValue='pro' disabled />
      <FileInput label='Attachment' />
      <FileInput label='Attachment' value='report.pdf' onClear={() => {}} />
      <FileInput label='Attachment' disabled />
    </Section>

    <Section id='form-field' title='FormField'>
      <FormField label='Email' helperText='We never share it.'>
        <Input placeholder='you@example.com' />
      </FormField>
      <FormField label='Email' error='Enter a valid email address.' required>
        <Input value='ada@' />
      </FormField>
      <FormField label='Plan' disabled>
        <Select options={plans} defaultValue='pro' />
      </FormField>
    </Section>

    <Section id='table' title='Table'>
      <Table columns={columns} data={members} horizontalScroll={false} />
      <Table columns={columns} data={[]} emptyText='No members yet' horizontalScroll={false} />
    </Section>

    <Section id='status' title='Badge, Avatar, Divider, Progress and Spinner'>
      {(['solid', 'subtle', 'outline'] as const).map((variant) => (
        <Row key={variant}>
          {tones.map((tone) => (
            <Badge key={tone} tone={tone} variant={variant}>
              {tone}
            </Badge>
          ))}
        </Row>
      ))}
      <Row>
        <Avatar name='Ada Lovelace' size='xl' />
        <Avatar name='Alan Turing' size='lg' />
        <Avatar name='Grace Hopper' />
        <Avatar name='Plato' size='sm' shape='rounded' />
        <Avatar name='Euclid' size='xs' />
      </Row>
      <Divider />
      <Divider label='or' />
      <Container flexDirection='row' height={24} gap='md' alignItems='center'>
        <Text>Left</Text>
        <Divider orientation='vertical' />
        <Text>Right</Text>
      </Container>
      <Progress value={0} label='Empty' />
      <Progress value={40} label='Upload' />
      <Progress value={100} tone='success' label='Done' />
      <Progress value={60} tone='danger' size='sm' />
      <Row>
        <Spinner size='sm' />
        <Spinner />
        <Spinner size='lg' />
      </Row>
    </Section>

    <Section id='skeleton' title='Skeleton'>
      <Skeleton loading>
        <Container gap='md' width={360}>
          <Container flexDirection='row' gap='sm' alignItems='center'>
            <Avatar name='Ada Lovelace' size='lg' />
            <Container gap='xs'>
              <Text variant='subtitle'>Ada Lovelace</Text>
              <Text variant='caption'>ada@example.com</Text>
            </Container>
          </Container>
          <Badge tone='success'>Active</Badge>
          <Input value='Ada Lovelace' />
          <Switch label='Email notifications' defaultChecked />
          <Button label='Save changes' />
        </Container>
      </Skeleton>
      <Row>
        <Skeleton circle size={48} />
        <Skeleton width={160} height={20} />
      </Row>
      <Skeleton lines={3} />
    </Section>

    <Section id='surfaces' title='Container: surfaces, radius and shadow'>
      <Row>
        {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((shadow) => (
          <Container key={shadow} width={96} height={64} borderRadius='lg' backgroundColor='surface' shadow={shadow} alignItems='center' justifyContent='center'>
            <Text variant='caption'>{shadow}</Text>
          </Container>
        ))}
      </Row>
      <Row>
        {(['background', 'surface', 'surfaceMuted', 'surfaceElevated', 'primary'] as const).map((color) => (
          <Container key={color} width={120} height={48} borderRadius='md' borderWidth='thin' borderColor='border' backgroundColor={color} />
        ))}
      </Row>
    </Section>
  </>
)
