import { AppNode, AppNodeMissingInputs } from "@/types/appNodes";
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";


export enum FlowToExecutionPlanValidationError {
    'NO_ENTRY_POINT',
    'INVALID_INPUTS',
}

type FlowToExecutionPlanType = {
    executionPlan ?: WorkflowExecutionPlan;
    error ?: {
        type: FlowToExecutionPlanValidationError
        invalidElements?: AppNodeMissingInputs[]
    }
}

export function FlowToExecutionPlan(nodes:AppNode[], edges:Edge[]):FlowToExecutionPlanType {

    const entryPoint = nodes.find(node => TaskRegistry[node.data.type].isEntryPoint)

    if (!entryPoint) {
        return {
            error:{
                type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT
            }
        }
    }

    const inputsWithError: AppNodeMissingInputs[] = []
    const planned = new Set<string>()

    const invalidInputs = getInvalidInputs(entryPoint, edges, planned)
    if (invalidInputs.length > 0) {
        inputsWithError.push({
            nodeId: entryPoint.id,
            inputs: invalidInputs
        })
    }

    const executionPlan : WorkflowExecutionPlan = [
        {
            phase : 1,
            nodes : [entryPoint],
        }
    ]
    planned.add(entryPoint.id)

    for (let phase = 2; phase <= nodes.length && planned.size < nodes.length; phase++) {
        const nextPhase : WorkflowExecutionPlanPhase = { phase, nodes: [] }
        for (const currentNode of nodes) {
            if (planned.has(currentNode.id)) {
                // Node have already been put in the execution plan
                continue
            }

            const invalidInputs = getInvalidInputs(currentNode, edges, planned)
            if (invalidInputs.length > 0) {
                const incomers = getIncomers(currentNode, nodes, edges)
                if (incomers.every(incomer => planned.has(incomer.id))) {
                    // if all incoming incomers/edges are planned and there are still invalid inputs
                    // it means that the current node has an invalid input that is not yet planned
                    // which means that the workflow is not valid
                    inputsWithError.push({
                        nodeId: currentNode.id,
                        inputs: invalidInputs
                    })
            }else{
                // let's skip this node for now
                continue
            }
        }
        nextPhase.nodes.push(currentNode)
    }
    for (const currentNode of nextPhase.nodes) {
        planned.add(currentNode.id)
    }
    executionPlan.push(nextPhase)
}
if (inputsWithError.length > 0) {
    return {
        error: {
            type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
            invalidElements: inputsWithError
        }
    }
}
    return {executionPlan}
}
function getInvalidInputs(node:AppNode, edges:Edge[], planned: Set<string>): string[] {
    const invalidInputs = []
    const inputs = TaskRegistry[node.data.type].inputs
    for (const input of inputs) {
        const inputValue = node.data.inputs[input.name]
        const inputValueProvided = inputValue?.length > 0
        if (inputValueProvided) {
            // this input is fine, so we move on
            continue
        }
        // If a value is not provided by the user than we need to check
        // if there is an input linked to the current input
        const incomingEdges = edges.filter((edge) => edge.target === node.id)

        const inputLinkedToOutput = incomingEdges.find((edge) => edge.targetHandle === input.name)

        const requiredInputProvidedByVisitedOutput = input.required && inputLinkedToOutput && planned.has(inputLinkedToOutput.source)

        if (requiredInputProvidedByVisitedOutput) {
            // the input is required and we have a valid value for it
            // provided by a task that has already been planned
            continue
        }else if (!input.required){
            // if the input is not required but there is an output linked to it
            // then we need to be sure that the output is already planned
            if (!inputLinkedToOutput) continue
            if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
                // The output is providing a value for the input
                // The input is fine
                continue
            }
        }
        invalidInputs.push(input.name)
    }
    return invalidInputs
}

function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]){
    if (!node.id){
        return []
    }
    const incomerIds = new Set()
    edges.forEach(edge => {
        if (edge.target === node.id) {
            incomerIds.add(edge.source)
        }
    })
    return nodes.filter(node => incomerIds.has(node.id))
}