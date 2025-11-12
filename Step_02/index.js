import "dotenv/config"
import { Agent, run, tool } from "@openai/agents"
import { z } from "zod"

const getWeatherTool = tool({
  name: "getWeather",
  description: "Get the current weather for a given city.",

  parameters: z.object({
    city: z.string().describe("The name of the city to get the weather for.")
  }),

  async execute({ city }) {
    const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`
    const response = await fetch(url)
    const data = await response.text()
    return data
  }
})

const weatherAgent = new Agent({
  name: "WeatherAgent",
  instructions:
    "This agent uses the getWeather tool to provide the current weather for a specified city.",
  tools: [getWeatherTool]
})

async function main() {
  const response = await run(
    weatherAgent,
    "What is the current weather in karachi City?"
  )
  console.log(response.finalOutput)
}

main()
