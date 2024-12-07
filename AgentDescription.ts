// AgentDescription.ts
import type { INodeProperties } from 'n8n-workflow';

export const agentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agent'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an agent',
				routing: {
					request: {
						method: 'POST',
						url: '/create-agent',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an agent',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/delete-agent/{{$parameter.agentId}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an agent',
				routing: {
					request: {
						method: 'GET',
						url: '=/get-agent/{{$parameter.agentId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many agents',
				routing: {
					request: {
						method: 'GET',
						url: '/list-agents',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an agent',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/update-agent/{{$parameter.agentId}}',
					},
				},
			},
		],
		default: 'create',
	},
];

export const agentFields: INodeProperties[] = [
	// Create operation fields
	{
		displayName: 'Response Engine',
		name: 'responseEngine',
		type: 'fixedCollection',
		default: {},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'properties',
				displayName: 'Properties',
				values: [
					{
						displayName: 'LLM ID',
						name: 'llmId',
						type: 'string',
						required: true,
						default: '',
						description: 'Unique id of Retell LLM',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						required: true,
						options: [
							{
								name: 'Retell LLM',
								value: 'retell-llm',
							},
						],
						default: 'retell-llm',
					},
				],
			},
		],
	},
	{
		displayName: 'Voice ID',
		name: 'voiceId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getVoices',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Voice ID for the agent',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Agent Name',
				name: 'agentName',
				type: 'string',
				default: '',
				description: 'Name of the agent',
			},
			{
				displayName: 'Voice Model',
				name: 'voiceModel',
				type: 'options',
				options: [
					{
						name: 'Eleven Turbo V2',
						value: 'eleven_turbo_v2',
					},
					{
						name: 'Eleven Turbo V2.5',
						value: 'eleven_turbo_v2_5',
					},
					{
						name: 'Eleven Multilingual V2',
						value: 'eleven_multilingual_v2',
					},
				],
				default: '',
				description: 'Voice model to use',
			},
			{
				displayName: 'Voice Speed',
				name: 'voiceSpeed',
				type: 'number',
				default: 1,
				typeOptions: {
					minValue: 0.5,
					maxValue: 2,
				},
				description: 'Speed of voice (0.5-2)',
			},
		],
	},
	// Get operation fields
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['get', 'delete', 'update'],
			},
		},
		default: '',
		description: 'The ID of the agent',
	},
	// Update operation fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Agent Name',
				name: 'agentName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Voice ID',
				name: 'voiceId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getVoices',
				},
				default: '',
			},
			{
				displayName: 'Voice Speed',
				name: 'voiceSpeed',
				type: 'number',
				default: 1,
				typeOptions: {
					minValue: 0.5,
					maxValue: 2,
				},
			},
		],
	},
];