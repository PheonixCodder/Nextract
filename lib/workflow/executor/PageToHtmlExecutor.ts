import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const page = environment.getPage();
    if (!page) {
      environment.log.error("No page found");
      return false;
    }

    const html = await page.content();
    environment.setOutput("Html", html);
    environment.log.info("Page HTML extracted successfully");
    return true;
  } catch (e: any) {
    environment.log.error(e.message);
    return false;
  }
}