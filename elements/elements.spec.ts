import { test, expect, Page, Locator } from "@playwright/test";
import path from "path";

test.beforeEach(async ({ page, isMobile }) => {
  test.fixme(isMobile, "Settings page does not work in mobile yet");
  await page.goto("https://demoqa.com/elements");
});

test.describe("Text box", () => {
  let testData = {
    name: "Name",
    email: "Email@example.com",
    currentAddress: "Current random address",
    permanentAddress: "Permanent address",
  };
  test.beforeEach(async ({ page }) => {
    await page.locator("li").filter({ hasText: "Text Box" }).click();
  });

  test("should navigate to '/text-box' url", async ({ page }) => {
    expect(page.url()).toContain("/text-box");
  });

  test("should correctly fill and display the input data after submit", async ({
    page,
  }) => {
    expect.soft(page.locator("#output")).not.toBeVisible();
    await page.getByPlaceholder("Full Name").fill(testData.name);
    await page.getByPlaceholder("name@example.com").fill(testData.email);
    await page
      .getByPlaceholder("Current Address")
      .fill(testData.currentAddress);
    await page.locator("#permanentAddress").fill(testData.permanentAddress);
    await page.getByRole("button", { name: "Submit" }).click();
    expect(
      await page.locator("#output").locator("#name").textContent()
    ).toContain(testData.name);
    expect(
      await page.locator("#output").locator("#email").textContent()
    ).toContain(testData.email);
    expect(
      await page.locator("#output").locator("#currentAddress").textContent()
    ).toContain(testData.currentAddress);
    expect(
      await page.locator("#output").locator("#permanentAddress").textContent()
    ).toContain(testData.permanentAddress);
  });

  test("should make check of correct email adress", async ({ page }) => {
    let inputEmail = page.getByPlaceholder("name@example.com");
    let submitButton = page.getByRole("button", { name: "Submit" });
    inputEmail.fill("test");
    await submitButton.click();
    await expect(inputEmail, "failed with input test").toHaveClass(
      /field-error/
    );

    inputEmail.fill("test@");
    await submitButton.click();
    await expect(inputEmail, "failed with input test@").toHaveClass(
      /field-error/
    );

    inputEmail.fill("test@test");
    await submitButton.click();
    await expect(inputEmail, "failed with input test@test").toHaveClass(
      /field-error/
    );

    inputEmail.fill("test@test.test");
    await submitButton.click();
    await expect(inputEmail, "failed with input test@test.test").toHaveClass(
      /field-error/
    );
    expect(await page.locator("#output").textContent()).toBeFalsy;
  });
});

const Levels = [
  { name: "Home", head: null },
  { name: "Desktop", head: "Home" },
  { name: "Notes", head: "Desktop" },
  { name: "Commands", head: "Desktop" },
  { name: "Documents", head: "Home" },
  { name: "WorkSpace", head: "Documents" },
  { name: "React", head: "WorkSpace" },
  { name: "Angular", head: "WorkSpace" },
  { name: "Veu", head: "WorkSpace" },
  { name: "Office", head: "Documents" },
  { name: "Public", head: "Office" },
  { name: "Private", head: "Office" },
  { name: "Classified", head: "Office" },
  { name: "General", head: "Office" },
  { name: "Downloads", head: "Home" },
  { name: "Word File.doc", head: "Downloads" },
  { name: "Excel File.doc", head: "Downloads" },
];

