import { TaskType } from "@/types/task";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";

type ExecutorFn<T extends WorkflowTask> = (environment : ExecutionEnvironment<T>) => Promise<boolean>

type Registry = {
    [k in TaskType] : ExecutorFn<WorkflowTask & { type: k }>
}

export const ExecutorRegistry : Registry = {
    LAUNCH_BROWSER : LaunchBrowserExecutor,
    PAGE_TO_HTML : PageToHtmlExecutor,
    EXTRACT_TEXT_FROM_ELEMENT : ExtractTextFromElementExecutor
}