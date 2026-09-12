# Changelog

## 0.2.5 - Unreleased

This release includes breaking changes to web-call creation and Agent → Get Many. Update affected browser integrations and workflows before upgrading `@retellai/n8n-nodes-retellai`.

### Breaking changes and migration

#### Web-call creation requires browser SDK 3.x

Web-call creation now uses `POST /v3/create-web-call`. Its output contains browser connection details (`call_id`, `access_token`, `transport`, `ice_servers`, and `expires_at`) instead of the previous full web-call object. Browser integrations using `retell-client-js-sdk` 2.x cannot connect using this response.

Upgrade the SDK in the browser application that consumes the n8n output:

```bash
npm install retell-client-js-sdk@^3
```

If your application uses `RetellWebClient`, update its `startCall` invocation to pass the additional connection fields:

```js
import { RetellWebClient } from 'retell-client-js-sdk';

const retellWebClient = new RetellWebClient();
// createCallResponse is the web-call creation output returned by your n8n workflow.
await retellWebClient.startCall({
  accessToken: createCallResponse.access_token,
  callId: createCallResponse.call_id,
  transport: createCallResponse.transport,
  iceServers: createCallResponse.ice_servers,
});
```

Forward these fields through any intermediate webhook response or field-mapping node. If downstream nodes need call fields such as `agent_id` or `call_status`, retrieve them with Call → Get using the returned `call_id`.

The v2 API has an announced deprecation date of **2026-09-30**. This package switches to v3 immediately when upgraded to 0.2.5; it does not wait until that date or provide a v2 compatibility option. Coordinate the browser SDK and workflow changes with the package upgrade. See the [browser SDK source](https://github.com/RetellAI/retell-client-js-sdk) for its 3.x interfaces.

#### Agent → Get Many returns summaries

Agent → Get Many now uses `POST /v2/list-agents` and returns one summary per voice agent, rather than full agent configurations. Configuration fields such as `voice_id` are no longer present, so expressions that read them directly from Get Many must be updated.

To retrieve full configurations:

1. Connect Agent → Get Many to another RetellAI node.
2. Set that node to Agent → Get.
3. Set Agent ID to the expression `{{ $json.agent_id }}`.
4. Connect downstream nodes that need fields such as `voice_id` to the Get node's output.

The Get node runs for each incoming agent item and makes one additional API request per agent. If you already know the agent ID, use Agent → Get directly.

### Fixes and improvements

- Add optional Override Agent Version to Create Phone Call. Accept numeric versions (including `0`), `latest`, `latest_published`, and version tags when Override Agent ID is set.
- Omit blank, missing, or null overrides, including n8n expression results, so calls use the phone number's configured agent when no override is supplied.
- Follow pagination for agent, phone-number, and LLM lists and the From Number dropdown; honor Phone Number → Get Many's Return All and Limit settings.
- Convert phone-number agent assignments to the current weighted binding fields on create and update. Empty assignments clear a binding; omitted assignments preserve it.
- Include the API migrations documented in 0.2.4 below for users upgrading from the published 0.2.3 package.

## 0.2.4 - 2026-06-12

- Migrate list endpoints ahead of Retell API deprecation on 2026-06-15:
  - `POST /v2/list-calls` → `POST /v3/list-calls` (Call: Get Many, Watch Calls trigger)
  - `GET /list-retell-llms` → `GET /v2/list-retell-llms` (LLM: Get Many)
  - `GET /list-phone-numbers` → `GET /v2/list-phone-numbers` (Phone Number: Get Many, From Number dropdown)
- Handle updated response envelope (`items`, `pagination_key`, `has_more`) returned by versioned list endpoints.

## 0.2.3 - 2025-11-13

- Remove logger usage.
- Update email in package.json.
- Update node categories to "Communication" and "Miscellaneous".
- Remove custom credentials validator.
- Move *n8n-workflow* to *peerDependencies*.
- Remove all declerative-style code since programmatic style is what executes the nodes.
- Add *usableAsTool* to action.
- Use helpers.httpRequestWithAuthentication instead of helpers.request (deprecated).

## 0.2.2 - 2025-08-19

- Remove unused dependency on [ws](https://www.npmjs.com/package/ws).

## 0.2.1 - 2025-08-18

- Update node categories to "Communication" and "AI".


## 0.2.0 - 2025-08-18

- Add Watch Call Trigger.
- Replace "From Number" text field in Call action with options dropdown that is populated by existing phone numbers.
- Add "Override Agent ID" text field to Call action.
- Add "Dynamic Variables" Key-Value collections field to Call action.
- Update LLM Model options in LLM action as per provided list in the Retell [API documentation](https://docs.retellai.com/api-references/create-retell-llm#body-model).

## 0.1.3 - 2024-12-13

- Add detailed error message if agent ID not found.

## 0.1.2 - 2024-12-11

- Fix knowledge-base creation api auth error.

## 0.1.1 - 2024-12-10

- Fix case-sensitivity issue that was breaking the functionality.

## 0.1.0 - 2024-12-09

- Initial release.
