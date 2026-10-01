import { Hero } from "@/sections/hero";
import { HoursSection } from "@/sections/hours-section";
import { ProductsSection } from "@/sections/products-section";
import { SiteFooter } from "@/sections/site-footer";
import { SiteHeader } from "@/sections/site-header";

export default function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProductsSection />
        <HoursSection />
      </main>
      <SiteFooter />
    </>
  );
}
