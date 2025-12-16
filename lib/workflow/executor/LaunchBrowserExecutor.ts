import { chromium, type Browser } from "playwright";
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export const runtime = "nodejs";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  let browser: Browser | undefined;

  try {
    const websiteUrl = environment.getInput("Website Url");

    environment.log.info("Launching browser (Playwright-managed)");

    const isServerless = process.env.VERCEL === "1";

    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        ...(isServerless ? ["--single-process"] : []),
      ],
    });

    environment.setBrowser(browser);

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      ignoreHTTPSErrors: true,
    });

    const page = await context.newPage();

    await page.goto(websiteUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });

    environment.setPage(page);
    environment.log.info(`Website opened successfully: ${websiteUrl}`);

    return true;
  } catch (error: any) {
    environment.log.error(`Browser launch failed: ${error?.message ?? "Unknown error"}`);

    if (browser) await browser.close().catch(() => {});
    return false;
  }
}
