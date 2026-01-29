import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-2">
      <h3>Welcome to Patchies Goodies!</h3>
      <p>This is a static site built with TanStack Start.</p>
    </div>
  )
}
