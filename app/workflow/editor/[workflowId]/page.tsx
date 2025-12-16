import { notFound, redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';
import { getWorkflow } from '@/actions/workflows/getWorkflowForUser';
import Editor from '@/app/workflow/_components/Editor';


export default async function WorkflowEditorPage ({ params } :{ params: { workflowId: string } }) {
  const { workflowId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }
  const workflow = await getWorkflow(workflowId)
  if (!workflow) {
    notFound();
  }

  return (
  <Editor workflow={workflow} />
  )
};

