import "dotenv/config"
import { Agent, tool, run } from "@openai/agents"
import { z } from "zod"
import fs from "node:fs/promises"

const refundProcessTool = tool({
  name: "refundProcess",
  description: "Processes a refund for a given order ID.",
  parameters: z.object({
    customerId: z.string().describe("The ID of the plan to refund."),
    reason: z.string().describe("The reason for the refund.")
  }),
  execute: async function ({ customerId, reason }) {
    await fs.appendFile(
      "./refunds.txt",
      `Refund for Customer having ID ${customerId} for ${reason}`,
      "utf-8"
    )
    return { refundIssued: true }
  }
})

const refundAgent = new Agent({
  name: "refundAgent",
  instructions: "you are a refund processing agent. You handle all refund related queries.",
  tools: [refundProcessTool]
})

// Sale Agent
const fetchPlanesTool = tool({
  name: "fetchPlanes",
  description: "Fetches a list of planes from a local JSON file.",
  parameters: z.object({}),
  execute: async function () {
    return [
      { plan_id: "1", price_inr: 399, speed: "30MB/s" },
      { plan_id: "2", price_inr: 999, speed: "100MB/s" },
      { plan_id: "3", price_inr: 1499, speed: "200MB/s" }
    ]
  }
})

const salesAgent = new Agent({
  name: "salesAgent",
  instructions: "You are a sales agent. You help customers with plan details and sales related queries. For refund related queries, you handoff the conversation to the refund agent.",
  tools: [
    fetchPlanesTool,
    refundAgent.asTool({
      toolName: "refund_Expert",
      toolDescription:"Tool to process refund for a given customer ID and reason."
    })
  ]
})

const receptionAgent = new Agent({
    name: 'Reception Agent',
    instructions: 'You are the customer facing agent expert in understanding what customer needs and then route them or handoff them to the right agent',
    handoffDescription: 'You have two agents available: - salesAgent: Expert in handling queries like all plans and pricing available. Good for new customers. - refundAgent: Expert in handling user queries for existing customers and issue refunds and help them',
    handoffs: [salesAgent, refundAgent]
})

async function runAgent(query = '') {
  const result = await run(receptionAgent, query);
  console.log(result.finalOutput);
}

runAgent("I want to refund my plan because it is too expensive, nadir4k2010@gmail.com");