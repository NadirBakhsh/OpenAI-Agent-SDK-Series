import "dotenv/config"
import { Agent, tool, run } from "@openai/agents"
import { z } from "zod"

import fs from "node:fs/promises"

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

const saleAgent = new Agent({
  name: "saleAgent",
  instructions: "",
  tools: [
    fetchPlanesTool,
    refundAgent.asTool({
      toolName: "refund_Expert",
      toolDescription:"Tool to process refund for a given customer ID and reason."
    })
  ]
})

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
  name: "saleAgent",
  instructions: "",
  tools: [refundProcessTool]
})

async function runAgent(query = '') {
  const result = await run(salesAgent, query);
  console.log(result.finalOutput);
}

runAgent(
  `I had a plan 399. I need a refund right now. my cus id is cust123 because of I am shifting to a new place`
);
