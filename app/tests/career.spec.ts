import { test, expect, type Page } from "playwright/test";

const generalLabels: Record<string, string[]> = {
  Autonomy: ["Follows", "Collaborates", "Self-Directed", "Empowered", "Visionary"],
  Execution: ["Contributes", "Performs", "Owns", "Improves", "Revolutionizes"],
  Craft: ["Foundational", "Proficient", "Advanced", "Expert", "Pioneers"],
  "Scope of Influence": ["Self", "Team", "Multi-team", "Company", "Industry"],
  People: ["Learns", "Supports", "Mentors", "Coordinates", "Manages"],
  Impact: ["Considers", "Comprehends", "Organizes", "Proactive", "Strategizes"],
};
const views = [
  { name: "General", axes: Object.keys(generalLabels), levels: ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5"] },
  { name: "Software Engineer", axes: ["Execution", "Engineering Best Practices", "Customer Focus", "Leadership", "Vision and Strategy"], levels: ["Engineer I", "Engineer II", "Mid Level", "Senior Engineer I", "Staff Engineer", "Principal Engineer I"] },
  { name: "Engineering Manager", axes: ["Results", "Technology", "Collaboration", "People", "Vision and Strategy"], levels: ["M3 Engineering Manager", "M4 Senior Engineering Manager", "M5 Director of Engineering", "M6 Senior Director of Engineering", "M7 Vice President of Engineering", "M8 CTO"] },
];

async function chooseView(page: Page, name: string) {
  await page.getByRole("combobox", { name: "View", exact: true }).click();
  await page.getByRole("option", { name, exact: true }).click();
  // Pointer clicks bypass actionability checks; wait for the menu's closing overlay.
  await page.getByRole("listbox", { includeHidden: true }).waitFor({ state: "detached" });
}
const graphSlider = (page: Page, axis: string) => page.getByRole("slider", { name: `${axis} graph level`, exact: true });
const details = (page: Page) => page.getByRole("region", { name: "Capability details" });
const selectedTable = (page: Page) => page.getByRole("table", { name: "Selected capability values", exact: true });

// Derive pointer positions from the rendered axis, not application data or geometry constants.
async function graphPoint(page: Page, axis: string, level: number) {
  await page.locator("svg[aria-label^='Interactive spider graph']").scrollIntoViewIfNeeded();
  return graphSlider(page, axis).evaluate((element, value) => {
    const line = element.querySelector("line")!;
    const svg = element.closest("svg")!;
    const max = Number(element.getAttribute("aria-valuemax"));
    const x1 = Number(line.getAttribute("x1"));
    const y1 = Number(line.getAttribute("y1"));
    const x2 = Number(line.getAttribute("x2"));
    const y2 = Number(line.getAttribute("y2"));
    const point = new DOMPoint(x1 + (x2 - x1) * value / max, y1 + (y2 - y1) * value / max).matrixTransform(svg.getScreenCTM()!);
    return { x: point.x, y: point.y };
  }, level);
}
async function clickLevel(page: Page, axis: string, level: number) {
  const point = await graphPoint(page, axis, level);
  await page.mouse.click(point.x, point.y);
  await expect(graphSlider(page, axis)).toHaveAttribute("aria-valuenow", String(Math.round(level)));
}
async function dragLevel(page: Page, axis: string, level: number) {
  const from = await graphPoint(page, axis, Number(await graphSlider(page, axis).getAttribute("aria-valuenow")));
  const to = await graphPoint(page, axis, level);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 5 });
  await page.mouse.up();
}
async function selectAxis(page: Page, axis: string) {
  await page.getByRole("button", { name: `Inspect ${axis}`, exact: true }).click();
}

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("presentation, selection, direct adjustment, and synchronized summary", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("General career development");
  await expect(page.getByText("Interactively explore your progression and growth.", { exact: true })).toBeVisible();
  await expect(page.getByText("Click to adjust a point along any axis", { exact: true })).toHaveCSS("font-style", "italic");
  await expect(page.getByText("Selected capability", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Example level", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Reset to Default" })).toBeVisible();
  const sectionOrder = await page.locator("main").evaluate((main) => [...main.querySelectorAll('svg, h2')].map((e) => e.tagName === "svg" ? "graph" : e.textContent));
  expect(sectionOrder.indexOf("graph")).toBeLessThan(sectionOrder.indexOf("Summary"));
  expect(sectionOrder.indexOf("Summary")).toBeLessThan(sectionOrder.indexOf("Capability table"));

  const before = await selectedTable(page).innerText();
  await selectAxis(page, "Execution");
  await expect(details(page).getByRole("heading", { name: "Execution", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Inspect Execution", exact: true })).toHaveCSS("text-decoration-line", "underline");
  await expect(page.getByRole("button", { name: "Inspect Execution", exact: true })).toHaveCSS("font-weight", "700");
  await expect(selectedTable(page)).toHaveText(before, { useInnerText: true });
  await clickLevel(page, "Autonomy", 4);
  await expect(graphSlider(page, "Autonomy")).toHaveAttribute("aria-valuenow", "4");
  await expect(details(page).getByRole("heading", { name: "Autonomy", exact: true })).toBeVisible();
  await expect(details(page).getByText("Empowered", { exact: true })).toBeVisible();
  await dragLevel(page, "Execution", 2);
  await expect(graphSlider(page, "Execution")).toHaveAttribute("aria-valuenow", "2");
  await expect(details(page).getByText("Performs", { exact: true })).toBeVisible();

  for (const axis of views[0].axes) await clickLevel(page, axis, 3);
  await expect(page.getByText(`Strengths: ${views[0].axes.join(", ")}`, { exact: true })).toBeVisible();
  await expect(page.getByText(`Lowest: ${views[0].axes.join(", ")}`, { exact: true })).toBeVisible();
  await clickLevel(page, "Autonomy", 5);
  await clickLevel(page, "Execution", 5);
  await clickLevel(page, "Scope of Influence", 1);
  await expect(page.getByText("Strengths: Autonomy, Execution", { exact: true })).toBeVisible();
  await expect(page.getByText("Lowest: Scope of Influence", { exact: true })).toBeVisible();
});

test("pointer boundaries, rounding, rapid changes, and interrupted drag", async ({ page }) => {
  for (const axis of views[0].axes) await clickLevel(page, axis, 3);
  await clickLevel(page, "Autonomy", 3.7);
  await expect(graphSlider(page, "Autonomy")).toHaveAttribute("aria-valuenow", "4");
  const before = await selectedTable(page).innerText();
  const box = await page.locator("svg[aria-label^='Interactive spider graph']").boundingBox();
  await page.mouse.click(box!.x + 15, box!.y + 15);
  await expect(selectedTable(page)).toHaveText(before, { useInnerText: true });

  for (const axis of views[0].axes) {
    await dragLevel(page, axis, -1);
    await expect(graphSlider(page, axis)).toHaveAttribute("aria-valuenow", "1");
    await dragLevel(page, axis, 7);
    await expect(graphSlider(page, axis)).toHaveAttribute("aria-valuenow", "5");
    await expect(details(page).getByText("At the outer level", { exact: true })).toBeVisible();
    await clickLevel(page, axis, 3);
  }
  for (const level of [4, 1, 3, 5, 2]) {
    await clickLevel(page, "Autonomy", level);
    await clickLevel(page, "Execution", level === 2 ? 5 : level);
  }
  await expect(graphSlider(page, "Autonomy")).toHaveAttribute("aria-valuenow", "2");
  await expect(graphSlider(page, "Execution")).toHaveAttribute("aria-valuenow", "5");
  for (const axis of views[0].axes.slice(2)) await expect(graphSlider(page, axis)).toHaveAttribute("aria-valuenow", "3");
  await expect(page.getByText("Strengths: Execution", { exact: true })).toBeVisible();
  await expect(page.getByText("Lowest: Autonomy", { exact: true })).toBeVisible();

  const start = await graphPoint(page, "Autonomy", 2);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width + 30, box!.y);
  await page.mouse.up();
  const settled = await graphSlider(page, "Autonomy").getAttribute("aria-valuenow");
  await page.mouse.move(start.x, start.y);
  await clickLevel(page, "Craft", 4);
  await expect(graphSlider(page, "Autonomy")).toHaveAttribute("aria-valuenow", settled!);
  await expect(graphSlider(page, "Craft")).toHaveAttribute("aria-valuenow", "4");
});

