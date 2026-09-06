import { expect, test } from "@playwright/test";

test("table cell opens its inspector and permanent entry", async ({ page }) => {
  await page.goto("/table");
  const cell = page.locator('[data-cell="2-1"]:visible');
  await cell.click();
  await expect(page.getByLabel("Selected group")).toBeVisible();
  await page.getByRole("link", { name: /open full entry/i }).click();
  await expect(page).toHaveURL(/\/groups\/spheres\/2\/3$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("explore filters persist in the URL and comparison opens", async ({ page }) => {
  await page.goto("/explore");
  await page.getByText("finite", { exact: true }).first().click();
  await expect(page).toHaveURL(/kind=finite/);
  await page.getByRole("button", { name: "+ Compare" }).first().click();
  await page.getByRole("button", { name: /compare 1 group/i }).click();
  await expect(page.getByRole("heading", { name: "Compare groups" })).toBeVisible();
});

test("out-of-coverage routes explain the distinction", async ({ page }) => {
  await page.goto("/groups/spheres/30/99");
  await expect(page.getByRole("heading", { name: "This entry is not in the Atlas." })).toBeVisible();
  await expect(page.getByText(/does not mean the mathematics is unknown/i)).toBeVisible();
});