test.describe("Check Box", () => {
  test.beforeEach(async ({ page }) => {
    await page.locator("li").filter({ hasText: "Check Box" }).click();
  });

  test("should navigate to '/checkbox' url", async ({ page }) => {
    expect(page.url()).toContain("/checkbox");
  });

  test("should correctly open and close tree of items using + and - button", async ({
    page,
  }) => {
    await page.getByLabel("Expand all").click();
    for (const level of Levels) {
      await expect(page.getByText(level.name)).toBeVisible();
    }

    await page.getByLabel("Collapse all").click();
    for (const level of Levels) {
      const element = page.getByText(level.name);
      if (level.head) {
        await expect(element).not.toBeVisible();
      } else {
        await expect(element).toBeVisible();
      }
    }
  });

  test("should open items when arrow clicked ", async ({ page }) => {
    await page.getByLabel("Toggle").click();
    for (const level of Levels) {
      const element = page.getByText(level.name);
      if (level.head === "Home" || !level.head) {
        await expect(element).toBeVisible();
      } else {
        await expect(element).not.toBeVisible();
      }
    }
    await page.getByLabel("Toggle").first().click();
    for (const level of Levels) {
      const element = page.getByText(level.name);
      if (!level.head) {
        await expect(element).toBeVisible();
      } else {
        await expect(element).not.toBeVisible();
      }
    }
  });

  test("should marked all items when clicked on checkbox and then unmarket it", async ({
    page,
  }) => {
    let button = page
      .locator("label")
      .filter({ hasText: "Home" })
      .getByRole("img")
      .first();
    await button.click();
    let results = page.locator("#result");
    await expect(results).toContainText("You have selected :");
    for (const level of Levels) {
      await expect(results).toContainText(
        level.name.split(".")[0].replace(/\s+/g, ""),
        {
          ignoreCase: true,
        }
      );
    }
    await button.click();
    await expect(results).not.toBeVisible();
  });
});

test.describe("Radio Button", () => {
  test.beforeEach(async ({ page }) => {
    await page.locator("li").filter({ hasText: "Radio Button" }).click();
  });

  test("should navigate to '/radio-button' url", async ({ page }) => {
    expect(page.url()).toContain("/radio-button");
  });
  test("should have no selected items when open ", async ({ page }) => {
    await expect(page.getByText("Yes")).not.toBeChecked();
    await expect(page.getByText("Impressive")).not.toBeChecked();
    await expect(page.getByText("No")).not.toBeChecked();
  });
  test("only one item can be selected", async ({ page }) => {
    await page.getByText("Yes").click();
    await expect(page.locator("#yesRadio")).toBeChecked();
    await expect(page.locator("#impressiveRadio")).not.toBeChecked();
    await expect(page.getByText("You have selected ")).toContainText("Yes");
    await page.getByText("Impressive").click();
    await expect(page.locator("#impressiveRadio")).toBeChecked();
    await expect(page.locator("#yesRadio")).not.toBeChecked();
    await expect(page.getByText("You have selected ")).toContainText(
      "Impressive"
    );
  });

  test("'No' cant be selected", async ({ page }) => {
    await expect(page.getByText("No")).toBeDisabled();
  });
});

test.describe("Web Tables", () => {
  test.beforeEach(async ({ page }) => {
    await page.locator("li").filter({ hasText: "Web Tables" }).click();
  });
  test("should navigate to '/webtables' url", async ({ page }) => {
    expect(page.url()).toContain("/webtables");
  });
  const TestData = {
    firstName: "Test First Name",
    lastName: "Test Last Name",
    email: "test_name@example.com",
    age: 22,
    salary: 333300,
    department: "Department",
  };
  const NewTestData = {
    firstName: "New Test First Name",
    lastName: "New Test Last Name",
    email: "new_test_name@example.com",
    age: 76,
    salary: 45353534,
    department: "NewDepartment",
  };

  const fillForm = async (
    page: Page,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      age: number;
      salary: number;
      department: string;
    }
  ) => {
    await page.getByPlaceholder("First Name").fill(data.firstName);
    await page.getByPlaceholder("Last Name").fill(data.lastName);
    await page.getByPlaceholder("name@example.com").fill(data.email);
    await page.getByPlaceholder("Age").fill(data.age.toString());
    await page.getByPlaceholder("Salary").fill(data.salary.toString());
    await page.getByPlaceholder("Department").fill(data.department);
    await page.getByRole("button", { name: "Submit" }).click();
  };

  test("can add new row, update and delete it", async ({ page }) => {
    //Add
    await page.getByRole("button", { name: "Add" }).click();
    await fillForm(page, TestData);
    let gridrow = page.getByRole("row", { name: TestData.firstName });
    await expect(gridrow).toBeVisible();
    for (const [key, value] of Object.entries(TestData)) {
      await expect(gridrow).toContainText(value.toString());
    }

    //Update
    await gridrow.getByTitle("Edit").click();
    await fillForm(page, NewTestData);
    await expect(gridrow).not.toBeVisible();
    let updatedGridRow = page.getByRole("row", { name: NewTestData.firstName });
    await expect(updatedGridRow).toBeVisible();
    for (const [key, value] of Object.entries(NewTestData)) {
      await expect(updatedGridRow).toContainText(value.toString());
    }

    //Delete
    await gridrow.getByTitle("Delete").click();
    await expect(updatedGridRow).not.toBeVisible();
  });

  test("can find row", async ({ page }) => {
    await page.getByRole("button", { name: "Add" }).click();
    await fillForm(page, TestData);
    await page.getByPlaceholder("Type to search").fill(TestData.email);
    let gridrow = page.getByRole("row", { name: TestData.firstName });
    await expect(gridrow).toBeVisible();
  });
});

