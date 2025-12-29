import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, ttl_seconds, max_views } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'content is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (ttl_seconds !== undefined) {
      if (typeof ttl_seconds !== 'number' || !Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return NextResponse.json(
          { error: 'ttl_seconds must be an integer >= 1' },
          { status: 400 }
        )
      }
    }

    if (max_views !== undefined) {
      if (typeof max_views !== 'number' || !Number.isInteger(max_views) || max_views < 1) {
        return NextResponse.json(
          { error: 'max_views must be an integer >= 1' },
          { status: 400 }
        )
      }
    }

    const now = new Date()
    const expiresAt = ttl_seconds ? new Date(now.getTime() + ttl_seconds * 1000) : null

    const paste = await prisma.paste.create({
      data: {
        content: content.trim(),
        expiresAt,
        maxViews: max_views ?? null,
        viewCount: 0,
      },
    })

    let baseUrl = 'http://localhost:3000'
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    } else {
      const url = new URL(request.url)
      if (url.hostname !== 'localhost') {
        baseUrl = `${url.protocol}//${url.host}`
      }
    }

    return NextResponse.json(
      {
        id: paste.id,
        url: `${baseUrl}/p/${paste.id}`,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

