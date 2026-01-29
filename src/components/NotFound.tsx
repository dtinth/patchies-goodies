import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="p-2">
      <h3>404 - Page Not Found</h3>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Back to Home</Link>
    </div>
  )
}
