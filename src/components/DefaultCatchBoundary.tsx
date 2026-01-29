import { Link, useRouter } from '@tanstack/react-router'
import { ErrorComponent } from '@tanstack/react-router'

export function DefaultCatchBoundary(props: Parameters<typeof ErrorComponent>[0]) {
  const router = useRouter()
  const isNotFound = props.error?.message === 'Not Found'

  if (isNotFound) {
    return (
      <div className="p-2">
        <h3>Not Found</h3>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="p-2">
      <h3>Something went wrong!</h3>
      <p>{String(props.error?.message || 'Unknown error')}</p>
      <button onClick={() => router.invalidate()}>Try again</button>
    </div>
  )
}
