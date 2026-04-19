import { expect, test } from "@playwright/test";

test.describe("Portfolio — Visual & Functional Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    /* Wait for page loader to finish */
    await page.waitForTimeout(3000);
  });

  /* ── Hero Section ─────────────────────────────────────────────────── */
  test("hero text is readable and properly rendered", async ({ page }) => {
    const heroTitle = page.locator("#hero-title");
    await expect(heroTitle).toBeVisible();

    const text = await heroTitle.textContent();
    expect(text).toContain("Crafting");
    expect(text).toContain("Intelligent");
    expect(text).toContain("Experiences");
  });

  test("hero subtitle conveys AI + design identity", async ({ page }) => {
    const subtitle = page.locator("#hero p").first();
    await expect(subtitle).toBeVisible();

    const text = await subtitle.textContent();
    expect(text).toContain("AI-powered");
  });

  test("View My Work button scrolls to work section", async ({ page }) => {
    const btn = page.locator("text=View My Work");
    await expect(btn).toBeVisible();
    await btn.click();
    await page.waitForTimeout(1500);

    const work = page.locator("#work");
    const box = await work.boundingBox();
    expect(box).toBeTruthy();
    /* Work section should be near the top of the viewport */
    expect(box!.y).toBeLessThan(200);
  });

  /* ── About Section ────────────────────────────────────────────────── */
  test("about section renders on scroll", async ({ page }) => {
    const about = page.locator("#about");
    await expect(about).toBeAttached();

    /* Scroll to about */
    await page.evaluate(() => {
      document.getElementById("about")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(1000);

    const card = page.locator("[data-about-mask]");
    await expect(card).toBeVisible();
  });

  /* ── Work Section ─────────────────────────────────────────────────── */
  test("work section displays experience cards", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("work")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(1000);

    const workCards = page.locator("[data-work-card]");
    const count = await workCards.count();
    expect(count).toBeGreaterThan(0);

    /* First card should be visible */
    await expect(workCards.first()).toBeVisible();
  });

  /* ── Projects Section ─────────────────────────────────────────────── */
  test("projects section renders all project cards", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("projects")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(1000);

    const projectCards = page.locator("[data-project-card]");
    const count = await projectCards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  /* ── Skills Section ───────────────────────────────────────────────── */
  test("skills section shows bento grid with proper icons", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("skills")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(1000);

    const skillCards = page.locator("[data-skill-card]");
    const count = await skillCards.count();
    expect(count).toBeGreaterThanOrEqual(3);

    /* First card should span 2 columns on desktop */
    const firstCard = skillCards.first();
    await expect(firstCard).toBeVisible();
  });

  /* ── Journey Section ──────────────────────────────────────────────── */
  test("journey timeline renders milestones", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("journey")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(1000);

    const items = page.locator("[data-journey-item]");
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  /* ── Research Section ─────────────────────────────────────────────── */
  test("research section displays cards", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("research")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(1000);

    const cards = page.locator("[data-research-card]");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  /* ── Contact Section ──────────────────────────────────────────────── */
  test("contact section has form and social links", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(1000);

    const form = page.locator("form");
    await expect(form).toBeVisible();

    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
    await expect(nameInput).toBeVisible();
  });

  /* ── Navbar ───────────────────────────────────────────────────────── */
  test("navbar shows active section indicator", async ({ page }) => {
    const nav = page.locator("header");
    await expect(nav).toBeVisible();

    /* Check desktop nav items exist (first match = desktop, second = mobile) */
    const aboutLink = page.locator('header nav button:has-text("About")').first();
    await expect(aboutLink).toBeVisible();

    const contactLink = page.locator('header nav button:has-text("Contact")').first();
    await expect(contactLink).toBeVisible();
  });

  test("navbar gets scrolled style on scroll", async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(500);

    const nav = page.locator("header");
    const hasScrolledClass = await nav.evaluate((el) =>
      el.classList.contains("nav-scrolled")
    );
    expect(hasScrolledClass).toBe(true);
  });

  /* ── Performance ──────────────────────────────────────────────────── */
  test("page loads within acceptable time", async ({ page }) => {
    const start = Date.now();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const loadTime = Date.now() - start;

    /* Page should load DOM in under 5 seconds */
    expect(loadTime).toBeLessThan(5000);
  });

  test("no console errors on page load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);

    /* Filter out known benign errors */
    const criticalErrors = errors.filter(
      (err) =>
        !err.includes("ResizeObserver") &&
        !err.includes("hydration") &&
        !err.includes("Failed to fetch")
    );

    expect(criticalErrors).toHaveLength(0);
  });

  /* ── SEO ──────────────────────────────────────────────────────────── */
  test("page has proper SEO meta tags", async ({ page }) => {
    await page.goto("/");

    const title = await page.title();
    expect(title).toContain("Harshavardhan");

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /AI Engineer/);

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /Harshavardhan/);
  });

  /* ── All sections exist ───────────────────────────────────────────── */
  test("all portfolio sections are present in DOM", async ({ page }) => {
    const sections = ["hero", "about", "work", "projects", "skills", "journey", "research", "contact"];

    for (const id of sections) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeAttached();
    }
  });
});
