/*  POST /api/revalidate   { "path": "/deals" }  + header x-revalidate-secret
 *
 *  The CRM calls this when a deal changes. The affected page rebuilds within
 *  seconds — no redeploy, no developer. This is what lets marketing change a
 *  price without touching code.
 */
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export const runtime = 'nodejs'

export async function POST(req) {
  let body = {}
  try { body = await req.json() } catch {}
  const given = req.headers.get('x-revalidate-secret') || body.secret
  if (!process.env.REVALIDATE_SECRET || given !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'unauthorised' }, { status: 401 })
  }
  const paths = body.paths || [body.path || '/deals']
  paths.forEach(p => revalidatePath(p))
  return NextResponse.json({ ok: true, revalidated: paths, at: Date.now() })
}
