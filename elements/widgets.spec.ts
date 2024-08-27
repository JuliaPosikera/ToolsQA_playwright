import { test, expect, Page, Locator } from "@playwright/test";

test.describe("Widgets", () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.fixme(isMobile, "Settings page does not work in mobile yet");
    await page.goto("https://demoqa.com/elements");
    await page.getByText("Widgets").click();
  });
  test.describe("Accordian", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Accordian").click();
    });

    test("should expand and collapse on click ", async ({ page }) => {
      await page.getByText("What is Lorem Ipsum?").click();
      await expect(page.getByText("Lorem Ipsum is simply dummy")).toBeVisible();
      await page.getByText("Where does it come from?").click();
      await expect(page.getByText("Contrary to popular belief")).toBeVisible();
      await expect(
        page.getByText("Lorem Ipsum is simply dummy")
      ).not.toBeVisible();
      await page.getByText("Where does it come from?").click();
      await expect(
        page.getByText("Contrary to popular belief")
      ).not.toBeVisible();
      await expect(
        page.getByText("Lorem Ipsum is simply dummy")
      ).not.toBeVisible();
    });
  });
  test.describe("Auto Complete", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Auto Complete").click();
    });

    test("multiple -  should make correct input by multiple choice and offers correct autocomplete", async ({
      page,
    }) => {
      const inputContainer = page.locator("#autoCompleteMultipleContainer");
      const autoComplete = page.locator(".auto-complete__menu");
      const inputField = page.locator("#autoCompleteMultipleInput");

      await inputField.fill("R");
      await expect(autoComplete).toContainText("Red");
      await expect(autoComplete).toContainText("Green");
      await expect(autoComplete).toContainText("Purple");
      await autoComplete.getByText("Red", { exact: true }).click();
      await expect(inputContainer).toContainText("Red");

      await inputField.fill("R");
      await expect(autoComplete).not.toContainText("Red");
      await expect(autoComplete).toContainText("Green");
      await expect(autoComplete).toContainText("Purple");
      await autoComplete.getByText("Purple", { exact: true }).click();
      await expect(inputContainer).toContainText("Red");
      await expect(inputContainer).toContainText("Purple");

      await inputField.fill("Y");
      await autoComplete.getByText("Yellow", { exact: true }).click();
      await expect(inputContainer).toContainText("Red");
      await expect(inputContainer).toContainText("Yellow");
      await expect(inputContainer).toContainText("Purple");
    });
    test("multiple - should correct delete choise by clicking on it", async ({
      page,
    }) => {
      const inputContainer = page.locator("#autoCompleteMultipleContainer");
      const autoComplete = page.locator(".auto-complete__menu");
      const inputField = page.locator("#autoCompleteMultipleInput");

      await expect(inputContainer).not.toContainText("Red");
      await inputField.fill("R");
      await autoComplete.getByText("Red", { exact: true }).click();
      await expect(inputContainer).toContainText("Red");

      await inputField.fill("R");
      await autoComplete.getByText("Purple", { exact: true }).click();
      await expect(inputContainer).toContainText("Red");
      await expect(inputContainer).toContainText("Purple");

      await inputContainer.locator("svg").first().click();
      await expect(inputContainer).toContainText("Purple");
      await expect(
        inputContainer.getByText("Red", { exact: true })
      ).not.toBeVisible();
    });

    test("multiple - should correct delete all choises by clicking on cross on field", async ({
      page,
    }) => {
      const inputContainer = page.locator("#autoCompleteMultipleContainer");
      const autoComplete = page.locator(".auto-complete__menu");
      const inputField = page.locator("#autoCompleteMultipleInput");

      await inputField.fill("R");
      await autoComplete.getByText("Red", { exact: true }).click();
      await expect(inputContainer).toContainText("Red");

      await inputField.fill("R");
      await autoComplete.getByText("Purple", { exact: true }).click();
      await expect(inputContainer).toContainText("Red");
      await expect(inputContainer).toContainText("Purple");

      await page.locator(".auto-complete__indicator").click();
      await expect(
        inputContainer.getByText("Red", { exact: true })
      ).not.toBeVisible();
      await expect(
        inputContainer.getByText("Purple", { exact: true })
      ).not.toBeVisible();
    });

    test("multiple - should correct delete choise by clicking backspace", async ({
      page,
    }) => {
      const inputContainer = page.locator("#autoCompleteMultipleContainer");
      const autoComplete = page.locator(".auto-complete__menu");
      const inputField = page.locator("#autoCompleteMultipleInput");

      await expect(inputContainer).not.toContainText("Red");
      await inputField.fill("R");
      await autoComplete.getByText("Red", { exact: true }).click();
      await expect(inputContainer).toContainText("Red");

      await inputField.fill("R");
      await autoComplete.getByText("Purple", { exact: true }).click();
      await expect(inputContainer).toContainText("Red");
      await expect(inputContainer).toContainText("Purple");

      await inputField.click();
      page.keyboard.down("Backspace");
      await expect(inputContainer).toContainText("Red");
      await expect(
        inputContainer.getByText("Purple", { exact: true })
      ).not.toBeVisible();
    });
    test("single should corrert make input ", async ({ page }) => {
      const inputContainer = page.locator("#autoCompleteSingleContainer");
      const autoComplete = page.locator(".auto-complete__menu");
      const inputField = page.locator("#autoCompleteSingleInput");
      await inputField.fill("R");
      await autoComplete.getByText("Red", { exact: true }).click();
      await expect(inputContainer).toContainText("Red");
    });
    test("single should corrert update input ", async ({ page }) => {
      const inputContainer = page.locator("#autoCompleteSingleContainer");
      const autoComplete = page.locator(".auto-complete__menu");
      const inputField = page.locator("#autoCompleteSingleInput");
      await inputField.fill("R");
      await autoComplete.getByText("Red", { exact: true }).click();
      await expect(inputContainer).toContainText("Red");
      await inputField.fill("R");
      await autoComplete.getByText("Purple", { exact: true }).click();
      await expect(inputContainer).toContainText("Purple");
      await expect(
        inputContainer.getByText("Red", { exact: true })
      ).not.toBeVisible();
    });
  });

  test.describe("Date Picker", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Date Picker").click();
    });

    test("should be possible input date from keyboard", async ({ page }) => {
      const datePickerInput = page.locator("#datePickerMonthYearInput");
      const datePickerDaySelect = page.locator(
        ".react-datepicker__month-container"
      );
      const datePickerMonthYear = page.locator(".react-datepicker__header");
      await datePickerInput.fill("12/31/1987");
      await expect(datePickerMonthYear).toContainText("December 1987");
      await expect(
        datePickerDaySelect.getByText("31", { exact: true })
      ).toHaveClass(/react-datepicker__day--selected/);
    });

    test("should be possible input date from datepicker", async ({ page }) => {
      const datePickerInput = page.locator("#datePickerMonthYearInput");
      const datePickerYear = page.getByRole("combobox").nth(1);
      const datePickerMonth = page.locator(".react-datepicker__month-select");

      await datePickerInput.click();
      await datePickerMonth.selectOption("11");
      await datePickerYear.selectOption("1987");

      await page.getByLabel("Choose Thursday, December 31st,").click();
      expect(await datePickerInput.inputValue()).toEqual("12/31/1987");
    });
  });
  test.describe("Slider", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Slider").click();
    });

    test("should display the correct initial value", async ({ page }) => {
      const slider = page.locator(".range-slider");
      const sliderValueInput = page.locator("#sliderValue");

      expect(await slider.inputValue()).toBe("25");
      expect(await sliderValueInput.inputValue()).toBe("25");
    });

    test("should update slider value correctly", async ({ page }) => {
      const slider = page.locator(".range-slider");
      const sliderValueInput = page.locator("#sliderValue");

      await slider.fill("50");
      expect(await slider.inputValue()).toBe("50");
      expect(await sliderValueInput.inputValue()).toBe("50");

      await slider.fill("0");
      expect(await slider.inputValue()).toBe("0");
      expect(await sliderValueInput.inputValue()).toBe("0");

      await slider.fill("100");
      expect(await slider.inputValue()).toBe("100");
      expect(await sliderValueInput.inputValue()).toBe("100");
    });
  });
  test.describe("Progress Bar", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Progress Bar").click();
    });

    test("should display the correct initial value", async ({ page }) => {
      const progressBar = page.locator("#progressBar .progress-bar");

      expect(await progressBar.getAttribute("aria-valuenow")).toBe("0");

      expect(await progressBar.textContent()).toBe("0%");
    });

    test("should start and update progress bar correctly", async ({ page }) => {
      const progressBar = page.locator("#progressBar .progress-bar");
      const startStopButton = page.locator("#startStopButton");
      await startStopButton.click();

      await page.waitForFunction(
        () => {
          const progress = document.querySelector("#progressBar .progress-bar");
          return progress && progress.getAttribute("aria-valuenow") === "50";
        },
        { timeout: 10000 }
      );

      expect(await progressBar.getAttribute("aria-valuenow")).toBe("50");
      expect(await progressBar.textContent()).toBe("50%");
    });

    test("should reach 50% and stop correctly, and then going on", async ({
      page,
    }) => {
      const progressBar = page.locator("#progressBar .progress-bar");
      const startStopButton = page.locator("#startStopButton");

      await startStopButton.click();

      await page.waitForFunction(
        () => {
          const progress = document.querySelector("#progressBar .progress-bar");
          return progress && progress.getAttribute("aria-valuenow") === "50";
        },
        { timeout: 20000 }
      );
      await startStopButton.click(); //stop
      expect(await progressBar.getAttribute("aria-valuenow")).toBe("50");
      expect(await progressBar.textContent()).toBe("50%");
      await page.waitForTimeout(1000);

      await startStopButton.click(); //new begining
      await page.waitForFunction(
        () => {
          const progress = document.querySelector("#progressBar .progress-bar");
          return progress && progress.getAttribute("aria-valuenow") === "100";
        },
        { timeout: 20000 }
      );
      expect(await progressBar.getAttribute("aria-valuenow")).toBe("100");
      expect(await progressBar.textContent()).toBe("100%");
    });
    test("should be possible to reset after it reached 100%", async ({
      page,
    }) => {
      const progressBar = page.locator("#progressBar .progress-bar");
      const startStopButton = page.locator("#startStopButton");
      const resetButton = page.locator("#resetButton");

      await startStopButton.click();
      await page.waitForFunction(
        () => {
          const progress = document.querySelector("#progressBar .progress-bar");
          return progress && progress.getAttribute("aria-valuenow") === "100";
        },
        { timeout: 20000 }
      );
      expect(await progressBar.getAttribute("aria-valuenow")).toBe("100");
      expect(await progressBar.textContent()).toBe("100%");
      await expect(resetButton).toBeVisible();
      await expect(startStopButton).not.toBeVisible();
      await resetButton.click();
      expect(await progressBar.getAttribute("aria-valuenow")).toBe("0");
      expect(await progressBar.textContent()).toBe("0%");
      await expect(resetButton).not.toBeVisible();
      await expect(startStopButton).toBeVisible();
    });
  });
  test.describe("Tabs", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Tabs").click();
    });

    test("should correct switching between tabs ", async ({ page }) => {
      const firstTab = page.getByRole("tab", { name: "What" });
      const firstTabContext = page.getByText("Lorem Ipsum is simply dummy");
      const secondTab = page.getByRole("tab", { name: "Origin" });
      const secondTabContext = page.getByText("Contrary to popular belief,");

      expect(await firstTab.getAttribute("aria-selected")).toEqual("true");
      await expect(firstTabContext).toBeVisible();
      expect(await secondTab.getAttribute("aria-selected")).toEqual("false");
      await expect(secondTabContext).not.toBeVisible();

      await secondTab.click();

      expect(await firstTab.getAttribute("aria-selected")).toEqual("false");
      await expect(firstTabContext).not.toBeVisible();
      expect(await secondTab.getAttribute("aria-selected")).toEqual("true");
      await expect(secondTabContext).toBeVisible();

      await firstTab.click();
      expect(await firstTab.getAttribute("aria-selected")).toEqual("true");
      await expect(firstTabContext).toBeVisible();
      expect(await secondTab.getAttribute("aria-selected")).toEqual("false");
      await expect(secondTabContext).not.toBeVisible();
    });
    test("should noy switch to unactive tab ", async ({ page }) => {
      const firstTab = page.getByRole("tab", { name: "What" });
      const firstTabContext = page.getByText("Lorem Ipsum is simply dummy");
      const unactiveTab = page.getByRole("tab", { name: "More" });

      expect(unactiveTab).toBeDisabled;
    });
  });
  test.describe("Tools Tips", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Tool Tips").click();
    });

    test("should visible tips on the button when it hovered", async ({
      page,
    }) => {
      const button = page.getByRole("button", { name: "Hover me to see" });
      await button.hover();
      const buttonTip = page.getByRole("tooltip", {
        name: "You hovered over the Button",
      });
      await expect(buttonTip).toBeVisible();
    });
    test("should visible tips on the field when it hovered", async ({
      page,
    }) => {
      const field = page.getByRole("textbox", { name: "Hover me to see" });
      await field.hover();
      const fieldTip = page.getByRole("tooltip", {
        name: "You hovered over the text field",
      });
      await expect(fieldTip).toBeVisible();
    });
    test("should visible tips on the linked text when it hovered", async ({
      page,
    }) => {
      const textInArticle = page.getByRole("link", { name: "Contrary" });
      const text1Tip = page.getByRole("tooltip", {
        name: "You hovered over the Contrary",
      });
      const textInArticleWithNumbers = page.getByRole("link", {
        name: "1.10.32",
      });
      const text2Tip = page.getByRole("tooltip", {
        name: "You hovered over the 1.10.32",
      });

      await textInArticle.hover();
      await expect(text1Tip).toBeVisible();
      await textInArticleWithNumbers.hover();
      await expect(text2Tip).toBeVisible();
    });
  });
  test.describe("Menu", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Menu", { exact: true }).click();
    });

    test("should display all main menu items", async ({ page }) => {
      const mainItems = await page.locator("#nav > li > a");
      expect(await mainItems.count()).toBe(3);
      expect(await mainItems.nth(0).textContent()).toBe("Main Item 1");
      expect(await mainItems.nth(1).textContent()).toBe("Main Item 2");
      expect(await mainItems.nth(2).textContent()).toBe("Main Item 3");
    });

    test("should display sub-items when hovering over Main Item 2", async ({
      page,
    }) => {
      const mainItem2 = page.locator("#nav > li:nth-child(2) > a");
      await mainItem2.hover();

      const subItems = page.locator("#nav > li:nth-child(2) > ul > li > a");
      expect(await subItems.count()).toBe(3);
      expect(await subItems.nth(0).textContent()).toBe("Sub Item");
      expect(await subItems.nth(1).textContent()).toBe("Sub Item");
      expect(await subItems.nth(2).textContent()).toBe("SUB SUB LIST »");
    });

    test("should display sub-sub-items when hovering over SUB SUB LIST", async ({
      page,
    }) => {
      const mainItem2 = page.locator("#nav > li:nth-child(2) > a");
      await mainItem2.hover();

      const subSubList = page.locator(
        "#nav > li:nth-child(2) > ul > li:nth-child(3) > a"
      );
      await subSubList.hover();

      const subSubItems = page.locator(
        "#nav > li:nth-child(2) > ul > li:nth-child(3) > ul > li > a"
      );
      expect(await subSubItems.count()).toBe(2);
      expect(await subSubItems.nth(0).textContent()).toBe("Sub Sub Item 1");
      expect(await subSubItems.nth(1).textContent()).toBe("Sub Sub Item 2");
    });

    test("should not display sub-items before hovering", async ({ page }) => {
      const subItem = page
        .locator("#nav > li:nth-child(2) > ul > li > a")
        .first();
      await expect(subItem).not.toBeInViewport();
    });

    test("should not display sub-sub-items before hovering", async ({
      page,
    }) => {
      const subSubItem = page
        .locator("#nav > li:nth-child(2) > ul > li:nth-child(3) > ul > li > a")
        .first();
      expect(await subSubItem.isVisible()).toBe(false);
    });

    test("should navigate correctly when clicking a main item", async ({
      page,
    }) => {
      const mainItem1 = page.locator("#nav > li:nth-child(1) > a");
      await mainItem1.click();

      // Replace with the expected URL or page state after navigation
    });

    test("should navigate correctly when clicking a sub item", async ({
      page,
    }) => {
      const mainItem2 = page.locator("#nav > li:nth-child(2) > a");
      await mainItem2.hover();

      const subItem = page.locator(
        "#nav > li:nth-child(2) > ul > li:nth-child(1) > a"
      );
      await subItem.click();

      // Replace with the expected URL or page state after navigation
    });
  });
  test.describe("Select Menu", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Select Menu").click();
    });

    test("should correct select item when clicking on field", async ({
      page,
    }) => {
      const selectField = page
        .locator("#withOptGroup div")
        .filter({ hasText: "Select Option" })
        .nth(1);
      const checedValue = page.locator(".css-1uccc91-singleValue");
      const testText = "Group 1, option 2";
      await selectField.click();
      // await expect(suggestionItems).toBeVisible();
      await page.getByText(testText).click();

      await expect(checedValue).toHaveText(testText);
    });
    test('should display the correct placeholder text for "Select One" dropdown', async ({
      page,
    }) => {
      const selectOneDropdown = page.locator(
        "#selectOne .css-1wa3eu0-placeholder"
      );
      expect(await selectOneDropdown.textContent()).toBe("Select Title");
    });
    test('should select the correct value in "Old Style Select Menu"', async ({
      page,
    }) => {
      const oldSelectMenu = page.locator("#oldSelectMenu");
      await oldSelectMenu.selectOption({ value: "3" });
      expect(await oldSelectMenu.inputValue()).toBe("3");
    });
    test('should select multiple values in "Multiselect Drop Down"', async ({
      page,
    }) => {
      await page.goto("https://demoqa.com/select-menu");
      await page
        .locator("div")
        .filter({ hasText: /^Select\.\.\.$/ })
        .nth(2)
        .click();
      await page.locator("#react-select-4-option-0").click();
      await page.locator("#react-select-4-option-1").click();
      await page.locator("#react-select-4-option-2").click();
      await page.locator("#react-select-4-option-3").click();
      await page.locator(".css-xb97g8 > .css-19bqh2r").first().click();
      await page.locator("div:nth-child(3) > .css-19bqh2r").click();
      await page.locator("div:nth-child(3) > .css-19bqh2r").click();
      await page.locator("#react-select-4-option-0").click();
      await page.locator(".css-1gtu0rj-indicatorContainer").first().click();
    });
    test('should select multiple values in "Standard Multi Select"', async ({
      page,
    }) => {
      const standardMultiSelect = page.locator("#cars");
      await standardMultiSelect.selectOption([
        { value: "volvo" },
        { value: "audi" },
      ]);
      const selectedOptions = await standardMultiSelect
        .locator("option:checked")
        .allTextContents();

      expect(selectedOptions).toContain("Volvo");
      expect(selectedOptions).toContain("Audi");
    });
  });
});
