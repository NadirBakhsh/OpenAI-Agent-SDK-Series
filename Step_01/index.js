import 'dotenv/config';
import { Agent, run } from "@openai/agents";



const helloAgent = new Agent({
    name: "HelloAgent",
    instructions: "This agent Always responds with 'Hello, World!' to any input.",
})

run(helloAgent, "What is the meaning of life?").then(response => {
    console.log(response.finalOutput); // Should print: Hello, World!
});