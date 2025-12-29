import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isPasteUnavailable, getRemainingViews } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testMode = process.env.TEST_MODE === '1'
    const testNowMs = request.headers.get('x-test-now-ms') || undefined

    const paste = await prisma.paste.findUnique({
      where: { id: params.id },
    })

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 })
    }

    if (isPasteUnavailable(paste.expiresAt, paste.maxViews, paste.viewCount, testMode, testNowMs)) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 })
    }

    const updatedPaste = await prisma.paste.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    })

    const remainingViews = getRemainingViews(updatedPaste.maxViews, updatedPaste.viewCount)

    return NextResponse.json({
      content: updatedPaste.content,
      remaining_views: remainingViews,
      expires_at: updatedPaste.expiresAt?.toISOString() || null,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Paste not found' }, { status: 404 })
  }
}

