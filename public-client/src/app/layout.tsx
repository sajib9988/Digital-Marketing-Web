import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getNavigation, getSiteSeo } from "@/lib/payload-api";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSiteSeo().catch(() => null);
  const title = seo?.defaultTitle ?? "Digital Marketing Agency";
  const suffix = seo?.titleSuffix ? ` ${seo.titleSuffix}` : "";

  return {
    title: `${title}${suffix}`,
    description:
      seo?.defaultDescription ??
      "A full-service digital marketing agency helping brands grow online.",
    robots: seo?.robotsIndexable === false ? { index: false, follow: false } : undefined,
    openGraph: seo?.defaultOgImage
      ? { images: [{ url: seo.defaultOgImage.url }] }
      : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const navigation = await getNavigation().catch(() => ({ items: [] }));

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Navbar items={navigation.items ?? []} />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
