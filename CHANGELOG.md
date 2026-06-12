# Changelog

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
