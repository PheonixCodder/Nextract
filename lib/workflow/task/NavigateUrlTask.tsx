import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Edit3Icon, Link2Icon, MousePointerClick } from "lucide-react";

export const NavigateUrlTask = {
  type: TaskType.NAVIGATE_URL,
  label: "Navigate to URL",
  icon: (props) => (
    <Link2Icon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
        name:'URL',
        type: TaskParamType.STRING,
        required: true,
    },
  ] as const,
  outputs : [
        {
            name : 'Web Page',
            type : TaskParamType.BROWSER_INSTANCE,
        }
    ],
    credits : 2
} satisfies WorkflowTask