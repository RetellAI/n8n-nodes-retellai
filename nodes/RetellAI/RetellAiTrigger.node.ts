import { INodeExecutionData, INodeType, INodeTypeDescription, IPollFunctions } from 'n8n-workflow';
import { retellApiRequest } from './GenericFunctions';

const DEFAULT_FETCH_LIMIT = 1000;

export class RetellAiTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Retell AI Trigger',
		name: 'retellAiTrigger',
		icon: 'file:retellai.svg',
		group: ['trigger'],
		polling: true,
		version: 1,
		subtitle: 'Retell AI Trigger',
		description: 'Interact with RetellAI API Triggers',
		eventTriggerDescription: 'Retell AI Trigger',
		defaults: {
			name: 'Retell AI Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'retellAIApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Trigger',
				name: 'trigger',
				type: 'options',
				options: [{ name: 'Watch Calls', value: 'watchCalls' }],
				default: 'watchCalls',
				description: 'Select type of trigger',
			},
			{
				displayName: 'Call Status',
				name: 'callStatus',
				type: 'options',
				options: [
					{ name: 'Ended', value: 'ended' },
					{ name: 'Error', value: 'error' },
					{ name: 'Not Connected', value: 'not_connected' },
					{ name: 'Ongoing', value: 'ongoing' },
					{ name: 'Registered', value: 'registered' },
				],
				default: 'ended',
				description: 'Only return calls with this status',
				displayOptions: {
					show: {
						trigger: ['watchCalls'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					// eslint-disable-next-line n8n-nodes-base/node-param-type-options-max-value-present
					maxValue: DEFAULT_FETCH_LIMIT,
				},
				description: 'Max number of results to return',
				// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
				default: DEFAULT_FETCH_LIMIT,
				displayOptions: {
					show: {
						trigger: ['watchCalls'],
					},
				},
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const event = this.getNodeParameter('trigger', 0) as string;

		if (event === 'watchCalls') {
			try {
				const callStatus = this.getNodeParameter('callStatus', 0) as string;
				const limit = this.getNodeParameter('limit', DEFAULT_FETCH_LIMIT) as string;

				const response = await retellApiRequest.call(this, 'POST', '/v2/list-calls', {
					filterCriteria: {
						call_status: callStatus,
					},
					limit,
				});

				if (!Array.isArray(response) || response.length === 0) {
					return null;
				}

				const nodeStaticData = this.getWorkflowStaticData('node');
				const lastSeenTimestamp: number | null =
					(nodeStaticData.lastSeenTimestamp as number) ?? null;

				const newCalls = response.filter((call) => {
					return lastSeenTimestamp === null || call.end_timestamp > lastSeenTimestamp;
				});
				if (!newCalls.length) {
					return null;
				}

				nodeStaticData.lastSeenTimestamp = newCalls[0].end_timestamp;

				const mappedData = newCalls.map((call) => ({
					id: call.call_id,
					callStatus: call.call_status,
					startedAt: new Date(call.start_timestamp).toISOString(),
					endedAt: new Date(call.end_timestamp).toISOString(),
					from: call.from_number,
					to: call.to_number,
					duration: call.duration_ms / 1000,
				}));
				return [this.helpers.returnJsonArray(mappedData)];
			} catch (error) {
				this.logger.error('Error in Retell AI Watch Call polling trigger', { error });
				this.logger.info(JSON.stringify(error));
				return null;
			}
		}

		return null;
	}
}
