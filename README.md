# n8n-nodes-retellai

[![n8n](https://img.shields.io/badge/n8n-community%20node-orange.svg)](https://n8n.io/)
[![RetellAI](https://img.shields.io/badge/Powered%20by-RetellAI-blue.svg)](https://retell.ai)

This is the official n8n node for RetellAI. It provides nodes to interact with the RetellAI API for creating and managing voice AI agents.

[RetellAI](https://retell.ai) provides APIs for creating conversational AI agents with natural-sounding voices for phone calls, web calls, and more.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Operations](#operations)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)
- [Support](#support)

## Prerequisites

- n8n instance (self-hosted or cloud)
- RetellAI account with API key ([Get one here](https://retell.ai))
- Basic understanding of n8n workflows

## Installation

### Option 1: Install via n8n Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-retellai`
5. Agree to the security warning and install

### Option 2: Manual Installation

```bash
cd ~/.n8n/custom
npm install n8n-nodes-retellai
```

Then restart your n8n instance.

## Configuration

### Setting up RetellAI Credentials

1. Get your API key from [RetellAI Dashboard](https://dashboard.retell.ai)
   - Sign up/login to your RetellAI account
   - Navigate to **Settings** → **API Keys**
   - Copy your API key

2. In n8n:
   - Go to **Credentials** → **New**
   - Search for "RetellAI"
   - Paste your API key
   - Save the credentials

### Creating Your First Voice Agent

1. Create a new workflow in n8n
2. Add a **RetellAI** node
3. Select the **Agent** resource
4. Choose **Create Agent** operation
5. Configure your agent:
   - **Name**: My First Agent
   - **Voice ID**: Select from available voices
   - **LLM**: Choose your language model
   - **Prompt**: Define how your agent should behave

## Operations

### Agent
Manage conversational AI agents.

| Operation | Description |
|-----------|-------------|
| Create Agent | Create a new voice AI agent |
| Update Agent | Modify an existing agent |
| Delete Agent | Remove an agent |
| Get Agent | Retrieve agent details |
| Get Many Agents | List all your agents |

### Call
Manage phone and web calls.

| Operation | Description |
|-----------|-------------|
| Create Call | Initiate a new call |
| End Call | Terminate an active call |
| Get Call | Get call details and transcript |
| Get Many Calls | List call history |
| Watch Call (Trigger) | Trigger workflows on call events |

### Concurrency

| Operation | Description |
|-----------|-------------|
| Get Concurrency | Check current call concurrency limits |

### Knowledge Base
Manage knowledge bases for your agents.

| Operation | Description |
|-----------|-------------|
| Create Knowledge Base | Upload documents for agent context |
| Get Knowledge Base | Retrieve knowledge base details |
| Get Many Knowledge Bases | List all knowledge bases |
| Delete Knowledge Base | Remove a knowledge base |

### LLM
Manage language model configurations.

| Operation | Description |
|-----------|-------------|
| Create LLM | Add a new LLM configuration |
| Update LLM | Modify LLM settings |
| Delete LLM | Remove an LLM config |
| Get LLM | Get LLM details |
| Get Many LLMs | List all LLM configs |

### Phone Number
Manage phone numbers for outbound/inbound calls.

| Operation | Description |
|-----------|-------------|
| Create Phone Number | Add a new phone number |
| Update Phone Number | Modify phone number settings |
| Delete Phone Number | Remove a phone number |
| Get Phone Number | Get phone number details |
| Get Many Phone Numbers | List all phone numbers |

### Voice
Browse available voices.

| Operation | Description |
|-----------|-------------|
| Get Voice | Get voice details |
| Get Many Voices | List all available voices |

## Usage Examples

### Example 1: Simple Outbound Call

Create a workflow that makes an outbound call:

1. **Trigger**: Schedule Trigger (daily at 9 AM)
2. **RetellAI** → **Call** → **Create Call**
   - Phone Number: Your RetellAI number
   - To Number: `+1234567890`
   - Agent: Select your agent
3. **Slack** → Send message with call status

### Example 2: Call Status Webhook

Trigger workflows when call events occur:

1. **RetellAI** → **Call** → **Watch Call** (Trigger)
   - Event Types: `call_started`, `call_ended`
2. **IF** node: Check if call ended
3. **Google Sheets** → Append call transcript
4. **Email** → Send summary to team

### Example 3: Dynamic Agent with Knowledge Base

Create an agent that answers FAQs:

1. **RetellAI** → **Knowledge Base** → **Create**
   - Upload your FAQ document
2. **RetellAI** → **Agent** → **Create**
   - Link to knowledge base
   - Set voice and LLM
3. **HTTP Request** → Expose agent via webhook

## Troubleshooting

### Common Issues

**Error: "Invalid API Key"**
- Verify your API key is copied correctly from [RetellAI Dashboard](https://dashboard.retell.ai)
- Ensure no extra spaces in the credentials

**Error: "Rate limit exceeded"**
- Check your [RetellAI plan limits](https://retell.ai/pricing)
- Add a **Wait** node between requests if needed

**Error: "Agent not found"**
- Verify the Agent ID exists in your RetellAI account
- Use "Get Many Agents" to list available agents

**Node not appearing in n8n**
- Ensure the node is properly installed
- Restart your n8n instance after installation
- Check n8n logs for installation errors

### Debug Mode

Enable debug logging in n8n to see detailed API requests:

```bash
export DEBUG=n8n:*
n8n start
```

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [RetellAI API Documentation](https://docs.retellai.com)
- [RetellAI Dashboard](https://dashboard.retell.ai)
- [n8n Documentation](https://docs.n8n.io)

## Contributing

Contributions are welcome! Please see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for guidelines.

## Support

For support with this integration:

- **RetellAI Issues**: support@retell.ai or [RetellAI Documentation](https://docs.retellai.com)
- **n8n Issues**: [n8n Community Forum](https://community.n8n.io)
- **Node Issues**: [GitHub Issues](https://github.com/RetellAI/n8n-nodes-retellai/issues)

## License

[MIT](LICENSE.md)

---

Built with ❤️ by the RetellAI team for the n8n community.
