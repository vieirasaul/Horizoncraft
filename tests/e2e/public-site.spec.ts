import { expect, test } from "@playwright/test";

test.describe("public site", () => {
  test("visitor can navigate from the home page to a chapter", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Horizoncraft/);
    await page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Capítulos" })
      .click();

    await expect(page).toHaveURL(/\/capitulos$/);
    await expect(
      page.getByRole("heading", { name: "A história de Horizoncraft" }),
    ).toBeVisible();

    await page.getByRole("link", { name: /Parabéns, Théo!/ }).click();
    await expect(page).toHaveURL(/\/capitulos\/parabens-theo$/);
    await expect(
      page.getByRole("heading", { name: "Parabéns, Théo!" }).first(),
    ).toBeVisible();
  });

  test("visitor can browse characters and their powers", async ({ page }) => {
    await page.goto("/personagens");

    await expect(
      page.getByRole("heading", { name: "Personagens de Horizoncraft" }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "Ver personagem Caveira Vermelha" })
      .click();

    await expect(page).toHaveURL(/\/personagens\/caveira-vermelha$/);
    await expect(
      page.getByRole("heading", { name: "Caveira Vermelha" }),
    ).toBeVisible();
    await expect(page.getByText("Controle do fogo")).toBeVisible();

    await page.goto("/poderes");
    await expect(
      page.getByRole("heading", { name: "Poderes do Horizoncraft" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Controle do fogo" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Caveira Vermelha", exact: true }).first(),
    ).toBeVisible();
  });

  test("visitor can reach the gallery and the admin setup boundary", async ({
    page,
  }) => {
    await page.goto("/galeria");

    await expect(
      page.getByRole("heading", {
        name: "Desenhos do Horizoncraft",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Os primeiros desenhos do Horizoncraft aparecerão aqui em breve.",
      }),
    ).toBeVisible();

    await page.goto("/admin");
    const setupHeading = page.getByRole("heading", {
      name: "CONECTE O SUPABASE",
    });
    if (await setupHeading.isVisible()) {
      await expect(
        page.getByRole("link", { name: "Voltar ao site" }),
      ).toBeVisible();
    } else {
      await expect(page).toHaveURL(/\/admin\/login$/);
      await expect(
        page.getByRole("heading", { name: "Entrar no Horizoncraft" }),
      ).toBeVisible();
    }
  });

  test("small mobile layout keeps content accessible without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/");

    await expect(
      page.getByText("Uma história de heróis, poderes e aventuras", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Capítulo 1 Parabéns, Théo!/ }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth ===
          document.documentElement.clientWidth,
      ),
    ).toBe(true);

    await page.getByLabel("Abrir menu").click();
    const navigation = page.getByRole("navigation", {
      name: "Navegação para celular",
    });
    await expect(navigation).toBeVisible();

    await navigation.getByRole("link", { name: "Personagens" }).click();
    await expect(page).toHaveURL(/\/personagens$/);
    await expect(
      page.getByRole("heading", { name: "Personagens de Horizoncraft" }),
    ).toBeVisible();
  });

  test("footer remains readable at intermediate mobile widths", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 600, height: 900 });
    await page.goto("/");

    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();
    await expect(
      footer.getByRole("navigation", { name: "Links do rodapé" }),
    ).toBeVisible();

    const brand = footer.getByText("Horizoncraft", { exact: true });
    await expect(brand).toBeVisible();
    expect((await brand.boundingBox())?.height).toBeLessThan(60);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth ===
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });

  test("final hero title fits the intermediate mobile layout", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 440, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    expect(
      await page.evaluate(() => {
        const copy = document
          .querySelector(".hero-copy")
          ?.getBoundingClientRect();
        const finalTitle = document
          .querySelector(".hero-title-reserve-final")
          ?.getBoundingClientRect();

        return Boolean(copy && finalTitle && finalTitle.width <= copy.width);
      }),
    ).toBe(true);
  });
});
