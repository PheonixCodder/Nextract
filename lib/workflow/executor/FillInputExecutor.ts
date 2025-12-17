import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/FillInput";

export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Input Selector is required");
      return false;
    }

    const value = environment.getInput("Value");
    if (!value) {
      environment.log.error("Input Value is required");
      return false;
    }

    const page = environment.getPage();
    if (!page) {
      environment.log.error("No page found");
      return false;
    }

    await page.type(selector, value);
    environment.log.info(`Filled input ${selector} with value: ${value}`);
    return true;
  } catch (e: any) {
    environment.log.error(e.message);
    return false;
  }
}