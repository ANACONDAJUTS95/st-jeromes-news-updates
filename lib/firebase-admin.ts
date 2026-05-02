import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccountVar) {
    try {
      const serviceAccount = JSON.parse(serviceAccountVar);
      if (serviceAccount.private_key) {
        // Fix for escaped newlines and missing headers
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        if (!serviceAccount.private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
          serviceAccount.private_key = `-----BEGIN PRIVATE KEY-----\n${serviceAccount.private_key}`;
        }
        if (!serviceAccount.private_key.endsWith('-----END PRIVATE KEY-----')) {
          serviceAccount.private_key = `${serviceAccount.private_key}\n-----END PRIVATE KEY-----`;
        }
      }
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error("Firebase Admin initialization error:", error);
    }
  } else {
    // Fallback for local development if GOOGLE_APPLICATION_CREDENTIALS is set
    admin.initializeApp();
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
