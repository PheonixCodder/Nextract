import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";

export async function ClickElementExecutor(
  environment: ExecutionEnvironment<typeof ClickElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Input Selector is required");
      return false;
    }

    const page = environment.getPage();
    if (!page) {
      environment.log.error("No page found");
      return false;
    }

    await page.click(selector);
    environment.log.info(`Clicked element: ${selector}`);
    return true;
  } catch (e: any) {
    environment.log.error(e.message);
    return false;
  }
}