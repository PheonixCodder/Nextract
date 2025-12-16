import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../task/ScrollToElement";
import type { Page } from "playwright-core";

export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Input Selector is required");
      return false;
    }

    const page = environment.getPage() as Page;

    await page.evaluate((selector: string) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element with selector ${selector} not found`);
      }
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    }, selector);

    return true;
  } catch (e: any) {
    environment.log.error(e.message);
    return false;
  }
}
