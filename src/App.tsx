import { Hero } from "@/sections/hero";
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
      </main>
      <SiteFooter />
    </>
  );
}
