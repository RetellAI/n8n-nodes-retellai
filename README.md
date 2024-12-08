# n8n-nodes-retellapi

This repo contains custom nodes for integrating Retell AI with [n8n](n8n.io). It includes the node linter and other dependencies.

## Prerequisites

You need the following installed on your development machine:

* [git](https://git-scm.com/downloads)
* Node.js (Minimum version Node 20). You can find instructions on how to install using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
* Install n8n globally with:
  ```
  npm install n8n -g
  ```
* Recommended: Watch this [helpful video tutorial](https://www.youtube.com/watch?v=nX_8OVhUVSY) on creating custom n8n nodes

## Setup Instructions

1. Clone the repository:
   ```
   git clone git@gitlab.com:kanzucodeinc/client-projects/retellai-n8n-custom-node.git
   ```
2. Run `npm install` to install dependencies
3. Open the project in your editor
4. Browse the nodes in `/nodes` and `/credentials`
5. Update the `package.json` to match your details
6. Run `npm run lint` to check for errors or `npm run lintfix` to automatically fix errors when possible

## Testing Your Node Locally

1. Build and link your node:
   ```bash
   npm run build
   npm link
   ```

2. Set up your local n8n custom nodes directory:
   ```bash
   # Create custom directory if it doesn't exist
   mkdir -p ~/.n8n/custom
   cd ~/.n8n/custom
   npm init -y
   ```

3. Link your node to n8n:
   ```bash
   # In ~/.n8n/custom
   npm link n8n-nodes-retellapi
   ```

4. Start n8n:
   ```bash
   n8n start
   ```

## Setting Up Credentials

1. Open your n8n instance (usually at http://localhost:5678)
2. Go to Settings → Credentials
3. Click on "Add Credential"
4. Select the Retell API credential type
5. Fill in your API credentials
6. Save and use in your workflows

## Troubleshooting

If you encounter issues:
- Ensure the custom directory exists in `~/.n8n/`
- Check that you ran `npm link` in the correct directories
- Verify n8n is using the custom directory path
- Restart n8n after making changes

## More Information

Refer to [n8n's documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building custom nodes.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)


