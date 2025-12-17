import { ExecutionEnvironment } from "@/types/executor";
import { TakeScreenshotTask } from "../task/TakeScreenshot";

export async function TakeScreenshotExecutor(
  environment: ExecutionEnvironment<typeof TakeScreenshotTask>
): Promise<boolean> {
  try {
    const page = environment.getPage();
    if (!page) {
      environment.log.error("No page found");
      return false;
    }

    const fullPage = environment.getInput("Full page") === "true";
    const screenshotName = environment.getInput("Screenshot name") || "screenshot";
    const quality = parseInt(environment.getInput("Quality") || "0", 10);

    const screenshotOptions: any = {
      fullPage,
      encoding: "base64" as const,
    };

    if (quality > 0) {
      screenshotOptions.quality = quality;
      screenshotOptions.type = "jpeg";
    }

    environment.log.info(
      `Taking ${fullPage ? "full page" : "visible area"} screenshot...`
    );
    
    const screenshot = await page.screenshot(screenshotOptions);
    const imageFormat = quality > 0 ? "jpeg" : "png";
    const dataUrl = `data:image/${imageFormat};base64,${screenshot}`;

    environment.setOutput("Screenshot", dataUrl);
    environment.setOutput("Screenshot name", screenshotName);
    environment.setOutput("Download URL", dataUrl);

    environment.log.info(`Screenshot "${screenshotName}" captured successfully`);
    return true;
  } catch (e: any) {
    environment.log.error(`Screenshot capture failed: ${e.message}`);
    return false;
  }
}