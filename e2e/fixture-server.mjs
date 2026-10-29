import { createServer } from 'node:http'
import { profile } from '../packages/content/src/profile.ts'

// Test-only transport fixture, never imported by application code. Unknown reads
// and all writes fail instead of silently succeeding or reaching a live service.
const row = {
  id: 'main',
  username: 'yusufyilmz',
  is_public: true,
  document: profile,
  revision: 1,
  updated_at: '2026-01-01T00:00:00Z'
}
createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:3101')
  response.setHeader('Content-Type', 'application/json')
  if (request.method !== 'GET') {
    response
      .writeHead(405)
      .end(JSON.stringify({ message: 'Read only fixture' }))
    return
  }
  if (url.pathname === '/health') {
    response.end('{}')
    return
  }
  if (url.pathname === '/rest/v1/portfolio_profiles') {
    const found =
      url.searchParams.get('id') === 'eq.main' ||
      url.searchParams.get('username') === 'eq.yusufyilmz'
    response.end(JSON.stringify(found ? row : null))
    return
  }
  if (url.pathname === '/rest/v1/referrals') {
    response.end('[]')
    return
  }
  response
    .writeHead(404)
    .end(JSON.stringify({ message: 'Unknown fixture route' }))
}).listen(3101, '127.0.0.1')
