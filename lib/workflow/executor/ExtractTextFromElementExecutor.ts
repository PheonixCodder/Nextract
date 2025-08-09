import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
) {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
        return false
    }
    const html = environment.getInput('Html');
    if (!html) {
        return false
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element){
        return false
    }
    const text = $.text(element);

    if (!text){
        console.log('Element has no text')
        return false
    }

    environment.setOutput('Extracted Text', text);


    return true;
  } catch (error) {
    console.log(error);
    return true;
  }
}
