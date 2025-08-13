import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { DatabaseIcon, Edit3Icon, FileJson2Icon, MousePointerClick } from "lucide-react";

export const AddPropertyToJsonTask = {
  type: TaskType.ADD_PROPERTY_TO_JSON,
  label: "Add property to JSON",
  icon: (props) => (
    <DatabaseIcon className="stroke-orange-400" {...props} />
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
    {
        name:'Property Value',
        type: TaskParamType.STRING,
        required: true,
    },
  ] as const,
  outputs : [
        {
            name : 'Update JSON',
            type : TaskParamType.STRING,
        }
    ],
    credits : 1
} satisfies WorkflowTask