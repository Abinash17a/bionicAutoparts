import { MetadataRoute } from 'next';
import { blogs } from './data/blogsData';
import { getAllCategories, getAllActiveInventory } from '@/lib/inventory/inventoryRepository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.usausedautopart.com';
  const currentDate = new Date().toISOString();

  const [categories, inventoryItems] = await Promise.all([
    getAllCategories(),
    getAllActiveInventory(),
  ]);

  // 1. Core commercial and informational landing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/parts`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/refunds`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // 2. Commercial Category Hubs
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 3. Inventory-backed vehicle make routes (e.g. /used-engines/toyota)
  const makeRoutesMap = new Map<string, string>();
  inventoryItems.forEach((item) => {
    const path = `/${item.categorySlug}/${item.makeSlug}`;
    makeRoutesMap.set(path, path);
  });
  const makeRoutes: MetadataRoute.Sitemap = Array.from(makeRoutesMap.values()).map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 4. Inventory-backed vehicle model routes (e.g. /used-engines/toyota/camry)
  const modelRoutesMap = new Map<string, string>();
  inventoryItems.forEach((item) => {
    const path = `/${item.categorySlug}/${item.makeSlug}/${item.modelSlug}`;
    modelRoutesMap.set(path, path);
  });
  const modelRoutes: MetadataRoute.Sitemap = Array.from(modelRoutesMap.values()).map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 5. Inventory-backed vehicle year routes (e.g. /used-engines/toyota/camry/2018)
  const yearRoutesMap = new Map<string, string>();
  inventoryItems.forEach((item) => {
    const path = `/${item.categorySlug}/${item.makeSlug}/${item.modelSlug}/${item.year}`;
    yearRoutesMap.set(path, path);
  });
  const yearRoutes: MetadataRoute.Sitemap = Array.from(yearRoutesMap.values()).map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 6. Real inventory product pages (e.g. /parts/UAP-2018-TOY-CAM-ENG-01)
  const inventoryProductRoutes: MetadataRoute.Sitemap = inventoryItems.map((item) => ({
    url: `${baseUrl}/parts/${item.id}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 7. Verified Blog Guides
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.id}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...makeRoutes,
    ...modelRoutes,
    ...yearRoutes,
    ...inventoryProductRoutes,
    ...blogRoutes,
  ];
}
