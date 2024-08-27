import { test, expect, Page, Locator } from "@playwright/test";
import path from "path";

test.describe("Interactions", () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.fixme(isMobile, "Settings page does not work in mobile yet");
    await page.goto("https://demoqa.com/elements");
    await page.getByText("Interactions").click();
  });
  test.describe("Sortable", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Sortable").click();
    });

    test(" list should be work correctly", async ({ page }) => {
      const draggableItemsContainer = page
        .locator("#demo-tabpane-list")
        .locator(".list-group-item-action");

      const secondElement = draggableItemsContainer.nth(1);
      expect(await secondElement.innerText()).toEqual("Two");
      const fourthElement = draggableItemsContainer.nth(3);
      expect(await fourthElement.innerText()).toEqual("Four");
      await secondElement.dragTo(fourthElement);
      expect(await secondElement.innerText()).toEqual("Three");
      expect(await fourthElement.innerText()).toEqual("Two");
    });
    test(" grid should be work correctly", async ({ page }) => {
      await page.getByRole("tab", { name: "Grid" }).click();
      const draggableItemsContainer = page
        .locator("#demo-tabpane-grid")
        .locator(".list-group-item-action");

      const secondElement = draggableItemsContainer.nth(1);
      expect(await secondElement.innerText()).toEqual("Two");
      const fourthElement = draggableItemsContainer.nth(3);
      expect(await fourthElement.innerText()).toEqual("Four");
      await secondElement.dragTo(fourthElement);
      expect(await secondElement.innerText()).toEqual("Three");
      expect(await fourthElement.innerText()).toEqual("Two");
    });
  });
  test.describe("Selectable", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Selectable").click();
    });

    test(" list should be selected correctly", async ({ page }) => {
      const draggableItemsContainer = page
        .locator("#demo-tabpane-list")
        .locator(".list-group-item-action");

      const secondElement = draggableItemsContainer.nth(1);
      await expect(secondElement).not.toHaveClass(/active/);
      await secondElement.click();
      await expect(secondElement).toHaveClass(/active/);

      const fourthElement = draggableItemsContainer.nth(3);
      await expect(fourthElement).not.toHaveClass(/active/);
      await fourthElement.click();
      await expect(fourthElement).toHaveClass(/active/);

      await secondElement.click();
      await expect(secondElement).not.toHaveClass(/active/);
      await expect(fourthElement).toHaveClass(/active/);
    });
    test(" grid should be work correctly", async ({ page }) => {
      await page.getByRole("tab", { name: "Grid" }).click();
      const draggableItemsContainer = page
        .locator("#demo-tabpane-grid")
        .locator(".list-group-item-action");

      const secondElement = draggableItemsContainer.nth(1);
      await expect(secondElement).not.toHaveClass(/active/);
      await secondElement.click();
      await expect(secondElement).toHaveClass(/active/);

      const fourthElement = draggableItemsContainer.nth(3);
      await expect(fourthElement).not.toHaveClass(/active/);
      await fourthElement.click();
      await expect(fourthElement).toHaveClass(/active/);

      await secondElement.click();
      await expect(secondElement).not.toHaveClass(/active/);
      await expect(fourthElement).toHaveClass(/active/);
    });
  });
  test.describe("Resizable", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Resizable").click();
    });

    test(" resizable Box with restriction should work correctly", async ({
      page,
    }) => {
      const resizableBoxWithRestriction = page.locator(
        "#resizableBoxWithRestriction"
      );
      const style = await resizableBoxWithRestriction.getAttribute("style");
      expect(style).toContain("width: 200px; height: 200px;");
      const resizableBoxCursor = resizableBoxWithRestriction.locator("span");

      await resizableBoxCursor.hover();
      await page.mouse.down();
      await page.mouse.move(1200, 800);
      await page.mouse.up();
      expect(await resizableBoxWithRestriction.getAttribute("style")).toContain(
        "width: 500px; height: 300px;"
      );
      await resizableBoxCursor.hover();
      await page.mouse.down();
      await page.mouse.move(10, 10);
      await page.mouse.up();
      expect(await resizableBoxWithRestriction.getAttribute("style")).toContain(
        "width: 150px; height: 150px;"
      );
    });
    test(" grid should be work correctly", async ({ page }) => {
      await page.getByRole("tab", { name: "Grid" }).click();
      const draggableItemsContainer = page
        .locator("#demo-tabpane-grid")
        .locator(".list-group-item-action");

      const secondElement = draggableItemsContainer.nth(1);
      expect(await secondElement.innerText()).toEqual("Two");
      const fourthElement = draggableItemsContainer.nth(3);
      expect(await fourthElement.innerText()).toEqual("Four");
      await secondElement.dragTo(fourthElement);
      expect(await secondElement.innerText()).toEqual("Three");
      expect(await fourthElement.innerText()).toEqual("Two");
    });
  });
  test.describe("Droppable", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Droppable").click();
    });

    test(" list should be work correctly", async ({ page }) => {
      const draggableItemsContainer = page
        .locator("#demo-tabpane-list")
        .locator(".list-group-item-action");

      const secondElement = draggableItemsContainer.nth(1);
      expect(await secondElement.innerText()).toEqual("Two");
      const fourthElement = draggableItemsContainer.nth(3);
      expect(await fourthElement.innerText()).toEqual("Four");
      await secondElement.dragTo(fourthElement);
      expect(await secondElement.innerText()).toEqual("Three");
      expect(await fourthElement.innerText()).toEqual("Two");
    });
    test(" grid should be work correctly", async ({ page }) => {
      await page.getByRole("tab", { name: "Grid" }).click();
      const draggableItemsContainer = page
        .locator("#demo-tabpane-grid")
        .locator(".list-group-item-action");

      const secondElement = draggableItemsContainer.nth(1);
      expect(await secondElement.innerText()).toEqual("Two");
      const fourthElement = draggableItemsContainer.nth(3);
      expect(await fourthElement.innerText()).toEqual("Four");
      await secondElement.dragTo(fourthElement);
      expect(await secondElement.innerText()).toEqual("Three");
      expect(await fourthElement.innerText()).toEqual("Two");
    });
  });
  test.describe("Draggable", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Draggable").click();
    });

    test(" list should be work correctly", async ({ page }) => {
      const draggableItemsContainer = page
        .locator("#demo-tabpane-list")
        .locator(".list-group-item-action");

      const secondElement = draggableItemsContainer.nth(1);
      expect(await secondElement.innerText()).toEqual("Two");
      const fourthElement = draggableItemsContainer.nth(3);
      expect(await fourthElement.innerText()).toEqual("Four");
      await secondElement.dragTo(fourthElement);
      expect(await secondElement.innerText()).toEqual("Three");
      expect(await fourthElement.innerText()).toEqual("Two");
    });
    test(" grid should be work correctly", async ({ page }) => {
      await page.getByRole("tab", { name: "Grid" }).click();
      const draggableItemsContainer = page
        .locator("#demo-tabpane-grid")
        .locator(".list-group-item-action");

      const secondElement = draggableItemsContainer.nth(1);
      expect(await secondElement.innerText()).toEqual("Two");
      const fourthElement = draggableItemsContainer.nth(3);
      expect(await fourthElement.innerText()).toEqual("Four");
      await secondElement.dragTo(fourthElement);
      expect(await secondElement.innerText()).toEqual("Three");
      expect(await fourthElement.innerText()).toEqual("Two");
    });
  });
});
