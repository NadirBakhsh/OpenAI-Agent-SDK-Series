## Step_01: Building Your First Agent - Hello World

### Create an OpenAI account and obtain an API key

1. Open the OpenAI docs/portal: [OpenAI Platform](https://platform.openai.com/docs/overview) 
2. Click "Sign up" and complete registration (you can use Google or email).  
3. After signing in, open the Dashboard (top-right).  
4. Manage projects from the header—use the default project or create a new one.  
5. Add billing: open the Billing section from the sidebar and add a payment method. Add at least $5 to enable API usage.  
6. Go to the API Keys (or “View API keys”) section in the dashboard and create a new key.  
7. Store the key securely and do not commit it to source control. Example environment variable:
    - macOS / Linux: export OPENAI_API_KEY="sk-..."  
    - Windows PowerShell: $env:OPENAI_API_KEY="sk-..."  

Notes:
- Keep your API key private. Rotate keys if they are exposed.
- Billing and UI elements may change; consult the OpenAI docs if anything differs.


---

### Set up your development environment

### Create a .env file and set OPENAI_API_KEY

1. In your project root create a file named `.env` and add your key (copy it from the OpenAI Dashboard → API keys):
```env
OPENAI_API_KEY="sk-Your-OpenAI-API-Key-Here"
```

2. Prevent accidental commits by adding `.env` to your `.gitignore`:
```gitignore
.env
```

3. (Optional) Example to load the value in Node.js using dotenv:
```bash
npm install dotenv
```
```js
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;
```
**Note:**
Keep the key secret and do not push it to source control. Rotate the key if it is exposed.

