### Guardrails

Guardrails can run alongside your agents or block execution until they complete, allowing you to perform checks and validations on user input or agent output.

it can trigger an error and stop the costly model from running.

**There are two kinds of guardrails:**
1. Input guardrails run on the initial user input.
2. Output guardrails run on the final agent output.

#### Input guardrails

**Input guardrails run in three steps:**
1. The guardrail receives the same input passed to the agent.
2. The guardrail function executes and returns a GuardrailFunctionOutput wrapped inside an InputGuardrailResult.
3. If tripwireTriggered is true, an InputGuardrailTripwireTriggered error is thrown.

#### Output guardrails
**Output guardrails run in three steps:**
1. The guardrail receives the final output from the agent.
2. The guardrail function executes and returns a GuardrailFunctionOutput wrapped inside an OutputGuardrailResult.
3. If tripwireTriggered is true, an OutputGuardrailTripwireTriggered error is thrown.

#### what is a tripwire?
A tripwire is a condition defined within a guardrail that, when met, triggers an error to prevent further processing by the agent. This mechanism is used to enforce safety and compliance checks on both input and output data.

#### Implementing Guardrails
1. **Define Guardrail Functions**: Create functions that implement your guardrail logic. These functions should return a GuardrailFunctionOutput indicating whether the tripwire has been triggered.

```Input guardrail example
import {
  Agent,
  run,
  InputGuardrailTripwireTriggered,
  InputGuardrail,
} from '@openai/agents';
import { z } from 'zod';

const guardrailAgent = new Agent({
  name: 'Guardrail check',
  instructions: 'Check if the user is asking you to do their math homework.',
  outputType: z.object({
    isMathHomework: z.boolean(),
    reasoning: z.string(),
  }),
});

const mathGuardrail: InputGuardrail = {
  name: 'Math Homework Guardrail',
  // Set runInParallel to false to block the model until the guardrail completes.
  runInParallel: false,
  execute: async ({ input, context }) => {
    const result = await run(guardrailAgent, input, { context });
    return {
      outputInfo: result.finalOutput,
      tripwireTriggered: result.finalOutput?.isMathHomework ?? false,
    };
  },
};

const agent = new Agent({
  name: 'Customer support agent',
  instructions:
    'You are a customer support agent. You help customers with their questions.',
  inputGuardrails: [mathGuardrail],
});

async function main() {
  try {
    await run(agent, 'Hello, can you help me solve for x: 2x + 3 = 11?');
    console.log("Guardrail didn't trip - this is unexpected");
  } catch (e) {
    if (e instanceof InputGuardrailTripwireTriggered) {
      console.log('Math homework guardrail tripped');
    }
  }
}

main().catch(console.error);
```

```Output guardrail example
import {
  Agent,
  run,
  OutputGuardrailTripwireTriggered,
  OutputGuardrail,
} from '@openai/agents';
import { z } from 'zod';

// The output by the main agent
const MessageOutput = z.object({ response: z.string() });
type MessageOutput = z.infer<typeof MessageOutput>;

// The output by the math guardrail agent
const MathOutput = z.object({ reasoning: z.string(), isMath: z.boolean() });

// The guardrail agent
const guardrailAgent = new Agent({
  name: 'Guardrail check',
  instructions: 'Check if the output includes any math.',
  outputType: MathOutput,
});

// An output guardrail using an agent internally
const mathGuardrail: OutputGuardrail<typeof MessageOutput> = {
  name: 'Math Guardrail',
  async execute({ agentOutput, context }) {
    const result = await run(guardrailAgent, agentOutput.response, {
      context,
    });
    return {
      outputInfo: result.finalOutput,
      tripwireTriggered: result.finalOutput?.isMath ?? false,
    };
  },
};

const agent = new Agent({
  name: 'Support agent',
  instructions:
    'You are a user support agent. You help users with their questions.',
  outputGuardrails: [mathGuardrail],
  outputType: MessageOutput,
});

async function main() {
  try {
    const input = 'Hello, can you help me solve for x: 2x + 3 = 11?';
    await run(agent, input);
    console.log("Guardrail didn't trip - this is unexpected");
  } catch (e) {
    if (e instanceof OutputGuardrailTripwireTriggered) {
      console.log('Math output guardrail tripped');
    }
  }
}

main().catch(console.error);
```

1. guardrailAgent is used inside the guardrail functions.
2. The guardrail function receives the agent input or output and returns the result.
3. Extra information can be included in the guardrail result.
4. agent defines the actual workflow where guardrails are applied.