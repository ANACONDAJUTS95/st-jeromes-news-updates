import { adminDb } from "./firebase-admin";

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  originalUrl: string;
  timestamp: string;
  category: string;
  image?: string;
  syncedAt?: string;
  credits?: {
    photo?: string;
    layout?: string;
    writer?: string;
  };
}

// Helper to sanitize Firestore data (converts Timestamps to strings)
function sanitizeData(data: any) {
  if (!data) return data;
  const sanitized = { ...data };
  
  if (sanitized.syncedAt) {
    if (typeof sanitized.syncedAt.toDate === 'function') {
      sanitized.syncedAt = sanitized.syncedAt.toDate().toISOString();
    } else if (sanitized.syncedAt._seconds) {
      sanitized.syncedAt = new Date(sanitized.syncedAt._seconds * 1000).toISOString();
    } else if (typeof sanitized.syncedAt === 'string') {
      // already a string, do nothing
    }
  }

  // Ensure other potential non-serializable fields are clean
  return sanitized;
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const snapshot = await adminDb
      .collection("articles")
      .orderBy("timestamp", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(sanitizeData(doc.data()) as Omit<Article, "id">),
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const snapshot = await adminDb
      .collection("articles")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...(sanitizeData(doc.data()) as Omit<Article, "id">),
    };
  } catch (error) {
    console.error(`Error fetching article by slug ${slug}:`, error);
    return null;
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const doc = await adminDb.collection("articles").doc(id).get();
    if (!doc.exists) return null;

    return {
      id: doc.id,
      ...(sanitizeData(doc.data()) as Omit<Article, "id">),
    };
  } catch (error) {
    console.error(`Error fetching article by id ${id}:`, error);
    return null;
  }
}
