import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParamProps } from "@/types/appNodes";
import React, { useId } from "react";

const SelectParam = ({ param, updateNodeParamValue, value }: ParamProps) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-1 w-full select">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select onValueChange={(value) => updateNodeParamValue(value)} defaultValue={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder='Select an option' />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectLabel>Options</SelectLabel>
                {param.options.map((option)=>(
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectParam;
