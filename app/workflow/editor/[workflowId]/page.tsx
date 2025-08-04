import { getWorkflow } from "@/actions/workflows/getWorkflowForUser"; // Import the function
import NotFoundPage from "@/app/not-found";  // Page to render when workflow isn't found or there is an error
import React from "react";

const Page = async ({ params }: { params: { workflowId: string } }) => {
  const { workflowId } = await params;
  const workflow = await getWorkflow(workflowId);
  console.log(workflow)
  return <div>Workflow</div>;
};

export default Page;
