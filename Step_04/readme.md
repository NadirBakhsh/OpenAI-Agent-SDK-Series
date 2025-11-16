### Multiple Agents

In this step, we will explore how to create and manage multiple agents within the OpenAI Agent SDK. This allows for more complex interactions and workflows, where different agents can handle specific tasks or domains.

#### Objectives
- Understand how to define multiple agents in the SDK.
- Learn how to manage interactions between agents.
- Implement a simple scenario involving multiple agents.

#### Instructions

1. **Create a Scenario**: Design a simple scenario where multiple agents work together to achieve a common goal. For example, one agent could handle user input while another processes data and a third generates output.

2. **Define Multiple Agents**: Start by defining two or more agents in your project. Each agent should have its own set of capabilities and responsibilities.

3. **Set Up Communication**: Implement a mechanism for agents to communicate with each other. This could be through direct method calls, message passing, or a shared data store.

4. **Test the Interaction**: Run your scenario and observe how the agents interact. Make adjustments as necessary to improve communication and efficiency.

5. **Document Your Work**: Update your project documentation to reflect the addition of multiple agents and their interactions.


#### Scenario: “Dropshipping Support Agents Working Together”

**A customer contacts your system.**
- Sales Agent handles general questions.
- If customer requests a refund, Sales Agent passes it to Refund Agent.
- Refund Agent processes the refund and sends final output.

1. **Sales Agent**
- Greets customer
- Answers product or order questions
- Detects if user wants a refund
- If refund needed → calls Refund Agent

2. **Refund Agent**
- Receives refund request from Sales Agent
- Processes refund
- Sends confirmation back to Sales Agent
- Sales Agent informs customer of refund completion

