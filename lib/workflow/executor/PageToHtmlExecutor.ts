import { Environment, ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
) {
  try {
    const html = await environment.getPage()!.content()
    environment.setOutput('Html', html)
    return true;
  } catch (error) {
    console.log(error);
    return true;
  }
}
