'use client'

import { useState } from 'react'

export default function Home() {
  const [content, setContent] = useState('')
  const [ttlSeconds, setTtlSeconds] = useState('')
  const [maxViews, setMaxViews] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ id: string; url: string } | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const body: any = { content }
      if (ttlSeconds) {
        body.ttl_seconds = parseInt(ttlSeconds, 10)
      }
      if (maxViews) {
        body.max_views = parseInt(maxViews, 10)
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create paste')
        return
      }

      setResult(data)
      setContent('')
      setTtlSeconds('')
      setMaxViews('')
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Pastebin-Lite</h1>
      <p>Create a paste and share it with a link</p>
      <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
        Paste any text here: code snippets, notes, links, messages, etc.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Content <span style={{ color: 'red' }}>*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            placeholder="Paste your text here... Examples:&#10;- Code snippets&#10;- Notes or messages&#10;- Links (https://example.com)&#10;- Any text you want to share"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'monospace',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="ttl" style={{ display: 'block', marginBottom: '0.5rem' }}>
            TTL (seconds, optional)
          </label>
          <input
            id="ttl"
            type="number"
            value={ttlSeconds}
            onChange={(e) => setTtlSeconds(e.target.value)}
            min="1"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="maxViews" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Max Views (optional)
          </label>
          <input
            id="maxViews"
            type="number"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            min="1"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
          }}
        >
          {loading ? 'Creating...' : 'Create Paste'}
        </button>
      </form>

      {error && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c00',
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#efe',
            border: '1px solid #cfc',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Paste created!</p>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>URL:</strong>{' '}
            <a href={result.url} style={{ color: '#0070f3' }}>
              {result.url}
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