for (const view of views) test(`${view.name}: every capability and level, selected values, expanded content`, async ({ page }) => {
  await chooseView(page, view.name);
  await expect(page.locator("svg").getByRole("slider")).toHaveCount(view.axes.length);
  await expect(page.getByRole("button", { name: /^Full ladder:/ }).first()).toHaveAttribute("aria-expanded", "false");
  for (const axis of view.axes) {
    await selectAxis(page, axis);
    const expand = page.getByRole("button", { name: `Full ladder: ${axis}`, exact: true });
    await expand.click();
    const table = page.getByRole("table", { name: `${axis} full ladder`, exact: true });
    for (const name of view.levels) {
      const header = view.name === "Engineering Manager" && /^M[78] /.test(name) ? `${name} Proposed synthesis` : name;
      await expect(table.getByRole("columnheader", { name: header, exact: true })).toBeVisible();
    }
    const slider = details(page).getByRole("slider");
    await slider.focus();
    await slider.press("Home");
    for (let level = 1; level <= view.levels.length; level++) {
      if (level > 1) await slider.press("ArrowRight");
      const label = view.name === "General" ? generalLabels[axis][level - 1] : view.levels[level - 1];
      await expect(graphSlider(page, axis)).toHaveAttribute("aria-valuenow", String(level));
      await expect(details(page).getByText(label, { exact: true })).toBeVisible();
      const row = selectedTable(page).getByRole("row").filter({ has: page.getByRole("button", { name: axis, exact: true }) });
      await expect(row).toContainText(label);
      const explanation = await row.getByRole("cell").nth(2).innerText();
      await expect(details(page).getByText(explanation, { exact: true })).toBeVisible();
      await expect(table.getByRole("cell", { name: label, exact: true }).first()).toBeVisible();
      if (view.name === "Software Engineer" && level > 4) {
        await expect(table.getByRole("cell", { name: "—", exact: true }).first()).toBeVisible();
        await expect(page.getByRole("region", { name: `Full ladder: ${axis}`, exact: true }).getByText("Detailed draft content ends at Senior Engineer I; later competency cells are not provided.", { exact: true })).toBeVisible();
      }
    }
    await expand.click();
    await expand.click();
    await expect(graphSlider(page, axis)).toHaveAttribute("aria-valuenow", String(view.levels.length));
    await expand.click();
  }
});

