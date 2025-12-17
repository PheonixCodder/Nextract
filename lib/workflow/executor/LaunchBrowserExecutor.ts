import type { Browser, Page } from "puppeteer-core";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export const runtime = "nodejs";

async function getBrowser() {
  const REMOTE_PATH = process.env.CHROMIUM_REMOTE_EXEC_PATH;
  const LOCAL_PATH = process.env.CHROMIUM_LOCAL_EXEC_PATH;

  if (!REMOTE_PATH && !LOCAL_PATH) {
    throw new Error("Missing a path for chromium executable");
  }

  if (REMOTE_PATH) {
    return await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(REMOTE_PATH),
      defaultViewport: { width: 1280, height: 800 },
      headless: true,
    });
  }

  return await puppeteer.launch({
    executablePath: LOCAL_PATH,
    defaultViewport: { width: 1280, height: 800 },
    headless: true,
  });
}

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  let browser: Browser | undefined;

  try {
    const websiteUrl = environment.getInput("Website Url");
    environment.log.info("Launching Puppeteer with Sparticuz Chromium");

    browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(websiteUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });

    environment.setBrowser(browser);
    environment.setPage(page);
    environment.log.info("Website opened successfully");
    return true;
  } catch (error: any) {
    environment.log.error(`Browser launch failed: ${error?.message ?? "Unknown error"}`);
    if (browser) await browser.close().catch(() => {});
    return false;
  }
}