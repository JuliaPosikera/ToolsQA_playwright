import { test, expect, Page, Locator } from "@playwright/test";
import { assert } from "console";

test.describe("Alerts, Frame & Windows", () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.fixme(isMobile, "Settings page does not work in mobile yet");
    await page.goto("https://demoqa.com/elements");
    await page.getByText("Alerts, Frame & Windows").click();
  });

  test.describe("Browser Windows", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Browser Windows").click();
    });

    test("button 'New Tab' should work correctly", async ({ page }) => {
      const [newTab] = await Promise.all([
        page.waitForEvent("popup"),
        page.getByRole("button", { name: "New Tab", exact: true }).click(),
      ]);

      const newPageViewportSize = newTab.viewportSize();
      const mainPageViewportSize = page.viewportSize();

      expect(
        newPageViewportSize!.width === mainPageViewportSize!.width &&
          newPageViewportSize!.height === mainPageViewportSize!.height
      ).toBeTruthy();

      await newTab.close();
    });
    test("button 'New Window Message' should work correctly", async ({
      page,
    }) => {
      const [newTab] = await Promise.all([
        page.waitForEvent("popup"),
        page
          .getByRole("button", { name: "New Window Message", exact: true })
          .click(),
      ]);

      const pageContent = await newTab.content();
      expect(pageContent).toContain("Knowledge increases by");
      await newTab.close();
    });
  });
  test.describe("Alerts", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Alerts").click();
    });

    test("button 'New Tab' should work correctly", async ({ page }) => {
      const [newTab] = await Promise.all([
        page.waitForEvent("popup"),
        page.getByRole("button", { name: "New Tab", exact: true }).click(),
      ]);

      const newPageViewportSize = newTab.viewportSize();
      const mainPageViewportSize = page.viewportSize();

      expect(
        newPageViewportSize!.width === mainPageViewportSize!.width &&
          newPageViewportSize!.height === mainPageViewportSize!.height
      ).toBeTruthy();

      await newTab.close();
    });
    test("button 'New Window Message' should work correctly", async ({
      page,
    }) => {
      const [newTab] = await Promise.all([
        page.waitForEvent("popup"),
        page
          .getByRole("button", { name: "New Window Message", exact: true })
          .click(),
      ]);

      const pageContent = await newTab.content();
      expect(pageContent).toContain("Knowledge increases by");
      await newTab.close();
    });
  });
});
