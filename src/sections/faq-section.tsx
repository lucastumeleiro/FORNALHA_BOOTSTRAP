import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqContent } from "@/content/faq";

export function FaqSection() {
  return (
    <section id="perguntas" className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-bold tracking-tight">{faqContent.title}</h2>
        <p className="mt-2 text-muted-foreground">{faqContent.subtitle}</p>
        {/* Uma aberta por vez, todas fechadas no início; clicar de novo fecha. */}
        <Accordion type="single" collapsible className="mt-8 max-w-3xl">
          {faqContent.items.map((item) => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className="border-border"
            >
              <AccordionTrigger className="text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
