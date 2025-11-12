### Agents

Agents are the main building‑block of the OpenAI Agents SDK. An Agent is a Large Language Model (LLM) that has been configured with:

- **Instructions** – the system prompt that tells the model who it is and how it should respond.
- **Model** – which OpenAI model to call, plus any optional model tuning parameters.
- **Tools** – a list of functions or APIs the LLM can invoke to accomplish a task.


#### Basic configuration

The Agent constructor takes a single configuration object. The most commonly‑used properties are shown below.

| Property | Required | Description |
|----------|----------|-------------|
| name | yes | A short human‑readable identifier. |
| instructions | yes | System prompt (string or function – see Dynamic instructions). |
| model | no | Model name or a custom Model implementation. |
| modelSettings | no | Tuning parameters (temperature, top_p, etc.); if needed, nest additional values under providerData. |
| tools | no | Array of Tool instances the model can call. |

```ts
import { Agent, tool } from '@openai/agents';
import { z } from 'zod';

const getWeather = tool({
  name: 'get_weather',
  description: 'Return the weather for a given city.',
  parameters: z.object({ city: z.string() }),
  async execute({ city }) {
    return `The weather in ${city} is sunny.`;
  },
});

const agent = new Agent({
  name: 'Weather bot',
  instructions: 'You are a helpful weather bot.',
  model: 'gpt-4.1',
  tools: [getWeather],
});
```


#### Example: fetching real weather data by calling Agent tool.

```ts
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

```

Notes:
- Ensure OPENAI_API_KEY is set in your environment.
- Install: npm install @openai/agents zod
- Requires Node with global fetch (v18+). Polyfill if on older versions.
- The agent will decide when to invoke get_weather and compose the final answer.

