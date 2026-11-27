import { Avatar, Badge, Container, Divider, Progress, Spinner, Switch, Textarea } from 'dazo-ui'
import { ShowcaseSection } from '../components/ShowcaseSection'

const code = `import { Avatar, Badge, Divider, Progress, Spinner, Switch, Textarea } from 'dazo-ui'

<Avatar name='Ada Lovelace' />
<Badge tone='success'>Paid</Badge>
<Badge tone='warning' variant='subtle'>Pending</Badge>
<Textarea placeholder='Tell us about yourself' rows={3} maxRows={6} maxLength={280} showCount />
<Switch label='Push notifications' defaultChecked />
<Divider label='or' />
<Progress value={65} label='Upload' />
<Progress label='Syncing' />
<Spinner />`

export const FeedbackSection = (): React.JSX.Element => {
  return (
    <ShowcaseSection
      title='Avatar, Badge, Textarea, Switch, Divider, Progress, Spinner'
      subtitle='Display, feedback and the remaining everyday form controls.'
      codeTitle='feedback.tsx'
      code={code}
    >
      <Container gap='md'>
        <Container flexDirection='row' gap='sm' alignItems='center'>
          <Avatar name='Ada Lovelace' size='lg' />
          <Avatar name='Alan Turing' />
          <Avatar name='Grace Hopper' size='sm' shape='rounded' />
          <Avatar name='Plato' size='xs' />
        </Container>
        <Container flexDirection='row' flexWrap='wrap' gap='sm'>
          <Badge>New</Badge>
          <Badge tone='danger'>Failed</Badge>
          <Badge tone='success'>Paid</Badge>
          <Badge tone='info'>Beta</Badge>
          <Badge tone='success' variant='subtle'>Active</Badge>
          <Badge tone='warning' variant='outline'>Pending</Badge>
        </Container>
        <Textarea placeholder='Tell us about yourself' rows={3} maxRows={6} maxLength={280} showCount />
        <Switch label='Push notifications' defaultChecked />
        <Switch label='Weekly digest' />
        <Divider label='or' />
        <Progress value={65} label='Upload' />
        <Progress label='Syncing' size='sm' />
        <Container flexDirection='row' gap='md' alignItems='center'>
          <Spinner size='sm' />
          <Spinner />
          <Spinner size='lg' />
        </Container>
      </Container>
    </ShowcaseSection>
  )
}
