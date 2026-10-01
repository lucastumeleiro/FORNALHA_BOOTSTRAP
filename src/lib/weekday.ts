// Índice do dia com segunda = 0 … domingo = 6; Date.getDay() começa no domingo (= 0).
// Usa o horário local do navegador.
export function getWeekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}
