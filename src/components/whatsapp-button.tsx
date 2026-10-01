import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildWhatsappUrl } from "@/lib/whatsapp";

type WhatsappButtonProps = {
  phone: string;
  label: string;
  message: string;
};

export function WhatsappButton({ phone, label, message }: WhatsappButtonProps) {
  return (
    <Button asChild variant="outline" size="lg">
      <a
        href={buildWhatsappUrl(phone, message)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle aria-hidden="true" />
        {label}
      </a>
    </Button>
  );
}
