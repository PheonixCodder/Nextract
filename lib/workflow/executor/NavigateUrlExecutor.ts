import { ExecutionEnvironment } from "@/types/executor";
import { NavigateUrlTask } from "../task/NavigateUrl";

export async function NavigateUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
  try {
    const url = environment.getInput("URL");
    if (!url) {
      environment.log.error("Input URL is required");
      return false;
    }

    const page = environment.getPage();
    if (!page) {
      environment.log.error("No page found");
      return false;
    }

    await page.goto(url, { waitUntil: "domcontentloaded" });
    environment.log.info(`Navigated to ${url}`);
    return true;
  } catch (e: any) {
    environment.log.error(e.message);
    return false;
  }
}