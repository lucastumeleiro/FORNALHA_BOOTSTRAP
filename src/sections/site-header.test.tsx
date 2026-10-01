import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";
import { headerContent } from "@/content/header";
import { SiteHeader } from "@/sections/site-header";

function renderizar() {
  return render(
    <ThemeProvider>
      <SiteHeader />
    </ThemeProvider>,
  );
}

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("light", "dark");
});

describe("SiteHeader", () => {
  it("deve mostrar a marca, os links do menu e o botão de tema quando renderiza", () => {
    // Arrange / Act
    renderizar();

    // Assert
    expect(screen.getByText(headerContent.brand)).toBeInTheDocument();
    for (const item of headerContent.navItems) {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        item.href,
      );
    }
    expect(
      screen.getByRole("button", { name: headerContent.themeToggle.label }),
    ).toBeInTheDocument();
  });

  it("deve levar o foco pelos links do menu até o botão de tema quando Tab é pressionado", async () => {
    // Arrange
    const user = userEvent.setup();
    renderizar();

    // Act
    await user.tab();
    await user.tab();

    // Assert
    expect(
      screen.getByRole("link", { name: headerContent.navItems[1].label }),
    ).toHaveFocus();

    // Act
    await user.tab();

    // Assert
    expect(
      screen.getByRole("button", { name: headerContent.themeToggle.label }),
    ).toHaveFocus();
  });

  it("deve devolver o foco ao último link do menu quando Shift+Tab é pressionado no botão", async () => {
    // Arrange
    const user = userEvent.setup();
    renderizar();
    await user.tab();
    await user.tab();
    await user.tab();

    // Act
    await user.tab({ shift: true });

    // Assert
    expect(
      screen.getByRole("link", { name: headerContent.navItems[1].label }),
    ).toHaveFocus();
  });

  it("deve alternar o tema do html quando o botão do cabeçalho é acionado", async () => {
    // Arrange
    const user = userEvent.setup();
    renderizar();
    expect(document.documentElement).toHaveClass("light");

    // Act
    await user.click(
      screen.getByRole("button", { name: headerContent.themeToggle.label }),
    );

    // Assert
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).not.toHaveClass("light");
  });
});
