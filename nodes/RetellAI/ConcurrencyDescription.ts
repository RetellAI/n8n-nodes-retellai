import type { INodeProperties } from 'n8n-workflow';

export const concurrencyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['concurrency'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get concurrency information',
				description: 'Get current concurrency usage and limits',
			},
		],
		default: 'get',
	},
];

export const concurrencyFields: INodeProperties[] = [];
