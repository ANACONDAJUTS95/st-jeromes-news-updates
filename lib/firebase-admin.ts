import * as admin from "firebase-admin";

function getAdminApp() {
  if (admin.apps.length > 0) return admin.apps[0];

  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!serviceAccountVar) {
    // During Vercel build, we might not have the secret. 
    // We return null to avoid crashing module evaluation.
    if (process.env.NODE_ENV === 'development') {
      try {
        return admin.initializeApp();
      } catch (e) {
        console.warn("⚠️ Local Firebase Admin initialization failed. Ensure GOOGLE_APPLICATION_CREDENTIALS is set.");
        return null;
      }
    }
    return null;
  }

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
    
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    return null;
  }
}

const app = getAdminApp();

// Export services using the (possibly null) app
// admin.firestore() and admin.auth() will work if 'app' is the default app,
// or throw if no app exists. By passing 'app', we ensure they use our initialized instance.
export const adminDb = admin.firestore(app || undefined);
export const adminAuth = admin.auth(app || undefined);
