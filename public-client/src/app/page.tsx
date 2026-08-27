import { Hero } from "@/components/hero";
import { ServicesSection } from "@/components/services-section";
import { getPageBySlug } from "@/lib/payload-api";
import { getActiveServices } from "@/lib/nest-api";
import type { Service } from "@/types/service";

export default async function Home() {
  const [homePage, services] = await Promise.all([
    getPageBySlug("home").catch(() => null),
    getActiveServices().catch((): Service[] => []),
  ]);

  return (
    <>
      <Hero
        heading={homePage?.hero?.heading}
        subheading={homePage?.hero?.subheading}
        ctaText={homePage?.hero?.ctaText}
        ctaLink={homePage?.hero?.ctaLink}
        imageUrl={homePage?.hero?.image?.url}
      />
      <ServicesSection services={services} />
    </>
  );
}
