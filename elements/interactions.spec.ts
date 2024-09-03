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
  });
  test.describe("Droppable", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Droppable").click();
    });
    test.use({
      viewport: { width: 1600, height: 1200 },
    });

    test("Simple element shoud dropped to another, and styles of second element changed correctly", async ({
      page,
    }) => {
      const elementToDraged = page.getByText("Drag me", { exact: true });
      const elementToDropOn = page.getByLabel("Simple").locator("#droppable");
      await expect(elementToDropOn).toContainText("Drop here");
      await elementToDraged.dragTo(elementToDropOn);
      await expect(elementToDropOn).toContainText("Dropped!");
    });
    test("Accept element shoud dropped to another, and styles of second element changed correctly", async ({
      page,
    }) => {
      await page.getByRole("tab", { name: "Accept" }).click();
      const acceptableElementToDraged = page.getByText("Acceptable", {
        exact: true,
      });
      const elementToDropOn = page.getByLabel("Accept").locator("#droppable");

      await expect(elementToDropOn).toContainText("Drop here");
      await acceptableElementToDraged.dragTo(elementToDropOn);
      await expect(elementToDropOn).toContainText("Dropped!");
      await expect(elementToDropOn).toHaveClass(/ui-state-highlight/);
    });
    test("Not Accepted element shouldnt change text or styles when dropped", async ({
      page,
    }) => {
      await page.getByRole("tab", { name: "Accept" }).click();
      const notAcceptableElementToDraged = page.getByText("Not Acceptable", {
        exact: true,
      });
      const elementToDropOn = page.getByLabel("Accept").locator("#droppable");
      await expect(elementToDropOn).toContainText("Drop here");
      await notAcceptableElementToDraged.dragTo(elementToDropOn);
      await expect(elementToDropOn).toContainText("Drop here");
      await expect(elementToDropOn).not.toHaveClass(/ui-state-highlight/);
    });
    test("Accept element shoud hovered to another, and styles of second element changed correctly", async ({
      page,
    }) => {
      await page.getByRole("tab", { name: "Accept" }).click();
      const acceptableElementToDraged = page.getByText("Acceptable", {
        exact: true,
      });
      const elementToDropOn = page.getByLabel("Accept").locator("#droppable");

      await expect(elementToDropOn).toContainText("Drop here");
      await acceptableElementToDraged.hover();
      await page.mouse.down();
      await elementToDropOn.hover();
      await expect(elementToDropOn).toHaveClass(/ui-droppable-hover/);
    });
    test(" Not Accept element shoud hovered to another, and styles of second element changed correctly", async ({
      page,
    }) => {
      await page.getByRole("tab", { name: "Accept" }).click();
      const notAcceptableElementToDraged = page.getByText("Not Acceptable", {
        exact: true,
      });
      const elementToDropOn = page.getByLabel("Accept").locator("#droppable");

      await expect(elementToDropOn).toContainText("Drop here");
      await notAcceptableElementToDraged.hover();
      await page.mouse.down();
      await elementToDropOn.hover();
      await expect(elementToDropOn).toContainText("Drop here");
      await expect(elementToDropOn).not.toHaveClass(/ui-droppable-hover/);
    });

    test("Prevent propogation element should correct change styles of dropOn elements when drag to inner elements of not greedy", async ({
      page,
    }) => {
      await page.getByRole("tab", { name: "Prevent propogation" }).click();
      const draggableElement = page.locator("#dragBox");
      const outerNotGreedyDroppableElement = page.locator("#notGreedyDropBox");
      const innerNotGreedyDroppableElement = page.locator(
        "#notGreedyInnerDropBox"
      );

      await draggableElement.dragTo(innerNotGreedyDroppableElement);
      await expect(innerNotGreedyDroppableElement).toHaveText("Dropped!");
      await expect(outerNotGreedyDroppableElement).toHaveText(
        "Dropped!Dropped!"
      );
      await expect(innerNotGreedyDroppableElement).toHaveClass(/ui-droppable/);
      await expect(outerNotGreedyDroppableElement).toHaveClass(/ui-droppable/);
    });
    test("Prevent propogation element should correct change styles of dropOn elements when drag to inner elements of greedy", async ({
      page,
    }) => {
      await page.getByRole("tab", { name: "Prevent Propogation" }).click();
      const draggableElement = page.locator("#dragBox");
      const outerGreedyDroppableElement = page.locator("#greedyDropBox");
      const innerGreedyDroppableElement = page.locator("#greedyDropBoxInner");

      await draggableElement.dragTo(innerGreedyDroppableElement);
      await expect(innerGreedyDroppableElement).toHaveText("Dropped!");
      await expect(outerGreedyDroppableElement).toHaveText(
        "Outer droppableDropped!"
      );
      await expect(innerGreedyDroppableElement).toHaveClass(/ui-droppable/);
      await expect(outerGreedyDroppableElement).toHaveClass(/ui-droppable/);
    });

    test("element 'Will revert' should revert to first position after drop", async ({
      page,
    }) => {
      await page.getByRole("tab", { name: "Revert Draggable" }).click();
      const willRevertElement = page.locator("#revertable");
      const box = await willRevertElement.boundingBox();
      const droppableBox = page
        .getByLabel("Revert Draggable")
        .locator("#droppable");
      await willRevertElement.dragTo(droppableBox);
      await page.waitForTimeout(1000);
      const newBox = await willRevertElement.boundingBox();
      expect(box).toEqual(newBox);
    });
    test("element 'Not revert' should stay at new position after drop", async ({
      page,
    }) => {
      await page.getByRole("tab", { name: "Revert Draggable" }).click();
      const notRevertElement = page.locator("#notRevertable");
      const box = await notRevertElement.boundingBox();
      const droppableBox = page
        .getByLabel("Revert Draggable")
        .locator("#droppable");
      await notRevertElement.dragTo(droppableBox);
      await page.waitForTimeout(550);
      const newBox = await notRevertElement.boundingBox();
      expect(box).not.toEqual(newBox);
    });
  });
  test.describe("Dragabble", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Dragabble").click();
    });
    test.use({
      viewport: { width: 1600, height: 1200 },
    });

    test("simple element should be draggable", async ({ page }) => {
      await page.getByRole("tab", { name: "Simple" }).click();
      const dragabbleElement = page.locator("#dragBox");
      await dragabbleElement.hover();
      console.log(await dragabbleElement.boundingBox({ timeout: 1000 }));
      await page.mouse.down();
      await page.mouse.move(400, 400);
      const box = await dragabbleElement.boundingBox({ timeout: 1000 });
      console.log(box);
      expect(Math.round(box!.x + box!.width / 2)).toEqual(400);
      expect(Math.round(box!.y + box!.height)).toEqual(420);
    });
    test("axis restricted X element should be draggable only by X axis ", async ({
      page,
    }) => {
      await page.getByRole("tab", { name: "Axis Restricted" }).click();
      const dragabbleElementX = page.locator("#restrictedX");
      const firstPosition = await dragabbleElementX.boundingBox({
        timeout: 1000,
      });
      console.log(firstPosition);
      await dragabbleElementX.hover();
      await page.mouse.down();
      await page.mouse.move(400, 400);
      const lastPosition = await dragabbleElementX.boundingBox({
        timeout: 1000,
      });
      console.log(lastPosition);
      expect(Math.round(lastPosition!.x)).toEqual(350);
      expect(Math.round(lastPosition!.y)).toEqual(firstPosition!.y);
    });
    test("axis restricted Y element should be draggable only by Y axis ", async ({
      page,
    }) => {
      await page.getByRole("tab", { name: "Axis Restricted" }).click();
      const dragabbleElementX = page.locator("#restrictedY");
      const firstPosition = await dragabbleElementX.boundingBox({
        timeout: 1000,
      });
      console.log(firstPosition);
      await dragabbleElementX.hover();
      await page.mouse.down();
      await page.mouse.move(200, 200);

      const lastPosition = await dragabbleElementX.boundingBox({
        timeout: 1000,
      });
      console.log(lastPosition);

      expect(Math.round(lastPosition!.y)).toEqual(180);
      expect(Math.round(lastPosition!.x)).toEqual(Math.round(firstPosition!.x));
    });
  });
});
