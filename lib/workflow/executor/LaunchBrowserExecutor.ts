import puppeteer, { type Browser } from "puppeteer";
import { type Browser as BrowserCore } from "puppeteer-core";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export const runtime = "nodejs";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  let browser: Browser | BrowserCore | undefined;

  try {
    const websiteUrl = environment.getInput("Website Url");
    const isProd =
      process.env.NODE_ENV === "production" ||
      process.env.VERCEL_ENV === "production";

    environment.log.info(
      `Launching Puppeteer in ${isProd ? "production" : "development"} mode`
    );

    if (isProd) {
      const remoteTar = process.env.CHROMIUM_REMOTE_EXEC_PATH;

      if (!remoteTar) throw new Error("CHROMIUM_REMOTE_EXEC_PATH not set");

      const executablePath = await chromium.executablePath(remoteTar);

      browser = await puppeteerCore.launch({
        executablePath,
        args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: { width: 1280, height: 800 },
        headless: true,
      });
    } else {
      // Local development using installed Chrome
      const localExecutablePath =
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"; // change if needed

      browser = await puppeteer.launch({
        executablePath: localExecutablePath,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
        defaultViewport: { width: 1080, height: 1024 },
      });
    }

    environment.log.info("Browser launched successfully");
    environment.setBrowser(browser);

    const page = await browser.newPage();
    await page.setViewport(
      isProd ? { width: 1280, height: 800 } : { width: 1080, height: 1024 }
    );
    await page.goto(websiteUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    environment.setPage(page);

    environment.log.info(`Opened the website successfully: ${websiteUrl}`);
    return true;
  } catch (error: any) {
    environment.log.error(`Failed to launch browser: ${error.message}`);
    if (browser) await browser.close().catch(() => {});
    return false;
  }
}
