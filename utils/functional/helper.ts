import { expect, Page } from "@playwright/test";
import fs from "fs";
import pdfParse from "pdf-parse";
import CustomReporterConfig from "CustomReporterConfig";

const filePath = `./test-data/readWriteDynamic.json`;
const urlFilePath = `./test-data/url.json`;

export class TestHelper {
  private static logger = CustomReporterConfig;

  private page: Page;

  constructor(page?: Page) {
    if (page) this.page = page;
  }

  /* =========================
   * GENERIC DATE UTILITIES
   * ========================= */
  static getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split(`T`)[0];
  }

  
  async getSpecificFutureDate(days: number): Promise<string> {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dd = (`0` + date.getDate()).slice(-2);
    const mm = (`0` + (date.getMonth() + 1)).slice(-2);
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  /* =========================
   * JSON FILE UTILITIES
   * ========================= */
  async readJson(key: string): Promise<any> {
    const json = JSON.parse(fs.readFileSync(urlFilePath, `utf8`));
    return json[key];
  }

  async readIdJson(key: string, fileName: string): Promise<any> {
    const path = `./test-data/${fileName}.json`;
    const json = JSON.parse(fs.readFileSync(path, `utf8`));
    return json[key];
  }

  async writeToJson(key: string, value: any): Promise<void> {
    const content = JSON.parse(fs.readFileSync(filePath, `utf8`));
    content[key] = value;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`** The key --${key}-- with value --${value}-- has been added in json`);
  }

  async writeIdToJson(key: string, value: any, fileName: string): Promise<void> {
    const path = `./test-data/${fileName}.json`;
    const content = JSON.parse(fs.readFileSync(path, `utf8`));
    content[key] = value;
    fs.writeFileSync(path, JSON.stringify(content, null, 2));
  }

  async getValueThroughJsonPath(json: any, jsonPathKey: string): Promise<any> {
    const getValue = (o: any, p: string) => p.split(`.`).reduce((r, k) => r[k], o);
    return getValue(json, jsonPathKey);
  }

  /* =========================
   * RANDOM UTILITIES
   * ========================= */
  static generateRandomString(length: number = 6): string {
    const chars = `abcdefghijklmnopqrstuvwxyz`;
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join(``);
  }

  async randomString(length: number = 6): Promise<string> {
    const chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`;
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join(``);
  }

  async randomNum(length: number = 5): Promise<string> {
    let result = ``;
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  async randomName(): Promise<string> {
    const names = [`Ananth`, `Broly`, `Cliff`, `Donald`, `Echo`, `Felkon`, `Gohan`, `Harley`, `Iric`, `James`, `Kai`, `Lio`, `Majin`, `Naruto`, `Omega`, `Picolo`, `Que`, `Ronaldo`, `Saskai`, `Tai`, `Uwaan`, `Vegeta`, `Washington`, `Xmass`, `Yokai`, `Ziren`];
    return names[Math.floor(Math.random() * names.length)];
  }

  async randomSingleString(length: number): Promise<string> {
    const chars = `ABCDE`;
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join(``);
  }

  /* =========================
   * PDF UTILITIES
   * ========================= */
async readPDF(pdfFilePath: string): Promise<string> {
  const buffer = fs.readFileSync(pdfFilePath);
  const data = await (pdfParse as any)(buffer); // cast to any to suppress type error
  console.log(`PDF Content:`, data.text);
  return data.text;
}

  /* =========================
   * SCROLLING / UI UTILITIES
   * ========================= */
  async scrollDown(): Promise<void> {
    if (!this.page) return;
    await this.page.waitForLoadState(`networkidle`);
    await this.page.keyboard.press(`End`);
  }

  async scrollUp(): Promise<void> {
    if (!this.page) return;
    await this.page.waitForLoadState(`networkidle`);
    await this.page.keyboard.press(`PageUp`);
  }

  async scrollToMiddle(): Promise<void> {
    if (!this.page) return;
    await this.page.waitForLoadState(`networkidle`);
    await this.page.keyboard.press(`PageDown`);
  }

  static async selectDate(page: Page, dateInputSelector: string, targetDate: string) {
    const [year, month, day] = targetDate.split(`-`);
    await page.click(dateInputSelector);
    await page.locator(`.year-select`).selectOption(year);
    await page.locator(`.month-select`).selectOption((Number(month) - 1).toString());
    await page.locator(`text="${Number(day)}"`).click();
    this.logger.logInfo(`Selected date: ${targetDate}`);
  }

  static async waitForLoaderToDisappear(page: Page, loaderSelector: string) {
    await page.waitForSelector(loaderSelector, { state: `hidden` });
    this.logger.logInfo(`Loader disappeared`);
  }

  static async verifyText(page: Page, selector: string, expectedText: string) {
    const actual = await page.locator(selector).textContent();
    this.logger.logInfo(`Actual: ${actual}, Expected: ${expectedText}`);
    await expect(actual?.trim()).toBe(expectedText);
  }

  static async clickWithRetry(page: Page, selector: string, retries: number = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await page.click(selector);
        return;
      } catch (err) {
        if (i === retries - 1) throw err;
        await page.waitForTimeout(1000);
      }
    }
  }

  static async scrollAndClick(page: Page, selector: string) {
    const element = page.locator(selector);
    await element.scrollIntoViewIfNeeded();
    await element.click();
  }

  static async searchInNewTab(context, page: Page, searchText: string,url:string) {
    const newTab = await context.newPage();
    await newTab.goto(url);
    const acceptBtn = newTab.locator(`text=Accept all`);
    if (await acceptBtn.isVisible().catch(() => false)) await acceptBtn.click();
    await newTab.fill(`textarea[name="q"]`, searchText);
    await newTab.keyboard.press(`Enter`);
    await newTab.waitForLoadState();
    await newTab.close();
    await page.bringToFront();
    this.logger.logInfo(`Search completed: ${searchText}`);
  }

  static roundOff(value: number): number {
    const integerPart = Math.floor(value);
    return value < integerPart + 0.5 ? integerPart : integerPart + 1;
  }

  static addDays(date: string, days: number): string {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString().split(`T`)[0];
  }
}