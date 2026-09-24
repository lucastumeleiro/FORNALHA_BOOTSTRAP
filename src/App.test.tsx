import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";
import { heroContent } from "@/content/hero";

describe("App", () => {
  it("deve mostrar o título do hero quando a página renderiza", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: heroContent.title }),
    ).toBeInTheDocument();
  });
});
