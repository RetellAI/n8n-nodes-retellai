import type { INodeProperties } from 'n8n-workflow';

export const callOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['call'],
			},
		},
		options: [
			{
				name: 'Create Phone Call',
				value: 'createPhoneCall',
				action: 'Create a phone call',
				routing: {
					request: {
						method: 'POST',
						url: '/v2/create-phone-call',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a call',
				routing: {
					request: {
						method: 'GET',
						url: '=/v2/get-call/{{$parameter.callId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many calls',
				routing: {
					request: {
						method: 'POST',
						url: '/v2/list-calls',
					},
				},
			},
		],
		default: 'createPhoneCall',
	},
];

export const callFields: INodeProperties[] = [
	// Fields for createWebCall operation
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createWebCall'],
			},
		},
		default: '',
		description:
			'Unique ID of agent used for the call. Your agent would contain the LLM Websocket URL used for this call.',
	},
	// Fields for createPhoneCall operation
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'From Number',
		name: 'fromNumber',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createPhoneCall'],
			},
		},
		default: '',
		description:
			'The number you own in E.164 format. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		placeholder: '+14157774443',
		typeOptions: {
			loadOptionsMethod: 'getPhoneNumbers',
		},
	},
	{
		displayName: 'To Number',
		name: 'toNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createPhoneCall'],
			},
		},
		default: '',
		description: 'The number you want to call in E.164 format',
		placeholder: '+14157774445',
	},
	{
		displayName: 'Override Agent ID',
		name: 'overrideAgentId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createPhoneCall'],
			},
		},
		default: '',
		description: 'Override the Agent used to make the call by passing a Retell Agent ID',
	},
	{
		displayName: 'Dynamic Variables',
		name: 'dynamicVariables',
		type: 'fixedCollection',
		description: 'Dynamic variables specified and used by the Retell Agent',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createPhoneCall'],
			},
		},
		typeOptions: { multipleValues: true },
		default: {},
		options: [
			{
				name: 'keyvalue',
				displayName: 'Key:Value',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						required: true,
						default: '',
					},
				],
			},
		],
	},
	// Fields for Get operation
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the call to retrieve',
	},
	// Fields for List operation
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];
