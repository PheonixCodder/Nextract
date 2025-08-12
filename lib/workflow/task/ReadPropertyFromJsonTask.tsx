import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Edit3Icon, FileJson2Icon, MousePointerClick } from "lucide-react";

export const ReadPropertyFromJsonTask = {
  type: TaskType.READ_PROPERTY_FROM_JSON,
  label: "Read property from JSON",
  icon: (props) => (
    <FileJson2Icon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "JSON",
      type: TaskParamType.STRING,
      required: true,
    },
    {
        name:'Property Name',
        type: TaskParamType.STRING,
        required: true,
    },
  ] as const,
  outputs : [
        {
            name : 'Property Value',
            type : TaskParamType.STRING,
        }
    ],
    credits : 1
} satisfies WorkflowTask