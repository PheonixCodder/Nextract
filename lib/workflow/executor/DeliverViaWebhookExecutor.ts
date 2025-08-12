import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhookTask";

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
) {
  try {
    const targetUrl = environment.getInput("Target URL");
    if (!targetUrl) {
      environment.log.error("input->Target URL not found");
    }
    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("input->Body not found");
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const statusCode = response.status;
    if (statusCode >= 400) {
      environment.log.error(`Failed to deliver via webhook. Status code: ${statusCode}`);
      return false
    }

    const responseBody = await response.json();
    environment.log.info(`Delivered via webhook. Response: ${JSON.stringify(responseBody)}`);
    
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
