import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
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
import { useQuery } from "@tanstack/react-query";
import React, { useId } from "react";

const CredentialsParam = ({
  param,
  updateNodeParamValue,
  value,
}: ParamProps) => {
  const id = useId();
  const query = useQuery({
    queryKey: ["credentials-for-user"],
    queryFn: () => GetCredentialsForUser(),
    refetchInterval: 10000,
  });
  console.log(query);

  return (
    <div className="flex flex-col gap-1 w-full select">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
  {query.data?.length === 0 && (
    <SelectLabel>
      No Credentials found
    </SelectLabel>
  )}

  {query.data?.length > 0 && (
    <>
      <SelectLabel>Credentials</SelectLabel>
      {query.data.map((credential) => (
        <SelectItem key={credential.id} value={credential.name}>
          {credential.name}
        </SelectItem>
      ))}
    </>
  )}
</SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CredentialsParam;
