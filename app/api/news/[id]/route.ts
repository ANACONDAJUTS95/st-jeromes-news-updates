import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Verify Authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;

    if (!email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 2. Verify Admin Status in Firestore
    const adminDoc = await adminDb.collection('admins').doc(email).get();
    if (!adminDoc.exists || adminDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Delete Article from Firestore
    await adminDb.collection('articles').doc(id).delete();

    return NextResponse.json({ success: true, message: `Article ${id} deleted successfully.` });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete article' },
      { status: 500 }
    );
  }
}
