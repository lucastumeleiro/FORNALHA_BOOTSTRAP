import { Button } from "@/components/ui/button";
import { WhatsappButton } from "@/components/whatsapp-button";
import { heroContent } from "@/content/hero";
import { hasWhatsappNumber } from "@/lib/whatsapp";

export function Hero() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-4xl font-bold tracking-tight">
          {heroContent.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {heroContent.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href={heroContent.cta.href}>{heroContent.cta.label}</a>
          </Button>
          {hasWhatsappNumber(whatsappNumber) && (
            <WhatsappButton
              phone={whatsappNumber}
              label={heroContent.whatsapp.label}
              message={heroContent.whatsapp.message}
            />
          )}
        </div>
      </div>
    </section>
  );
}
