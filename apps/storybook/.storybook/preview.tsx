import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from 'dazo-ui'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider colorScheme="system">
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview