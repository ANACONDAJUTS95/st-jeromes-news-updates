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

type FirestoreTimestamp = { toDate: () => Date } | { _seconds: number } | string;

function sanitizeData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...data };
  const syncedAt = sanitized.syncedAt as FirestoreTimestamp | undefined;

  if (syncedAt) {
    if (typeof syncedAt === "object" && "toDate" in syncedAt) {
      sanitized.syncedAt = syncedAt.toDate().toISOString();
    } else if (typeof syncedAt === "object" && "_seconds" in syncedAt) {
      sanitized.syncedAt = new Date(syncedAt._seconds * 1000).toISOString();
    }
  }

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

    const data = doc.data();
    if (!data) return null;
    return {
      id: doc.id,
      ...(sanitizeData(data) as Omit<Article, "id">),
    };
  } catch (error) {
    console.error(`Error fetching article by id ${id}:`, error);
    return null;
  }
}
