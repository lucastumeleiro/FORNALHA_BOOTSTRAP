import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { headerContent } from "@/content/header";

const STORAGE_KEY = "fornalha-theme";

// Só a consulta de modo escuro casa quando o sistema é escuro.
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

// Monta a aplicação real: importar o módulo executa o createRoot de src/main.tsx.
async function abrirAplicacao() {
  await import("@/main");
  return screen.findByRole("button", { name: headerContent.themeToggle.label });
}

const classes = () => document.documentElement.classList;

beforeEach(() => {
  vi.resetModules();
  document.body.innerHTML = '<div id="root"></div>';
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  document.documentElement.classList.remove("light", "dark");
  document.body.innerHTML = "";
});

describe("main (aplicação real)", () => {
  it("deve abrir escura quando é a primeira visita e o sistema é escuro", async () => {
    // Arrange
    simularSistema(true);

    // Act
    await abrirAplicacao();

    // Assert
    await waitFor(() => expect(classes()).toContain("dark"));
    expect(classes()).not.toContain("light");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("deve abrir clara quando é a primeira visita e o sistema é claro", async () => {
    // Arrange
    simularSistema(false);

    // Act
    await abrirAplicacao();

    // Assert
    await waitFor(() => expect(classes()).toContain("light"));
    expect(classes()).not.toContain("dark");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("deve alternar o tema e gravar a escolha quando o botão do cabeçalho é clicado", async () => {
    // Arrange
    simularSistema(true);
    const user = userEvent.setup();
    const botao = await abrirAplicacao();
    await waitFor(() => expect(classes()).toContain("dark"));

    // Act
    await user.click(botao);

    // Assert
    await waitFor(() => expect(classes()).toContain("light"));
    expect(classes()).not.toContain("dark");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
  });

  it("deve continuar escura quando a escolha salva é escura e o sistema é claro", async () => {
    // Arrange
    simularSistema(false);
    localStorage.setItem(STORAGE_KEY, "dark");

    // Act
    await abrirAplicacao();

    // Assert
    await waitFor(() => expect(classes()).toContain("dark"));
    expect(classes()).not.toContain("light");
  });
});
