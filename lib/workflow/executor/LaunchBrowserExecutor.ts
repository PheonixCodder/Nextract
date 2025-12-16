import { chromium as pwChromium, type Browser } from "playwright-core";
import chromiumLambda from "@sparticuz/chromium";
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export const runtime = "nodejs";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  let browser: Browser | undefined;

  try {
    const websiteUrl = environment.getInput("Website Url");

    environment.log.info("Launching browser (Playwright + @sparticuz/chromium)");

    const isServerless = process.env.VERCEL === "1";

    browser = await pwChromium.launch({
      headless: true,
      args: isServerless ? chromiumLambda.args : [],
      executablePath: isServerless
        ? await chromiumLambda.executablePath()
        : undefined,
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
    environment.log.info(`Website opened successfully: ${websiteUrl}`);

    return true;
  } catch (error: any) {
    environment.log.error(`Browser launch failed: ${error?.message ?? "Unknown error"}`);

    if (browser) await browser.close().catch(() => {});
    return false;
  }
}
