export type HoursDay = {
  label: string;
  hours: string;
  closed?: true;
};

// Ordem de segunda a domingo: o índice casa com getWeekdayIndex.
const days: readonly HoursDay[] = [
  { label: "Segunda", hours: "Fechado", closed: true },
  { label: "Terça", hours: "7h–19h" },
  { label: "Quarta", hours: "7h–19h" },
  { label: "Quinta", hours: "7h–19h" },
  { label: "Sexta", hours: "7h–19h" },
  { label: "Sábado", hours: "7h–14h" },
  { label: "Domingo", hours: "7h–12h" },
];

export const hoursContent = {
  title: "Horários e endereço",
  subtitle: "Fornadas às 7h e às 16h.",
  todayLabel: "Hoje",
  days,
  addressLabel: "Endereço",
  address: "Rua do Forno, 120 — Centro",
  directions: {
    label: "Como chegar",
  },
} as const;
