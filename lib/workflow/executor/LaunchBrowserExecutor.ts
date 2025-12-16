import { chromium, type Browser } from "playwright-core";
import chromiumLambda from "@sparticuz/chromium";
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  let browser: Browser | undefined;
  console.log("on function launch");

  try {
    const websiteUrl = environment.getInput("Website Url");
    console.log("before isServerless launch");
    const isServerless =
      process.env.VERCEL === "1" ||
      process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;

    environment.log.info(
      `Launching browser (${isServerless ? "serverless" : "local"})`
    );
    console.log("before browser launch");
    browser = await chromium.launch({
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
    console.log("after browser launch");

    const page = await context.newPage();
    console.log("before page");

    await page.goto(websiteUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    console.log("after page");

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
