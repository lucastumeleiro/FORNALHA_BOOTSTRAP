import { footerContent } from "@/content/footer";

export function SiteFooter() {
  return (
    <footer id="contato" className="border-t border-border py-8">
      <div className="mx-auto max-w-5xl px-4 text-sm text-muted-foreground">
        <p>{footerContent.address}</p>
        <p className="mt-1">{footerContent.copyright}</p>
      </div>
    </footer>
  );
}