test("view-specific references and footer destinations", async ({ page, context }) => {
  const expected = [
    ["https://dropbox.github.io/dbx-career-framework/", "https://www.frontendhappyhour.com/episodes/engineering-levels-our-glass-level-is-full", "https://sfelc.com/podcasts/building-autonomous-teams-and-engineering-career-ladders-sri-viswanath", "https://www.frontendhappyhour.com/episodes/how-promotions-really-work-in-tech"],
    ["https://www.levels.fyi/blog/what-are-career-levels-ladders.html", "https://se-radio.net/2022/06/episode-515-swizec-teller-on-becoming-a-senior-engineer/", "https://newsletter.pragmaticengineer.com/p/what-is-a-principal-engineer-at-amazon", "https://www.youtube.com/watch?v=bOG5GTM_yXs"],
    ["https://github.com/sourcegraph/handbook/blob/main/content/benefits-pay-perks/pay-expenses/compensation/leveling-guide.md", "https://www.developing.dev/p/frontline-manager-at-meta-to-senior", "https://www.effectiveem.com/building-managers-leading-from-the-back-leading-from-the-front/", "https://sfelc.com/podcasts/conscious-career-growth-part-2", "https://ericbrooke.blog/2018/09/16/software-engineering-leadership/"],
  ];
  // Verify navigation destinations without relying on third-party availability or subscriptions.
  await context.route(/^https:\/\//, (route) => route.fulfill({ body: "Reference destination" }));
  for (const [index, view] of views.entries()) {
    await chooseView(page, view.name);
    const links = page.getByRole("region", { name: "References", exact: true }).getByRole("link");
    expect(await links.evaluateAll((elements) => elements.map((e) => e.getAttribute("href")))).toEqual(expected[index]);
    for (const link of await links.all()) {
      const href = await link.getAttribute("href");
      const [popup] = await Promise.all([page.waitForEvent("popup"), link.click()]);
      await expect(popup).toHaveURL(href!);
      await popup.close();
    }
  }
  await expect(page.getByRole("contentinfo")).toContainText("Built by John Pfeiffer");
  for (const [name, href] of [["John Pfeiffer on LinkedIn", "https://www.linkedin.com/in/foupfeiffer"], ["Source code on GitHub", "https://github.com/johnpfeiffer/career-coach"]]) {
    const link = page.getByRole("contentinfo").getByRole("link", { name });
    await expect(link).toHaveAttribute("href", href);
    const [popup] = await Promise.all([page.waitForEvent("popup"), link.click()]);
    await expect(popup).toHaveURL(href);
    await popup.close();
  }
});

test("independent profiles, reload, different scales, and active-view reset", async ({ page }) => {
  const defaults: string[] = [];
  for (const view of views) {
    await chooseView(page, view.name);
    defaults.push(await selectedTable(page).innerText());
  }
  await chooseView(page, "General");
  await clickLevel(page, "Execution", 1);
  const general = await selectedTable(page).innerText();
  await chooseView(page, "Software Engineer");
  await clickLevel(page, "Execution", 6);
  const software = await selectedTable(page).innerText();
  await chooseView(page, "Engineering Manager");
  await clickLevel(page, "People", 5);
  const manager = await selectedTable(page).innerText();
  for (const [index, expected] of [general, software, manager].entries()) {
    await chooseView(page, views[index].name);
    await expect(selectedTable(page)).toHaveText(expected, { useInnerText: true });
  }
  await chooseView(page, "Software Engineer");
  await page.reload();
  await expect(page.getByRole("combobox", { name: "View", exact: true })).toHaveText("Software Engineer");
  await expect(selectedTable(page)).toHaveText(software, { useInnerText: true });
  await page.getByRole("button", { name: "Reset to Default" }).click();
  await expect(selectedTable(page)).toHaveText(defaults[1], { useInnerText: true });
  await page.reload();
  await expect(selectedTable(page)).toHaveText(defaults[1], { useInnerText: true });
  await chooseView(page, "General");
  await expect(selectedTable(page)).toHaveText(general, { useInnerText: true });
  await chooseView(page, "Engineering Manager");
  await expect(selectedTable(page)).toHaveText(manager, { useInnerText: true });
});

test("manager guidance, complete competencies, and embedded source links", async ({ page, context }) => {
  await chooseView(page, "Engineering Manager");
  await page.getByRole("button", { name: "How to read this draft ladder", exact: true }).click();
  await expect(page.getByText("Accountability carries forward; daily tasks change.", { exact: true })).toBeVisible();
  const guideLink = page.getByRole("link", { name: "GitLab career development", exact: true }).first();
  await expect(guideLink).toHaveAttribute("href", "https://handbook.gitlab.com/handbook/engineering/careers/management/management-career-development/");
  await context.route(/^https:\/\//, (route) => route.fulfill({ body: "Embedded reference destination" }));
  const [popup] = await Promise.all([page.waitForEvent("popup"), guideLink.click()]);
  await expect(popup).toHaveURL("https://handbook.gitlab.com/handbook/engineering/careers/management/management-career-development/");
  await popup.close();
  await page.getByRole("button", { name: "Full ladder: Technology", exact: true }).click();
  const table = page.getByRole("table", { name: "Technology full ladder", exact: true });
  await expect(table.getByRole("row").filter({ hasText: "AI / LLM — kernel-derived" }))
    .toContainText("Decide where AI contributes to technology or product strategy");
  await expect(table.getByRole("cell", { name: "—", exact: true })).toHaveCount(0);
  await selectAxis(page, "Technology");
  await details(page).getByRole("slider").press("End");
  await expect(details(page)).toContainText("M8 CTO");
  await expect(details(page)).toContainText("Proposed synthesis");
  await expect(page.getByRole("link", { name: "Larson transcript, 23:50–25:38", exact: true }))
    .toHaveAttribute("href", "https://www.youtube.com/watch?v=TkA5A7BJF2k&t=1430s");
  for (const title of ["Levels", "Role essentials", "Distinguishing adjacent roles", "Backlog and parking lot", "Sources and contribution notes"]) {
    const expand = page.getByRole("button", { name: title, exact: true });
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await expand.click();
    await expect(page.getByRole("table", { name: `${title} table 1`, exact: true })).toBeVisible();
    await expand.click();
  }
});

test("changed manager titles start a fresh profile while other saved views survive", async ({ page }) => {
  await expect(graphSlider(page, "Execution")).toBeVisible();
  await page.evaluate(() => {
    localStorage.setItem("career-coach-profile-v2-engineering-manager", JSON.stringify({ results: 5, "manager-people": 5, "manager-strategy": 5 }));
    localStorage.removeItem("career-coach-profile-v3-engineering-manager");
    localStorage.setItem("career-coach-profile-v2-general", JSON.stringify({ autonomy: 4, "general-execution": 1 }));
  });
  await page.reload();
  await expect(graphSlider(page, "Execution")).toHaveAttribute("aria-valuenow", "1");
  await chooseView(page, "Engineering Manager");
  await expect(graphSlider(page, "Results")).toHaveAttribute("aria-valuenow", "2");
  await expect(graphSlider(page, "People")).toHaveAttribute("aria-valuenow", "2");
  await expect(graphSlider(page, "Technology")).toHaveAttribute("aria-valuenow", "2");
  await clickLevel(page, "Collaboration", 6);
  await page.reload();
  await expect(graphSlider(page, "Collaboration")).toHaveAttribute("aria-valuenow", "6");
  await chooseView(page, "General");
  await expect(graphSlider(page, "Execution")).toHaveAttribute("aria-valuenow", "1");
});
