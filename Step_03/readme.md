### Output types

By default, an Agent returns plain text (string). If you want the model to return a structured object you can specify the outputType property.

#### Structured output

```ts
import { Agent, tool } from '@openai/agents';
import { z } from 'zod';

const CalendarEvent = z.object({
  name: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
});

const extractor = new Agent({
  name: 'Calendar extractor',
  instructions: 'Extract calendar events from the supplied text.',
  outputType: CalendarEvent,
});
``` 


