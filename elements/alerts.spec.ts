import { test, expect, Dialog } from "@playwright/test";
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
      await page.locator("li").filter({ hasText: "Alerts" }).click();
    });

    test("button to see alert should work correctly", async ({ page }) => {
      page.on("dialog", async (dialog) => {
        expect(dialog.type()).toBe("alert");
        expect(dialog.message()).toBe("You clicked a button");
        await dialog.accept();
      });
      await page.locator("#alertButton").click();
    });
    test("button to see time alert should work correctly", async ({ page }) => {
      const startTime = Date.now();

      await page.locator("#timerAlertButton").click();

      const dialogPromise = new Promise<{ dialog: Dialog; endTime: number }>(
        (resolve) => {
          page.once("dialog", async (dialog) => {
            const endTime = Date.now();
            resolve({ dialog, endTime });
          });
        }
      );
      const { dialog, endTime } = await dialogPromise;
      const elapsedTime = endTime - startTime;

      expect(elapsedTime).toBeGreaterThanOrEqual(5000);
      expect(elapsedTime).toBeLessThan(6000);
      expect(dialog.message()).toBe("This alert appeared after 5 seconds");
      expect(dialog.type()).toBe("alert");

      await dialog.accept();
    });

    test("button to see confirm should work correctly", async ({ page }) => {
      page.once("dialog", async (dialog: Dialog) => {
        expect(dialog.type()).toBe("confirm");
        expect(dialog.message()).toBe("Do you confirm action?");
        await dialog.dismiss();
        await expect(page.getByText("You selected Cancel")).toBeVisible();
      });
      await page.locator("#confirmButton").click();
      page.once("dialog", async (dialog: Dialog) => {
        expect(dialog.type()).toBe("confirm");
        expect(dialog.message()).toBe("Do you confirm action?");
        await dialog.accept();
        await expect(page.getByText("You selected OK")).toBeVisible();
      });
      await page.locator("#confirmButton").click();
    });

    test("button to see promt box work correctly", async ({ page }) => {
      //Add
      page.once("dialog", async (dialog: Dialog) => {
        expect(dialog.type()).toBe("prompt");
        await dialog.accept("Test Data");
      });
      await page.locator("#promtButton").click();
      await expect(page.getByText("You entered Test Data")).toBeVisible();

      //Update
      page.once("dialog", async (dialog: Dialog) => {
        expect(dialog.type()).toBe("prompt");
        await dialog.accept("New Test Data");
      });
      await page.locator("#promtButton").click();
      await expect(page.getByText("You entered New Test Data")).toBeVisible();

      // Delete
      page.once("dialog", async (dialog: Dialog) => {
        expect(dialog.type()).toBe("prompt");
        await dialog.accept();
      });
      await page.locator("#promtButton").click();
      await expect(page.getByText("You entered Test Data")).not.toBeVisible();
    });
  });

  test.describe("Frame", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("li")
        .filter({ hasText: "Frames", hasNotText: "Nested" })
        .click();
    });
    test(" 1 should load the correct content", async ({ page }) => {
      const frame = page.frameLocator("#frame1");
      expect(frame).not.toBeNull();
      if (frame) {
        const frameContent = await frame.locator("body").textContent();
        expect(frameContent).toContain("This is a sample page");
      }
    });

    test("2 should load the correct content and have correct dimensions", async ({
      page,
    }) => {
      const frame = page.frameLocator("#frame2");
      expect(frame).not.toBeNull();

      const frameContent = await frame.locator("body").textContent();
      expect(frameContent).toContain("This is a sample page");

      const frameElement = page.locator("#frame2");
      const width = await frameElement.evaluate((el) =>
        el.getAttribute("width")
      );
      const height = await frameElement.evaluate((el) =>
        el.getAttribute("height")
      );

      expect(width).toBe("100px");
      expect(height).toBe("100px");
    });
  });
  test.describe("Nested Frame", () => {
    test.beforeEach(async ({ page }) => {
      await page.locator("li").filter({ hasText: "Nested Frames" }).click();
    });

    test("should correct show content", async ({ page }) => {
      //Parent
      const parentFrame = page.frameLocator("#frame1");
      expect(parentFrame).not.toBeNull();
      const frameContent = await parentFrame.locator("body").textContent();
      expect(frameContent).toContain("Parent frame");

      //Child
      const childFrame = parentFrame.frameLocator("iframe");
      expect(childFrame).not.toBeNull();
      const framechildContent = await childFrame.locator("body").textContent();
      expect(framechildContent).toContain("Child Iframe");
    });
  });
  test.describe("Modal Dialogs", () => {
    test.beforeEach(async ({ page }) => {
      await page.locator("li").filter({ hasText: "Modal Dialogs" }).click();
    });

    test("should correct work small modal", async ({ page }) => {
      await page.getByRole("button", { name: "Small modal" }).click();
      await expect(
        page.getByText("This is a small modal. It has")
      ).toBeVisible();
      // expect(page.getByRole("document")).toBeVisible();
      await page.locator("#closeSmallModal").click();
      await expect(
        page.getByText("This is a small modal. It has")
      ).not.toBeVisible();
    });

    test("should correct work large modal", async ({ page }) => {
      await page.getByRole("button", { name: "Large modal" }).click();
      await expect(page.getByText("Lorem Ipsum is simply dummy")).toBeVisible();
      await page.locator("#closeLargeModal").click();
      await expect(
        page.getByText("Lorem Ipsum is simply dummy")
      ).not.toBeVisible();
    });
  });
});
