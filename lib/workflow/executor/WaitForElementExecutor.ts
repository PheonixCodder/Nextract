import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../task/WaitForElement";

export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Input Selector is required");
      return false;
    }

    const visibility = environment.getInput("Visibility");
    if (!visibility) {
      environment.log.error("Input Visibility is required");
      return false;
    }

    const page = environment.getPage();
    if (!page) {
      environment.log.error("Puppeteer page is not available");
      return false;
    }

    // Puppeteer's waitForSelector options
    const options: any = {};
    if (visibility === "visible") {
      options.visible = true;
    } else if (visibility === "hidden") {
      options.hidden = true;
    }

    await page.waitForSelector(selector, options);
    environment.log.info(`Element ${selector} is ${visibility}`);
    return true;
  } catch (e: any) {
    environment.log.error(e.message ?? "Failed waiting for element");
    return false;
  }
}