import { ExecutionPhase } from "@/lib/generated/prisma";
import { waitFor } from "@/lib/helper/waitFor";
import { AppNode } from "@/types/appNodes";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
) {
  try {
    const websiteUrl = environment.getInput("Website Url");
    console.log(websiteUrl);
    const browser = await puppeteer.launch({
      headless: true,
    });
    environment.setBrowser(browser)
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page)
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
