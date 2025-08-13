import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
import { NavigateUrlTask } from "../task/NavigateUrlTask";

export async function NavigateUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>
) {
  try {
    const url = environment.getInput('URL');
    if (!url) {
      environment.log.error('input->selector not found');
    }
    const webPage = environment.getInput('Web Page');
    if (!webPage) {
      environment.log.error('input->selector not found');
    }

    await environment.getPage()!.goto(url)
    environment.log.info(`Navigated to ${url}`);
    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false;
  }
}
