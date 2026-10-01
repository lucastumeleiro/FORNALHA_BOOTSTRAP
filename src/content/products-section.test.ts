import { describe, expect, it } from "vitest";
import { productsSectionContent } from "@/content/products-section";

const { title, subtitle, categoryLabels } = productsSectionContent;

describe("productsSectionContent", () => {
  it("deve ter no máximo 12 palavras no subtítulo quando contadas por token separado por espaço", () => {
    // Act
    const palavras = subtitle.trim().split(/\s+/).length;

    // Assert
    expect(palavras).toBeGreaterThan(0);
    expect(palavras).toBeLessThanOrEqual(12);
  });

  it("deve trocar o subtítulo antigo quando a copy é reescrita", () => {
    // Assert
    expect(subtitle).not.toBe("Conheça nossos produtos.");
    expect(subtitle).not.toMatch(/conheça nossos produtos/i);
  });

  it("deve falar de fermentação sem horário, categoria nem 36 horas quando o subtítulo é lido", () => {
    // Arrange
    const texto = subtitle.toLowerCase();

    // Assert
    expect(texto).toContain("fermentação");
    expect(texto).not.toMatch(/\b\d{1,2}h\b/);
    expect(texto).not.toContain("36 horas");
    for (const rotulo of Object.values(categoryLabels)) {
      expect(texto).not.toContain(rotulo.toLowerCase());
    }
  });

  it("deve manter o título e os rótulos de categoria quando só o subtítulo muda", () => {
    // Assert
    expect(title).toBe("Cardápio");
    expect(categoryLabels).toEqual({
      breads: "Pães",
      sweets: "Doces",
      drinks: "Bebidas",
    });
  });
});
