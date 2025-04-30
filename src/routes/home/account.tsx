import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/account')({
  component: () => <div>Hello /home/account!</div>
})