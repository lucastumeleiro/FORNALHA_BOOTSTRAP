import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { footerContent } from "@/content/footer";
import { SiteFooter } from "@/sections/site-footer";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("SiteFooter", () => {
  it.each([2027, 2031])(
    "deve mostrar o ano do relógio quando o rodapé renderiza em %i",
    (ano) => {
      // Arrange
      vi.useFakeTimers();
      vi.setSystemTime(new Date(`${ano}-03-10T12:00:00`));

      // Act
      render(<SiteFooter />);

      // Assert
      const { symbol, brand } = footerContent.copyright;
      expect(screen.getByText(`${symbol} ${ano} ${brand}`)).toBeInTheDocument();
      expect(screen.queryByText(/2025/)).not.toBeInTheDocument();
    },
  );

  it("deve mostrar só o Instagram quando não há número de WhatsApp", () => {
    // Arrange
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "");

    // Act
    render(<SiteFooter />);

    // Assert
    expect(
      screen.getByRole("link", {
        name: footerContent.social.instagram.ariaLabel,
      }),
    ).toHaveAttribute("href", footerContent.social.instagram.href);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it.each(["", "xxx"])(
    "deve esconder o WhatsApp quando o número é %j",
    (numero) => {
      // Arrange
      vi.stubEnv("VITE_WHATSAPP_NUMBER", numero);

      // Act
      render(<SiteFooter />);

      // Assert
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute(
        "href",
        footerContent.social.instagram.href,
      );
      expect(
        screen.queryByRole("link", {
          name: footerContent.social.whatsapp.ariaLabel,
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("contentinfo").querySelector('a[href*="wa.me"]'),
      ).toBeNull();
    },
  );

  it("deve mostrar o WhatsApp com href wa.me quando há número", () => {
    // Arrange
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "+55 (47) 99999-0000");

    // Act
    render(<SiteFooter />);

    // Assert
    const link = screen.getByRole("link", {
      name: footerContent.social.whatsapp.ariaLabel,
    });
    expect(link.getAttribute("href")).toMatch(
      /^https:\/\/wa\.me\/5547999990000\?text=/,
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("deve levar a mensagem própria do rodapé codificada na URL do WhatsApp quando há número", () => {
    // Arrange
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "5547999990000");

    // Act
    render(<SiteFooter />);

    // Assert
    const link = screen.getByRole("link", {
      name: footerContent.social.whatsapp.ariaLabel,
    });
    expect(link).toHaveAttribute(
      "href",
      `https://wa.me/5547999990000?text=${encodeURIComponent(footerContent.social.whatsapp.message)}`,
    );
  });

  it("deve listar Instagram antes de WhatsApp quando há número", () => {
    // Arrange
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "5547999990000");

    // Act
    render(<SiteFooter />);

    // Assert
    const itens = screen.getAllByRole("listitem");
    expect(itens).toHaveLength(2);
    expect(
      within(itens[0]).getByRole("link", {
        name: footerContent.social.instagram.ariaLabel,
      }),
    ).toHaveTextContent(footerContent.social.instagram.label);
    expect(
      within(itens[1]).getByRole("link", {
        name: footerContent.social.whatsapp.ariaLabel,
      }),
    ).toHaveTextContent(footerContent.social.whatsapp.label);
  });

  it("deve abrir os links em nova aba, com rel seguro e nome acessível", () => {
    // Arrange
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "5547999990000");

    // Act
    render(<SiteFooter />);

    // Assert
    expect(screen.getAllByRole("link")).toHaveLength(2);
    const esperados = [
      {
        name: footerContent.social.instagram.ariaLabel,
        href: footerContent.social.instagram.href,
      },
      {
        name: footerContent.social.whatsapp.ariaLabel,
        href: /^https:\/\/wa\.me\/5547999990000\?text=/,
      },
    ];
    for (const { name, href } of esperados) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAccessibleName(name);
      if (typeof href === "string") {
        expect(link).toHaveAttribute("href", href);
      } else {
        expect(link.getAttribute("href")).toMatch(href);
      }
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("deve mostrar os links só com texto, sem ícone, quando há número", () => {
    // Arrange
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "5547999990000");

    // Act
    render(<SiteFooter />);

    // Assert
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(
      new RegExp(`^${footerContent.social.instagram.label}$`),
    );
    expect(links[1]).toHaveTextContent(
      new RegExp(`^${footerContent.social.whatsapp.label}$`),
    );
    for (const link of links) {
      expect(link.querySelector("svg, img")).toBeNull();
    }
  });

  it("deve focar Instagram e depois WhatsApp na ordem do Tab quando há número", async () => {
    // Arrange
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "5547999990000");
    const user = userEvent.setup();
    render(<SiteFooter />);
    const instagram = screen.getByRole("link", {
      name: footerContent.social.instagram.ariaLabel,
    });
    const whatsapp = screen.getByRole("link", {
      name: footerContent.social.whatsapp.ariaLabel,
    });

    // Act
    await user.tab();
    const aposPrimeiroTab = document.activeElement;
    await user.tab();
    const aposSegundoTab = document.activeElement;
    await user.tab();

    // Assert
    expect(aposPrimeiroTab).toBe(instagram);
    expect(aposSegundoTab).toBe(whatsapp);
    expect(whatsapp).not.toHaveFocus();
  });

  it("deve manter o id contato, único, e o endereço quando o rodapé renderiza", () => {
    // Arrange
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "");

    // Act
    const { container } = render(<SiteFooter />);

    // Assert
    expect(screen.getByRole("contentinfo")).toHaveAttribute("id", "contato");
    expect(container.querySelectorAll("#contato")).toHaveLength(1);
    expect(screen.getByText(footerContent.address)).toBeInTheDocument();
  });
});
