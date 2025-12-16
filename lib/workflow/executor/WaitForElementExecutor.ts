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
      environment.log.error("Playwright page is not available");
      return false;
    }

    const state =
      visibility === "visible"
        ? "visible"
        : visibility === "hidden"
        ? "hidden"
        : "attached";

    await page.waitForSelector(selector, { state });

    environment.log.info(`Element ${selector} is ${visibility}`);
    return true;
  } catch (e: any) {
    environment.log.error(e.message ?? "Failed waiting for element");
    return false;
  }
}
