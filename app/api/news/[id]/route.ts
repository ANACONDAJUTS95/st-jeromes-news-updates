import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

const EDITABLE_FIELDS = [
  'title', 'slug', 'excerpt', 'content', 'category', 'image', 'timestamp',
] as const;

async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const idToken = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  const email = decodedToken.email;

  if (!email) {
    return { error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) };
  }

  const adminDoc = await adminDb.collection('admins').doc(email).get();
  if (!adminDoc.exists || adminDoc.data()?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { error: null };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireAdmin(request);
    if (error) return error;

    const body = await request.json();
    const updates: Record<string, unknown> = {};
    for (const field of EDITABLE_FIELDS) {
      if (field in body) updates[field] = body[field];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No editable fields provided' }, { status: 400 });
    }

    if (typeof updates.timestamp === 'string' && isNaN(Date.parse(updates.timestamp))) {
      return NextResponse.json({ error: 'Invalid timestamp' }, { status: 400 });
    }

    const docRef = adminDb.collection('articles').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await docRef.update(updates);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, id, updates });
  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireAdmin(request);
    if (error) return error;

    await adminDb.collection('articles').doc(id).delete();
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: `Article ${id} deleted successfully.` });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete article' },
      { status: 500 }
    );
  }
}
