"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React from "react";

const InvoiceBtn = ({ id }: { id: string }) => {
//   const mutation = useMutation({
//     mutationFn: DownloadInvoice(id),
//   });
  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      className="text-xs gap-2 text-muted-foreground px-1"
    //   disabled={mutation.isPending}
    >
      Invoice
      {/* {mutation.isPending && <Loader2Icon className="h-4 w-4 animate-spin" />} */}
    </Button>
  );
};

export default InvoiceBtn;
