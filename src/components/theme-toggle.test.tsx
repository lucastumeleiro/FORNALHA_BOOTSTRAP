import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { headerContent } from "@/content/header";

const STORAGE_KEY = "fornalha-theme";
const label = headerContent.themeToggle.label;

function simularSistema(escuro: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string): MediaQueryList => ({
      matches: escuro && query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  );
}

function renderizar() {
  return render(
    <ThemeProvider>
      <ThemeToggle label={label} />
    </ThemeProvider>,
  );
}

const classes = () => document.documentElement.classList;

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  document.documentElement.classList.remove("light", "dark");
});

describe("ThemeToggle", () => {
  describe("alternância", () => {
    it("deve alternar claro, escuro, claro e escuro quando clicado três vezes", async () => {
      // Arrange
      simularSistema(false);
      const user = userEvent.setup();
      renderizar();
      const botao = screen.getByRole("button", { name: label });
      expect(classes()).toContain("light");

      // Act
      await user.click(botao);

      // Assert
      expect(classes()).toContain("dark");
      expect(classes()).not.toContain("light");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");

      // Act
      await user.click(botao);

      // Assert
      expect(classes()).toContain("light");
      expect(classes()).not.toContain("dark");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("light");

      // Act
      await user.click(botao);

      // Assert
      expect(classes()).toContain("dark");
      expect(classes()).not.toContain("light");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
    });

    it("deve ir para o claro no primeiro clique quando o sistema é escuro", async () => {
      // Arrange
      simularSistema(true);
      const user = userEvent.setup();
      renderizar();
      expect(classes()).toContain("dark");

      // Act
      await user.click(screen.getByRole("button", { name: label }));

      // Assert
      expect(classes()).toContain("light");
      expect(classes()).not.toContain("dark");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
    });

    it("deve ir para o escuro no primeiro clique quando o sistema é claro", async () => {
      // Arrange
      simularSistema(false);
      const user = userEvent.setup();
      renderizar();

      // Act
      await user.click(screen.getByRole("button", { name: label }));

      // Assert
      expect(classes()).toContain("dark");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
    });

    it("deve alternar a partir da escolha salva quando ela difere do sistema", async () => {
      // Arrange
      simularSistema(true);
      localStorage.setItem(STORAGE_KEY, "light");
      const user = userEvent.setup();
      renderizar();

      // Act
      await user.click(screen.getByRole("button", { name: label }));

      // Assert
      expect(classes()).toContain("dark");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
    });

    it("deve alternar o tema na sessão quando o armazenamento está bloqueado", async () => {
      // Arrange
      simularSistema(false);
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new DOMException("bloqueado", "SecurityError");
      });
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("bloqueado", "SecurityError");
      });
      const user = userEvent.setup();
      renderizar();
      const botao = screen.getByRole("button", { name: label });

      // Act
      await user.click(botao);

      // Assert
      expect(classes()).toContain("dark");

      // Act
      await user.click(botao);

      // Assert
      expect(classes()).toContain("light");
      expect(classes()).not.toContain("dark");
    });
  });

  describe("teclado", () => {
    it("deve receber o foco com Tab e alternar com Enter e Espaço quando só o teclado é usado", async () => {
      // Arrange
      simularSistema(false);
      const user = userEvent.setup();
      renderizar();
      const botao = screen.getByRole("button", { name: label });

      // Act
      await user.tab();

      // Assert
      expect(botao).toHaveFocus();

      // Act
      await user.keyboard("{Enter}");

      // Assert
      expect(classes()).toContain("dark");
      expect(botao).toHaveFocus();

      // Act
      await user.keyboard(" ");

      // Assert
      expect(classes()).toContain("light");
      expect(botao).toHaveFocus();

      // Act
      await user.keyboard("{Enter}");

      // Assert
      expect(classes()).toContain("dark");
      expect(botao).toHaveFocus();
    });
  });

  describe("acessibilidade", () => {
    it("deve ser um button nativo com o rótulo do conteúdo quando renderiza", () => {
      // Arrange
      simularSistema(false);

      // Act
      renderizar();

      // Assert
      const botao = screen.getByRole("button", { name: label });
      expect(botao.tagName).toBe("BUTTON");
      expect(botao).toHaveAttribute("aria-label", label);
    });

    it("deve manter o rótulo fixo quando o tema alterna", async () => {
      // Arrange
      simularSistema(false);
      const user = userEvent.setup();
      renderizar();
      const botao = screen.getByRole("button", { name: label });

      // Act
      await user.click(botao);

      // Assert
      expect(botao).toHaveAttribute("aria-label", label);
      expect(screen.getByRole("button", { name: label })).toBe(botao);
    });

    it("deve esconder os dois ícones dos leitores de tela quando renderiza", () => {
      // Arrange
      simularSistema(false);

      // Act
      renderizar();

      // Assert
      const icones = screen
        .getByRole("button", { name: label })
        .querySelectorAll("svg");
      expect(icones).toHaveLength(2);
      for (const icone of icones) {
        expect(icone).toHaveAttribute("aria-hidden", "true");
      }
    });
  });

  describe("fora do provider", () => {
    it("deve renderizar o botão sem lançar erro e sem mudar o html quando clicado", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ThemeToggle label={label} />);

      // Act
      await user.click(screen.getByRole("button", { name: label }));

      // Assert
      expect(classes()).not.toContain("dark");
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
});
