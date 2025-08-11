import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
) {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Selector not provided");
    }
    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("Html not provided");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      environment.log.error("Element not provided");
      return false;
    }
    const text = $.text(element);

    if (!text) {
      environment.log.error("Element has no text");
      return false;
    }

    environment.setOutput("Extracted Text", text);

    return true;
  } catch (error : any) {
    environment.log.error(error.message)
    return false;
  }
}