test.describe("Buttons", () => {
  test.beforeEach(async ({ page }) => {
    await page.locator("li").filter({ hasText: "Buttons" }).click();
  });

  test("should navigate to '/buttons' url", async ({ page }) => {
    expect(page.url()).toContain("/buttons");
  });
  test("should can double click button", async ({ page }) => {
    const button = page.getByRole("button", { name: "Double Click Me" });
    await button.click();
    await expect(
      page.getByText("You have done a double click")
    ).not.toBeVisible();
    await button.click({ button: "right" });
    await expect(
      page.getByText("You have done a double click")
    ).not.toBeVisible();
    await button.dblclick();
    await expect(page.getByText("You have done a double click")).toBeVisible();
  });
  test("should can right click button", async ({ page }) => {
    const button = page.getByRole("button", { name: "Right Click Me" });
    await button.click();
    await expect(
      page.getByText("You have done a right click")
    ).not.toBeVisible();
    await button.dblclick();
    await expect(
      page.getByText("You have done a right click")
    ).not.toBeVisible();
    await button.click({ button: "right" });
    await expect(page.getByText("You have done a right click")).toBeVisible();
  });

  test("should can click 'click me' button", async ({ page }) => {
    const button = page.getByRole("button", { name: "Click Me", exact: true });
    await button.click({ button: "right" });
    await expect(
      page.getByText("You have done a dynamic click")
    ).not.toBeVisible();
    await button.click();
    await expect(page.getByText("You have done a dynamic click")).toBeVisible();
  });
});

test.describe("Links", () => {
  test.beforeEach(async ({ page }) => {
    await page.locator("li").getByText("Links", { exact: true }).click();
  });

  test("should navigate to '/links' url", async ({ page }) => {
    expect(page.url()).toContain("/links");
  });

  test("redirect by link to home page", async ({ page }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { exact: true, name: "Home" }).click(),
    ]);
    await expect(newPage).toHaveURL("https://demoqa.com/");
    await newPage.close();
  });
  test("redirect by link to home page by Homen__ link", async ({ page }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      page.locator("#dynamicLink").click(),
    ]);

    await expect(newPage).toHaveURL("https://demoqa.com/");
    await newPage.close();
  });
  test("should be  201 response with Created ", async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse("https://demoqa.com/created"),
      page.getByText("Created").click(),
    ]);
    expect(response.status()).toBe(201);
    expect(response.statusText()).toEqual("Created");
  });
  test("should be  204 response with No Content ", async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse("https://demoqa.com/no-content"),
      page.getByText("No Content").click(),
    ]);
    expect(response.status()).toBe(204);
    expect(response.statusText()).toEqual("No Content");
  });
  test("should be  204 response with Moved ", async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse("https://demoqa.com/moved"),
      page.getByText("Moved").click(),
    ]);
    expect(response.status()).toBe(301);
    expect(response.statusText()).toEqual("Moved Permanently");
  });
});

