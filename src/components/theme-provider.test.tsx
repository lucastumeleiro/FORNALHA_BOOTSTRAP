import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "@/components/theme-provider";

const STORAGE_KEY = "fornalha-theme";

const QUERY_ESCURO = "(prefers-color-scheme: dark)";

// Simula o tema do sistema: só a consulta de modo escuro casa quando o sistema é escuro.
// O objeto devolvido troca o tema depois da montagem e dispara o `change` dos
// MediaQueryList já entregues, como faria o navegador.
function simularSistema(escuro: boolean) {
  const ouvintes = new Set<() => void>();
  const sistema = {
    escuro,
    mudarPara(valor: boolean) {
      sistema.escuro = valor;
      act(() => {
        ouvintes.forEach((ouvinte) => ouvinte());
      });
    },
  };
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string): MediaQueryList => ({
      matches: sistema.escuro && query === QUERY_ESCURO,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: (
        _tipo: string,
        ouvinte: EventListenerOrEventListenerObject,
      ) => {
        const chamar =
          typeof ouvinte === "function"
            ? ouvinte
            : ouvinte.handleEvent.bind(ouvinte);
        ouvintes.add(() => chamar(new Event("change")));
      },
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  );
  return sistema;
}

function Sonda() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <p>escolhido: {theme}</p>
      <p>efetivo: {resolvedTheme}</p>
      <button onClick={() => setTheme("dark")}>usar escuro</button>
      <button onClick={() => setTheme("light")}>usar claro</button>
      <button onClick={() => setTheme("system")}>usar sistema</button>
    </div>
  );
}

const classes = () => document.documentElement.classList;

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  document.documentElement.classList.remove("light", "dark");
});

