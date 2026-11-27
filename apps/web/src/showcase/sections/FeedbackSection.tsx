import { Avatar, Badge, Container, Divider, FormField, Progress, Skeleton, Spinner, Switch, Textarea } from 'dazo-ui'
import { useState } from 'react'
import { ShowcaseSection } from '../components/ShowcaseSection'

const code = `import { Avatar, Badge, Divider, FormField, Progress, Skeleton, Spinner, Switch, Textarea } from 'dazo-ui'

<Avatar name='Ada Lovelace' />
<Badge tone='success'>Paid</Badge>
<Badge tone='warning' variant='subtle'>Pending</Badge>
<FormField label='About you' helperText='A few words for your profile'>
  <Textarea placeholder='Tell us about yourself' rows={3} maxRows={6} maxLength={280} showCount />
</FormField>
<Switch label='Push notifications' defaultChecked />
<Divider label='or' />
<Progress value={65} label='Upload' />
<Progress label='Syncing' />
<Spinner />

<Skeleton loading={isLoading}>…any of the above…</Skeleton>`

export const FeedbackSection = () => {
  const [loading, setLoading] = useState(false)

  return (
    <ShowcaseSection
      title='FormField, Textarea, Switch, Avatar, Badge, Divider, Progress, Spinner, Skeleton'
      subtitle='Display, feedback and the remaining everyday form controls.'
      codeTitle='feedback.tsx'
      code={code}
    >
      <Switch label='Show as loading (Skeleton)' checked={loading} onChange={setLoading} marginBottom='md' />
      <Skeleton loading={loading}>
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
          <FormField label='About you' helperText='A few words for your profile'>
            <Textarea placeholder='Tell us about yourself' rows={3} maxRows={6} maxLength={280} showCount />
          </FormField>
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
      </Skeleton>
    </ShowcaseSection>
  )
}
