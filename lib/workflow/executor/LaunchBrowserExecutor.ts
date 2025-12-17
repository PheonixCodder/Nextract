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

    const REMOTE_PATH = process.env.CHROMIUM_REMOTE_EXEC_PATH;
    const LOCAL_PATH = process.env.CHROMIUM_LOCAL_EXEC_PATH;

    if (!REMOTE_PATH && !LOCAL_PATH) {
      throw new Error("Missing chromium executable path");
    }

    environment.log.info("Launching browser (Playwright + external Chromium)");

    browser = await pwChromium.launch({
      headless: true,
      args: REMOTE_PATH ? chromium.args : [],
      executablePath: REMOTE_PATH
        ? await chromium.executablePath(REMOTE_PATH)
        : LOCAL_PATH,
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
    environment.log.error(
      `Browser launch failed: ${error?.message ?? "Unknown error"}`
    );

    if (browser) {
      await browser.close().catch(() => {});
    }

    return false;
  }
}
