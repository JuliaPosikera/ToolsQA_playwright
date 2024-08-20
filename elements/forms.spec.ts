import { Page, Locator, test, expect } from "@playwright/test";
import path from "path";

export class UserFormPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly genderRadioMale: Locator;
  readonly genderRadioFemale: Locator;
  readonly genderRadioOther: Locator;
  readonly mobileInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly subjectsInput: Locator;
  readonly hobbiesCheckboxSports: Locator;
  readonly hobbiesCheckboxReading: Locator;
  readonly hobbiesCheckboxMusic: Locator;
  readonly uploadPictureInput: Locator;
  readonly currentAddressTextarea: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly submitButton: Locator;
  readonly cityInputArrow: Locator;
  readonly stateInputArrow: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.emailInput = page.getByPlaceholder("name@example.com");
    this.genderRadioMale = page.getByText("Male", { exact: true });
    this.genderRadioFemale = page.getByText("Female", { exact: true });
    this.genderRadioOther = page.getByText("Other", { exact: true });
    this.mobileInput = page.getByPlaceholder("Mobile Number");
    this.dateOfBirthInput = page.locator("#dateOfBirthInput");
    this.subjectsInput = page.locator("#subjectsInput");
    this.hobbiesCheckboxSports = page.getByText("Sports");
    this.hobbiesCheckboxReading = page.getByText("Reading");
    this.hobbiesCheckboxMusic = page.getByText("Music");
    this.uploadPictureInput = page.getByLabel("Select picture");
    this.currentAddressTextarea = page.getByPlaceholder("Current Address");
    this.stateInput = page.locator("#react-select-3-input");
    this.stateInputArrow = page.locator("#state svg");
    this.cityInputArrow = page.locator("#city svg");
    this.cityInput = page.locator("#react-select-4-input");
    this.submitButton = page.getByRole("button", { name: "Submit" });
  }

  async fillName(firstName: string, lastName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async selectGender(gender: "Male" | "Female" | "Other"): Promise<void> {
    switch (gender) {
      case "Male":
        await this.genderRadioMale.click();
        break;
      case "Female":
        await this.genderRadioFemale.click();
        break;
      case "Other":
        await this.genderRadioOther.click();
        break;
    }
  }

  async fillMobileNumber(mobileNumber: number): Promise<void> {
    await this.mobileInput.fill(mobileNumber.toString());
  }

  async fillDateOfBirth(dateOfBirth: string): Promise<void> {
    await this.dateOfBirthInput.click();
    await this.dateOfBirthInput.fill(dateOfBirth);
    await this.page.keyboard.press("Enter");
  }

  async fillSubjects(subjects: string | string[]): Promise<void> {
    const subjectsList = Array.isArray(subjects) ? subjects : [subjects];
    for (const subject of subjectsList) {
      await this.page
        .locator(".subjects-auto-complete__value-container")
        .click();
      await this.subjectsInput.fill("Math");
      await this.page.getByText("Maths", { exact: true }).click();
    }
  }

  async selectHobbies(hobbies: string[] | string): Promise<void> {
    const hobbyList = Array.isArray(hobbies) ? hobbies : [hobbies];
    for (const hobby of hobbies) {
      switch (hobby) {
        case "Sports":
          await this.hobbiesCheckboxSports.check();
          break;
        case "Reading":
          await this.hobbiesCheckboxReading.check();
          break;
        case "Music":
          await this.hobbiesCheckboxMusic.check();
          break;
      }
    }
  }

  async uploadPicture(file: string): Promise<void> {
    const filePath = path.resolve(__dirname, file);
    await this.uploadPictureInput.setInputFiles(filePath);
  }

  async fillCurrentAddress(address: string): Promise<void> {
    await this.currentAddressTextarea.fill(address);
  }

  async selectStateAndCity(state: string, city: string): Promise<void> {
    await this.stateInput.fill(state);
    await this.page.keyboard.press("Enter");
    await this.cityInput.fill(city);
    await this.page.keyboard.press("Enter");
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }
}

const TestPerson: {
  name: string;
  lastName: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  hobbies: string | string[];
  subjects: string | string[];
  dateOfBirth: string;
  mobileNumber: number;
  picture: string;
  adress: string;
  state: string;
  city: string;
} = {
  name: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  gender: "Male",
  hobbies: ["Sports", "Reading"],
  subjects: ["Math", "Chemistry"],
  dateOfBirth: "17 Aug 1987",
  mobileNumber: 1234567890,
  picture: "alerts.spec.ts",
  adress: "123 Main St, Springfield",
  state: "Rajasthan",
  city: "Jaipur",
};

test("Form should filling correct", async ({ page }) => {
  const userForm = new UserFormPage(page);

  await page.goto("https://demoqa.com/automation-practice-form");
  await userForm.fillName(TestPerson.name, TestPerson.lastName);
  await userForm.fillEmail(TestPerson.email);
  await userForm.selectGender(TestPerson.gender);
  await userForm.fillMobileNumber(TestPerson.mobileNumber);
  await userForm.fillDateOfBirth(TestPerson.dateOfBirth);
  await userForm.fillSubjects(TestPerson.subjects);
  await userForm.selectHobbies(TestPerson.hobbies);
  await userForm.uploadPicture(TestPerson.picture);
  await userForm.fillCurrentAddress(TestPerson.adress);
  await userForm.selectStateAndCity(TestPerson.state, TestPerson.city);
  await userForm.submitForm();

  await expect(page.getByText("Thanks for submitting the form")).toBeVisible();
});
