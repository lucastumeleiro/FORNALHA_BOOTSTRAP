function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

// Um número só existe se tiver pelo menos um dígito; "", undefined e "xxx" não contam.
export function hasWhatsappNumber(phone?: string): phone is string {
  return phone !== undefined && onlyDigits(phone).length > 0;
}

export function buildWhatsappUrl(phone: string, message: string): string {
  return `https://wa.me/${onlyDigits(phone)}?text=${encodeURIComponent(message)}`;
}
