import { prisma } from '@/lib/prisma'
import { isPasteUnavailable } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

export default async function PastePage({ params }: { params: { id: string } }) {
  const testMode = process.env.TEST_MODE === '1'
  const headersList = await headers()
  const testNowMs = headersList.get('x-test-now-ms') || undefined

  const paste = await prisma.paste.findUnique({
    where: { id: params.id },
  })

  if (!paste) {
    notFound()
  }

  if (isPasteUnavailable(paste.expiresAt, paste.maxViews, paste.viewCount, testMode, testNowMs)) {
    notFound()
  }

  await prisma.paste.update({
    where: { id: params.id },
    data: { viewCount: { increment: 1 } },
  })

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Paste</h1>
      <pre
        style={{
          background: '#f5f5f5',
          padding: '1rem',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {paste.content}
      </pre>
    </div>
  )
}