describe("ThemeProvider", () => {
  describe("primeira visita", () => {
    it("deve abrir escuro quando não há valor salvo e o sistema é escuro", () => {
      // Arrange
      simularSistema(true);

      // Act
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );

      // Assert
      expect(classes()).toContain("dark");
      expect(classes()).not.toContain("light");
      expect(screen.getByText("efetivo: dark")).toBeInTheDocument();
    });

    it("deve abrir claro quando não há valor salvo e o sistema é claro", () => {
      // Arrange
      simularSistema(false);

      // Act
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );

      // Assert
      expect(classes()).toContain("light");
      expect(classes()).not.toContain("dark");
    });

    it("deve manter o armazenamento vazio quando ninguém clicou ainda", () => {
      // Arrange
      simularSistema(true);

      // Act
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );

      // Assert
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(screen.getByText("escolhido: system")).toBeInTheDocument();
    });

    it("deve usar o defaultTheme informado quando não há valor salvo", () => {
      // Arrange
      simularSistema(false);

      // Act
      render(
        <ThemeProvider defaultTheme="dark">
          <Sonda />
        </ThemeProvider>,
      );

      // Assert
      expect(classes()).toContain("dark");
    });
  });

  describe("escolha explícita", () => {
    it("deve trocar a classe do html e gravar na chave quando setTheme é chamado", async () => {
      // Arrange
      simularSistema(false);
      const user = userEvent.setup();
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "usar escuro" }));

      // Assert
      expect(classes()).toContain("dark");
      expect(classes()).not.toContain("light");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");

      // Act
      await user.click(screen.getByRole("button", { name: "usar claro" }));

      // Assert
      expect(classes()).toContain("light");
      expect(classes()).not.toContain("dark");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
    });

    it("deve gravar na chave informada quando storageKey é personalizada", async () => {
      // Arrange
      simularSistema(false);
      const user = userEvent.setup();
      render(
        <ThemeProvider storageKey="outra-chave">
          <Sonda />
        </ThemeProvider>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "usar escuro" }));

      // Assert
      expect(localStorage.getItem("outra-chave")).toBe("dark");
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("deve seguir o sistema de novo quando a escolha volta para system", async () => {
      // Arrange
      simularSistema(true);
      localStorage.setItem(STORAGE_KEY, "light");
      const user = userEvent.setup();
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );
      expect(classes()).toContain("light");

      // Act
      await user.click(screen.getByRole("button", { name: "usar sistema" }));

      // Assert
      expect(classes()).toContain("dark");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("system");
    });
  });

  describe("persistência", () => {
    it("deve continuar escuro quando a página é recarregada depois da escolha", async () => {
      // Arrange
      simularSistema(false);
      const user = userEvent.setup();
      const primeira = render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );
      await user.click(screen.getByRole("button", { name: "usar escuro" }));
      primeira.unmount();
      document.documentElement.classList.remove("light", "dark");

      // Act
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );

      // Assert
      expect(classes()).toContain("dark");
      expect(screen.getByText("escolhido: dark")).toBeInTheDocument();
    });

    it("deve abrir claro quando a escolha salva é clara e o sistema é escuro", () => {
      // Arrange
      simularSistema(true);
      localStorage.setItem(STORAGE_KEY, "light");

      // Act
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );

      // Assert
      expect(classes()).toContain("light");
      expect(classes()).not.toContain("dark");
    });

    it("deve abrir pelo sistema quando o valor salvo é system", () => {
      // Arrange
      simularSistema(true);
      localStorage.setItem(STORAGE_KEY, "system");

      // Act
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );

      // Assert
      expect(classes()).toContain("dark");
    });
  });

  describe("valor salvo inválido", () => {
    it("deve cair no tema do sistema sem erro quando o valor salvo não é um tema", () => {
      // Arrange
      simularSistema(true);
      localStorage.setItem(STORAGE_KEY, "roxo");

      // Act
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );

      // Assert
      expect(screen.getByText("escolhido: system")).toBeInTheDocument();
      expect(classes()).toContain("dark");
    });

    it("deve sobrescrever o valor inválido quando a pessoa escolhe um tema", async () => {
      // Arrange
      simularSistema(true);
      localStorage.setItem(STORAGE_KEY, "roxo");
      const user = userEvent.setup();
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "usar claro" }));

      // Assert
      expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
      expect(classes()).toContain("light");
    });
  });

  describe("localStorage indisponível", () => {
    it("deve renderizar os filhos no tema do sistema quando a leitura lança", () => {
      // Arrange
      simularSistema(true);
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new DOMException("bloqueado", "SecurityError");
      });

      // Act
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );

      // Assert
      expect(screen.getByText("escolhido: system")).toBeInTheDocument();
      expect(classes()).toContain("dark");
    });

    it("deve trocar o tema na sessão quando a gravação lança", async () => {
      // Arrange
      simularSistema(false);
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("bloqueado", "SecurityError");
      });
      const user = userEvent.setup();
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "usar escuro" }));

      // Assert
      expect(classes()).toContain("dark");
      expect(screen.getByText("escolhido: dark")).toBeInTheDocument();
    });
  });

  describe("mudança do sistema com a página aberta", () => {
    it("deve manter a classe atual quando o sistema muda sem recarregar", () => {
      // Arrange
      const sistema = simularSistema(false);
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );
      expect(classes()).toContain("light");

      // Act: o sistema vira escuro e o evento `change` chega a quem o assinou
      sistema.mudarPara(true);

      // Assert: reagir a essa mudança está fora de escopo (Q5.1)
      expect(classes()).toContain("light");
      expect(classes()).not.toContain("dark");
      expect(screen.getByText("escolhido: system")).toBeInTheDocument();
    });

    it("deve abrir escuro quando a página é montada de novo com o sistema já escuro", () => {
      // Arrange
      const sistema = simularSistema(false);
      const primeira = render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );
      sistema.escuro = true;
      primeira.unmount();

      // Act
      render(
        <ThemeProvider>
          <Sonda />
        </ThemeProvider>,
      );

      // Assert
      expect(classes()).toContain("dark");
    });
  });
});

describe("useTheme fora do provider", () => {
  it("deve devolver o contexto padrão sem lançar erro quando não há provider", () => {
    // Arrange / Act
    render(<Sonda />);

    // Assert
    expect(screen.getByText("escolhido: system")).toBeInTheDocument();
    expect(screen.getByText("efetivo: light")).toBeInTheDocument();
  });

  it("deve ignorar o clique sem mudar o html nem o armazenamento quando não há provider", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Sonda />);

    // Act
    await user.click(screen.getByRole("button", { name: "usar escuro" }));

    // Assert
    expect(classes()).not.toContain("dark");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
