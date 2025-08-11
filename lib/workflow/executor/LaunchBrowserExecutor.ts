import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
) {
  try {
    const websiteUrl = environment.getInput("Website Url");
    const browser = await puppeteer.launch({
      headless: true,
    });
    environment.log.info('Browser launched successfully');
    environment.setBrowser(browser)
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page)
    environment.log.info(`Opened ${websiteUrl} in browser`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message)
    return false;
  }
}
