import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    // 1. Verify Authentication
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

    const GITHUB_PAT = process.env.GITHUB_PAT;
    const GITHUB_OWNER = 'ANACONDAJUTS95';
    const GITHUB_REPO = 'st-jeromes-news-updates';

    if (!GITHUB_PAT) {
      return NextResponse.json(
        { error: 'Server misconfiguration: Missing GitHub PAT' },
        { status: 500 }
      );
    }

    // Trigger the GitHub Action via repository_dispatch
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${GITHUB_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'sync-news',
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API Error:', errorText);
      return NextResponse.json(
        { error: `Failed to trigger action: ${response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: 'Sync triggered successfully' });
  } catch (error: any) {
    console.error('Error in trigger-sync:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
