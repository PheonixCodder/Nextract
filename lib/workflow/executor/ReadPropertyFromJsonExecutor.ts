import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJsonTask";

export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>
) {
  try {
    const json = environment.getInput('JSON');
    if (!json) {
      environment.log.error("input->json not found");
    }
    const property = environment.getInput("Property Name");
    if (!property) {
      environment.log.error("input->property not found");
    }

    const jsonData = JSON.parse(json)
    const result = jsonData[property];
    if (result === undefined) {
      environment.log.error(`Property '${property}' not found in JSON`);
      return false
    }
    environment.setOutput("Property Value", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
