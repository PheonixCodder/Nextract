import { chromium as pwChromium, type Browser } from "playwright-core";
import chromium from "@sparticuz/chromium-min";
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export const runtime = "nodejs";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  let browser: Browser | undefined;

  try {
    const websiteUrl = environment.getInput("Website Url");

    environment.log.info("Launching Playwright with Sparticuz Chromium");

    const executablePath = await chromium.executablePath();

    if (!executablePath) {
      throw new Error("Chromium executable path is empty");
    }

    browser = await pwChromium.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });

    environment.setBrowser(browser);

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      ignoreHTTPSErrors: true,
    });

    const page = await context.newPage();
    await page.goto(websiteUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    environment.setPage(page);
    environment.log.info("Website opened successfully");

    return true;
  } catch (error: any) {
    environment.log.error(
      `Browser launch failed: ${error?.message ?? "Unknown error"}`
    );

    if (browser) await browser.close().catch(() => {});
    return false;
  }
}