test.describe("Broken links and images ", () => {
  test.beforeEach(async ({ page }) => {
    await page
      .locator("li")
      .getByText("Broken Links - Images", { exact: true })
      .click();
  });

  test("should navigate to '/broken' url", async ({ page }) => {
    expect(page.url()).toContain("/broken");
  });

  test("check if image is downloaded", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");
    const validImage = page.locator('p:has-text("Valid image") + img');
    const imgSrc = await validImage.getAttribute("src");
    expect(imgSrc?.length).toBeGreaterThan(1);
    const res = await page.request.get(
      `https://demoqa.com${imgSrc}?nocache=${Date.now()}`
    );
    expect(res.status()).toBe(200);
    const contentType = res.headers()["content-type"];
    expect(contentType).toBe("image/jpeg");
  });
  test("check if image is not downloaded", async ({ page }) => {
    async function checkIfImageIsFine(page: Page, image: Locator) {
      const brokenImage = page.locator('p:has-text("Broken image") + img');
      await checkIfImageIsFine(page, brokenImage);
      const imgSrc = await brokenImage.getAttribute("src");
      expect(imgSrc?.length).toBeGreaterThan(1);
      const res = await page.request.get(
        `https://demoqa.com${imgSrc}?nocache=${Date.now()}`
      );
      expect(res.status()).toBe(200);
      const contentType = res.headers()["content-type"];
      expect(contentType).not.toBe("image/jpeg");
    }
  });
  test("check if link is valid", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");
    const validImage = page.locator('p:has-text("Valid Link") + a');
    const linkHref = await validImage.getAttribute("href");
    expect(linkHref?.length).toBeGreaterThan(1);
    if (linkHref) {
      const res = await page.request.get(linkHref);
      expect(res.status()).toBe(200);
    }
  });
  test("check if link is not valid", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");
    const validImage = page.locator('p:has-text("Broken Link") + a');
    const linkHref = await validImage.getAttribute("href");
    expect(linkHref?.length).toBeGreaterThan(1);
    if (linkHref) {
      const res = await page.request.get(linkHref);
      expect(res.status()).not.toBe(200);
    }
  });
});
test.describe("Upload and Download", () => {
  test.beforeEach(async ({ page }) => {
    await page
      .locator("li")
      .getByText("Upload and Download", { exact: true })
      .click();
  });

  test("should navigate to '/upload-download' url", async ({ page }) => {
    expect(page.url()).toContain("/upload-download");
  });

  test("correct download by clicking the button", async ({ page }) => {
    const button = page.getByRole("link", { name: "Download" });

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      button.click(),
    ]);

    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();
    const fs = require("fs");
    expect(fs.existsSync(downloadPath)).toBe(true);
    const fileStats = fs.statSync(downloadPath);
    expect(fileStats.size).toBeGreaterThan(0);
  });
  test("upload by clicking the button", async ({ page }) => {
    const filePath = path.resolve(__dirname, "alerts.spec.ts");
    await page.getByLabel("Select a file").click();
    await page.getByLabel("Select a file").setInputFiles(filePath);
    await expect(page.getByText("C:\\fakepath\\alerts.spec.ts")).toBeVisible();
    const newfilePath = path.resolve(__dirname, "forms.spec.ts");
    await page.getByLabel("Select a file").click();
    await page.getByLabel("Select a file").setInputFiles(newfilePath);
    await expect(
      page.getByText("C:\\fakepath\\alerts.spec.ts")
    ).not.toBeVisible();
    await expect(page.getByText("C:\\fakepath\\forms.spec.ts")).toBeVisible();
  });
});

test.describe("Dynamic Properties", () => {
  test.beforeEach(async ({ page }) => {
    await page
      .locator("li")
      .getByText("Dynamic Properties", { exact: true })
      .click();
  });

  test("should navigate to '/dynamic-properties' url", async ({ page }) => {
    expect(page.url()).toContain("/dynamic-properties");
  });

  test("should correct work with button, that will enabled afted some time", async ({
    page,
  }) => {
    const button = page.getByRole("button", { name: "Will enable 5 seconds" });
    await expect(button).toBeDisabled();
    await page.waitForTimeout(5000);
    await expect(button).toBeEnabled();
  });

  test("should correct work with button, that change color after some time", async ({
    page,
  }) => {
    const button = page.getByRole("button", { name: "Color Change" });

    await expect(button).not.toHaveClass(/text-danger/);
    await page.waitForTimeout(5000);
    await expect(button).toHaveClass(/text-danger/);
  });

  test("should correct work with button, that visible after some time", async ({
    page,
  }) => {
    const button = page.getByRole("button", {
      name: "Visible After 5 Seconds",
    });
    await expect(button).not.toBeVisible();
    await page.waitForTimeout(5000);
    await expect(button).toBeVisible();
  });
});
