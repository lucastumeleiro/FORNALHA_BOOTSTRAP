export type FaqItem = {
  question: string;
  answer: string;
};

const items: readonly FaqItem[] = [
  {
    question: "Vocês abrem na segunda?",
    answer:
      "Não. Segunda é o dia de alimentar o fermento e limpar o forno.",
  },
  {
    question: "Até quando posso encomendar para o fim de semana?",
    answer: "Até sexta, 18h.",
  },
  {
    question: "Tem pão sem glúten?",
    answer:
      "Não. Tudo que sai do forno leva trigo, e não dá para garantir ausência de contaminação.",
  },
  {
    question: "O pão dura quantos dias?",
    answer:
      "De três a quatro, embrulhado em pano. Para durar mais, fatie e congele.",
  },
  {
    question: "Aceitam cartão?",
    answer: "Sim: débito, crédito e Pix.",
  },
];

export const faqContent = {
  title: "Perguntas frequentes",
  // Provisório: o EPIC não define o subtítulo.
  subtitle: "O que mais perguntam por aqui.",
  items,
} as const;
