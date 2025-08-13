import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJsonTask";
import { AddPropertyToJsonTask } from "../task/AddPropertyToJson";

export async function AddPropertyToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>
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
    const propertyValue = environment.getInput('Property Value');
    if (!property) {
      environment.log.error("input->property not found");
    }

    const jsonData = JSON.parse(json)
    jsonData[property] = propertyValue

    environment.setOutput('Update JSON', JSON.stringify(jsonData));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
