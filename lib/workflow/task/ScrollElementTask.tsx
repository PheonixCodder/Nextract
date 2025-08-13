import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ArrowUpIcon, Edit3Icon, MousePointerClick } from "lucide-react";

export const ScrollElementTask = {
  type: TaskType.SCROLL_ELEMENT,
  label: "Scroll to Element",
  icon: (props) => (
    <ArrowUpIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
        name:'Selector',
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
    credits : 1
} satisfies WorkflowTask