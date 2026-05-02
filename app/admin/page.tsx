import React from 'react';
import { getAllArticles } from '@/lib/articles';
import AdminClient from './AdminClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Jeromian Voice',
  description: 'Manage news articles and synchronization.',
  robots: 'noindex, nofollow', // Keep admin out of search engines
};

// Ensure this page isn't cached so the list is always fresh
export const revalidate = 0;

export default async function AdminPage() {
  const articles = await getAllArticles();

  return <AdminClient initialArticles={articles} />;
}
