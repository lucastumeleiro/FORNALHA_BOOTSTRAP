import { footerContent } from "@/content/footer";
import { buildWhatsappUrl, hasWhatsappNumber } from "@/lib/whatsapp";

const linkClass =
  "rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const { instagram, whatsapp } = footerContent.social;
  const { symbol, brand } = footerContent.copyright;

  return (
    <footer id="contato" className="border-t border-border py-8">
      <div className="mx-auto max-w-5xl px-4 text-sm text-muted-foreground">
        <p>{footerContent.address}</p>
        <ul className="mt-3 flex flex-wrap gap-4">
          <li>
            <a
              href={instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={instagram.ariaLabel}
              className={linkClass}
            >
              {instagram.label}
            </a>
          </li>
          {hasWhatsappNumber(whatsappNumber) && (
            <li>
              <a
                href={buildWhatsappUrl(whatsappNumber, whatsapp.message)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={whatsapp.ariaLabel}
                className={linkClass}
              >
                {whatsapp.label}
              </a>
            </li>
          )}
        </ul>
        <p className="mt-3">{`${symbol} ${year} ${brand}`}</p>
      </div>
    </footer>
  );
}
