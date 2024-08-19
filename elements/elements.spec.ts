import { test, expect, Page } from "@playwright/test";

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
