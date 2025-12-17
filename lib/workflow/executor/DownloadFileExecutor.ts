import { ExecutionEnvironment } from "@/types/executor";
import { DownloadFileTask } from "../task/DownloadFile";
import * as fs from "fs";
import * as path from "path";

export async function DownloadFileExecutor(
  environment: ExecutionEnvironment<typeof DownloadFileTask>
): Promise<boolean> {
  try {
    const page = environment.getPage();
    const fileUrl = environment.getInput("File URL");
    const urlType = environment.getInput("URL type");
    const customFilename = environment.getInput("File name");

    if (!page || !fileUrl || !urlType) {
      environment.log.error("Web page, file URL, and URL type are required");
      return false;
    }

    let downloadUrl: string;
    let filename: string;

    if (urlType === "direct") {
      downloadUrl = fileUrl;
      filename = customFilename || path.basename(new URL(fileUrl).pathname) || "downloaded_file";
    } else {
      // Link selector
      const element = await page.$(fileUrl);
      if (!element) {
        environment.log.error(`Element not found with selector: ${fileUrl}`);
        return false;
      }

      const href = await page.evaluate((el: Element) => {
        return (el as HTMLLinkElement).href || 
               (el as HTMLAnchorElement).href || 
               el.getAttribute("href") || 
               el.getAttribute("src");
      }, element);

      if (!href) {
        environment.log.error("Could not extract download URL from element");
        return false;
      }

      downloadUrl = href;
      filename = customFilename || `element_download_${Date.now()}`;
    }

    environment.log.info(`Downloading from: ${downloadUrl}`);

    // Use page.evaluate to fetch within browser context
    const base64Data = await page.evaluate(async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        return btoa(binary);
      } catch (error) {
        console.error("Download error:", error);
        return null;
      }
    }, downloadUrl);

    if (!base64Data) {
      environment.log.error("Failed to download file");
      return false;
    }

    environment.setOutput("File name", filename);
    environment.setOutput("File data", base64Data);
    environment.log.info(`File downloaded successfully: ${filename}`);
    
    return true;
  } catch (e: any) {
    environment.log.error(`Failed to download file: ${e.message}`);
    return false;
  }
}