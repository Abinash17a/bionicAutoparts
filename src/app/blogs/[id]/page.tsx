import React from "react";
import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { blogs, BlogArticle, BlogContentSection } from "../../data/blogsData";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
  Wrench,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import ShareButton from "./ShareButton";

interface BlogPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    id: blog.slug,
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  // If visited via numeric ID, permanently redirect to canonical slug URL
  if (/^\d+$/.test(params.id)) {
    const numericBlog = blogs.find((b) => String(b.id) === params.id);
    if (numericBlog) {
      permanentRedirect(`/blogs/${numericBlog.slug}`);
    }
  }

  const blog = blogs.find((b) => b.slug === params.id || String(b.id) === params.id) as BlogArticle | undefined;

  if (!blog) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.usausedautopart.com";
  const title = blog.seoTitle || blog.title;
  const description =
    blog.metaDescription ||
    blog.description
      .replace(/\*\*/g, "")
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 155);

  const heroImageUrl = blog.heroImage?.src || blog.image || "/blogs/images/auto-salvage-yard-inventory.jpg";
  const absoluteImageUrl = heroImageUrl.startsWith("http") ? heroImageUrl : `${siteUrl}${heroImageUrl}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/blogs/${blog.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blogs/${blog.slug}`,
      type: "article",
      publishedTime: blog.date,
      authors: [blog.author?.name || "USA Used Auto Parts Technical Editorial Team"],
      images: [
        {
          url: absoluteImageUrl,
          alt: blog.heroImage?.alt || blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImageUrl],
    },
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  // If visited via numeric ID, permanently redirect to canonical slug URL
  if (/^\d+$/.test(params.id)) {
    const numericBlog = blogs.find((b) => String(b.id) === params.id);
    if (numericBlog) {
      permanentRedirect(`/blogs/${numericBlog.slug}`);
    }
  }

  const blog = blogs.find((b) => b.slug === params.id || String(b.id) === params.id) as BlogArticle | undefined;

  if (!blog) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.usausedautopart.com";
  const blogIndex = blogs.findIndex((b) => b.id === blog.id);
  const prevBlog = blogIndex > 0 ? blogs[blogIndex - 1] : null;
  const nextBlog = blogIndex < blogs.length - 1 ? blogs[blogIndex + 1] : null;

  // Resolve related articles
  const relatedArticlesList = (blog.relatedArticles || [])
    .map((id) => blogs.find((b) => Number(b.id) === Number(id)))
    .filter(Boolean) as BlogArticle[];

  // JSON-LD Structured Data
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.metaDescription || blog.title,
    image: [
      (blog.heroImage?.src || blog.image).startsWith("http")
        ? blog.heroImage?.src || blog.image
        : `${siteUrl}${blog.heroImage?.src || blog.image}`,
    ],
    datePublished: blog.date,
    dateModified: blog.lastUpdated || blog.date,
    author: {
      "@type": "Organization",
      name: blog.author?.name || "USA Used Auto Parts Technical Editorial Team",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "USA Used Auto Parts",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo1.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blogs/${blog.slug}`,
    },
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Automotive Guides",
        item: `${siteUrl}/blogs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: `${siteUrl}/blogs/${blog.slug}`,
      },
    ],
  };

  const jsonLdFaq =
    blog.faqs && blog.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: blog.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${faq.answer} ${faq.supportingDetail || ""}`.trim(),
            },
          })),
        }
      : null;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20 pt-6">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center flex-wrap gap-2 text-sm text-slate-500">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <li>
              <Link href="/blogs" className="hover:text-blue-600 transition-colors">
                Automotive Guides
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <li className="text-slate-800 font-medium truncate max-w-[240px] sm:max-w-md">
              {blog.title}
            </li>
          </ol>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent inline-flex items-center font-medium"
          >
            <Link href="/blogs">
              <ArrowLeft className="mr-1.5 w-4 h-4" /> Back to Guides & Articles
            </Link>
          </Button>
        </div>

        {/* Main Article Container */}
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          {/* Article Header */}
          <header className="p-6 sm:p-10 border-b border-slate-100">
            {blog.category && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4 border border-blue-200/60">
                <BookOpen className="w-3 h-3" />
                {blog.category}
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight mb-4">
              {blog.title}
            </h1>

            {blog.subtitle && (
              <p className="text-lg text-slate-600 leading-relaxed mb-6 font-normal">
                {blog.subtitle}
              </p>
            )}

            {/* Editorial Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-500">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <User className="w-4 h-4 text-blue-600" />
                  {blog.author?.name || "Editorial Team"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Published {blog.date}
                </span>
                {blog.lastUpdated && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    Updated {blog.lastUpdated}
                  </span>
                )}
                {blog.readTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {blog.readTime}
                  </span>
                )}
              </div>
              <ShareButton title={blog.title} />
            </div>

            {blog.reviewedBy && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Technically reviewed by <strong className="text-slate-700">{blog.reviewedBy}</strong></span>
              </div>
            )}
          </header>

          {/* Hero Image */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-slate-100 border-b border-slate-100">
            <Image
              src={blog.heroImage?.src || blog.image}
              alt={blog.heroImage?.alt || blog.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
          {blog.heroImage?.caption && (
            <p className="px-6 sm:px-10 py-2.5 text-xs text-slate-500 bg-slate-50 border-b border-slate-100 italic">
              {blog.heroImage.caption}
            </p>
          )}

          {/* Article Content Area */}
          <div className="p-6 sm:p-10 text-slate-800 leading-relaxed">
            {/* AI Direct Takeaway / Key Answer Highlight Box */}
            {blog.keyTakeaway && (
              <div className="mb-10 p-6 sm:p-7 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-blue-950 m-0">
                    Direct Takeaway & Quick Answer
                  </h2>
                </div>
                <p className="text-slate-800 text-base leading-relaxed font-medium mb-4">
                  {blog.keyTakeaway.shortAnswer}
                </p>
                {blog.keyTakeaway.keyPoints && blog.keyTakeaway.keyPoints.length > 0 && (
                  <ul className="space-y-2 mt-3 pt-3 border-t border-blue-200/60">
                    {blog.keyTakeaway.keyPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Table of Contents (for rich articles with multiple sections) */}
            {blog.sections && blog.sections.length > 1 && (
              <div className="mb-10 p-6 rounded-xl bg-slate-50 border border-slate-200/80">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Table of Contents
                </h2>
                <ul className="space-y-2">
                  {blog.sections.map((sec, idx) => (
                    <li key={idx}>
                      <a
                        href={`#${sec.id}`}
                        className="text-sm sm:text-base font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                      >
                        <span className="text-xs text-slate-400">{idx + 1}.</span>
                        <span>{sec.heading}</span>
                      </a>
                    </li>
                  ))}
                  {blog.faqs && blog.faqs.length > 0 && (
                    <li>
                      <a
                        href="#faqs"
                        className="text-sm sm:text-base font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                      >
                        <span className="text-xs text-slate-400">#</span>
                        <span>Frequently Asked Questions</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Introduction Paragraphs */}
            {blog.introduction && blog.introduction.length > 0 && (
              <div className="space-y-4 mb-10 text-base sm:text-lg text-slate-700 leading-relaxed">
                {blog.introduction.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            )}

            {/* Structured Content Sections */}
            {blog.sections && blog.sections.length > 0 ? (
              <div className="space-y-12">
                {blog.sections.map((sec: BlogContentSection, sIdx: number) => (
                  <section key={sIdx} id={sec.id} className="scroll-mt-24 pt-2 border-t border-slate-100 first:border-t-0">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">
                      {sec.heading}
                    </h2>
                    {sec.subheading && (
                      <p className="text-sm sm:text-base text-slate-500 font-medium mb-4">
                        {sec.subheading}
                      </p>
                    )}

                    {/* Section Direct Answer */}
                    {sec.shortAnswer && (
                      <div className="my-4 p-4 rounded-lg bg-slate-50 border-l-4 border-blue-600 text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                        <span className="font-bold text-blue-900 block mb-1">Summary Answer:</span>
                        {sec.shortAnswer}
                      </div>
                    )}

                    {/* Section Paragraphs */}
                    {sec.paragraphs && sec.paragraphs.length > 0 && (
                      <div className="space-y-4 my-4 text-slate-700 leading-relaxed">
                        {sec.paragraphs.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>
                    )}

                    {/* Comparison Table */}
                    {sec.table && (
                      <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
                        {sec.table.caption && (
                          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs sm:text-sm font-semibold text-slate-700">
                            {sec.table.caption}
                          </div>
                        )}
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
                            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-semibold">
                              <tr>
                                {sec.table.headers.map((hdr, hIdx) => (
                                  <th key={hIdx} className="px-4 py-3">
                                    {hdr}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                              {sec.table.rows.map((row, rIdx) => (
                                <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="px-4 py-3 text-slate-800 font-normal">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Bullet Points */}
                    {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                      <ul className="my-5 space-y-2.5">
                        {sec.bulletPoints.map((bp, bpIdx) => (
                          <li key={bpIdx} className="flex items-start gap-2.5 text-slate-700 text-sm sm:text-base">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2.5" />
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Numbered Steps */}
                    {sec.numberedSteps && sec.numberedSteps.length > 0 && (
                      <ol className="my-5 space-y-3">
                        {sec.numberedSteps.map((step, stepIdx) => (
                          <li key={stepIdx} className="flex items-start gap-3 text-slate-700 text-sm sm:text-base">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs shrink-0 mt-0.5">
                              {stepIdx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    {/* Callout Box */}
                    {sec.callout && (
                      <div
                        className={`my-6 p-5 rounded-xl border flex items-start gap-3.5 ${
                          sec.callout.type === "warning" || sec.callout.type === "alert"
                            ? "bg-amber-50/70 border-amber-200 text-amber-900"
                            : sec.callout.type === "technical"
                            ? "bg-purple-50/70 border-purple-200 text-purple-950"
                            : "bg-blue-50/70 border-blue-200 text-blue-950"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {sec.callout.type === "warning" || sec.callout.type === "alert" ? (
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                          ) : sec.callout.type === "technical" ? (
                            <Wrench className="w-5 h-5 text-purple-600" />
                          ) : (
                            <Info className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wide mb-1">
                            {sec.callout.title}
                          </h4>
                          <p className="text-sm leading-relaxed">{sec.callout.text}</p>
                        </div>
                      </div>
                    )}

                    {/* Inline Content Image */}
                    {sec.image && (
                      <figure className="my-8 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
                          <Image
                            src={sec.image.src}
                            alt={sec.image.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 896px) 100vw, 896px"
                          />
                        </div>
                        {sec.image.caption && (
                          <figcaption className="p-3 text-xs text-slate-500 italic text-center border-t border-slate-200">
                            {sec.image.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}
                  </section>
                ))}
              </div>
            ) : (
              /* Fallback for legacy articles without structured sections */
              <div className="prose prose-blue max-w-none text-slate-800 leading-relaxed">
                {blog.description.split("\n").map((line: string, index: number) => {
                  const boldTextRegex = /\*\*(.*?)\*\*/g;
                  if (boldTextRegex.test(line)) {
                    const updatedLine = line.replace(
                      boldTextRegex,
                      '<span class="font-bold text-lg text-blue-800">$1</span>'
                    );
                    return (
                      <p
                        key={index}
                        className="mb-4"
                        dangerouslySetInnerHTML={{ __html: updatedLine }}
                      />
                    );
                  }
                  const trimmed = line.trim();
                  if (!trimmed) return null;
                  return (
                    <p key={index} className="mb-4">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            )}

            {/* Frequently Asked Questions Section */}
            {blog.faqs && blog.faqs.length > 0 && (
              <section id="faqs" className="mt-14 pt-8 border-t border-slate-200 scroll-mt-24">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 m-0">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-6">
                  {blog.faqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-colors"
                    >
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium mb-1">
                        {faq.answer}
                      </p>
                      {faq.supportingDetail && (
                        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                          {faq.supportingDetail}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Contextual Commercial CTA Section */}
            <div className="my-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white shadow-xl">
              <h2 className="text-xl sm:text-2xl font-extrabold mb-3 text-white">
                {blog.cta?.title || "Looking for Verified Recycled OEM Auto Parts?"}
              </h2>
              <p className="text-blue-100 text-sm sm:text-base mb-6 leading-relaxed max-w-2xl">
                {blog.cta?.description ||
                  "Explore our inventory of compression-tested used engines, bench-tested transmissions, and factory body panels with 6-month warranty and nationwide shipping."}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2.5">
                  <Link href={blog.cta?.buttonHref || "/parts"}>
                    {blog.cta?.buttonText || "Search Parts Catalog"}
                  </Link>
                </Button>
                {blog.cta?.secondaryHref && (
                  <Button
                    asChild
                    variant="outline"
                    className="bg-transparent hover:bg-white/10 text-white border-white/30 font-medium px-5 py-2.5"
                  >
                    <Link href={blog.cta.secondaryHref}>
                      {blog.cta.secondaryText || "Contact a Specialist"}
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Related Commercial Parts Links */}
            {blog.relatedCommercialLinks && blog.relatedCommercialLinks.length > 0 && (
              <div className="my-10 pt-6 border-t border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">
                  Relevant Parts Inventory
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {blog.relatedCommercialLinks.map((link, lIdx) => (
                    <Link
                      key={lIdx}
                      href={link.href}
                      className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all bg-white flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                            {link.title}
                          </h4>
                          {link.badge && (
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{link.description}</p>
                      </div>
                      <span className="mt-3 text-xs font-semibold text-blue-600 flex items-center gap-1">
                        View Inventory <ChevronRight className="w-3 h-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles Topical Linking */}
            {relatedArticlesList.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Related Automotive Guides</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedArticlesList.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blogs/${rel.slug}`}
                      className="group p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all bg-slate-50/50 flex items-start gap-3"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                        <Image
                          src={rel.heroImage?.src || rel.image}
                          alt={rel.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-slate-400 font-medium block mb-0.5">
                          {rel.date}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {rel.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Prev / Next Article Navigation */}
            <nav
              aria-label="Article navigation"
              className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-200 pt-6 mt-10"
            >
              {prevBlog ? (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href={`/blogs/${prevBlog.slug}`}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Previous Article
                  </Link>
                </Button>
              ) : (
                <div />
              )}
              {nextBlog ? (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href={`/blogs/${nextBlog.slug}`}>
                    Next Article <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              ) : (
                <div />
              )}
            </nav>
          </div>
        </article>
      </div>
    </div>
  );
}
