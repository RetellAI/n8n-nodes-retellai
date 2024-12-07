// GenericFunctions.ts
import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

export async function retellApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: string,
	resource: string,
	body: object = {},
	qs: object = {},
	uri?: string,
	option: IHttpRequestOptions = {},
): Promise<any> {
	const credentials = await this.getCredentials('retellAIApi');

	const options: IHttpRequestOptions = {
		headers: {
			'Authorization': `Bearer ${credentials.apiKey}`,
			'Content-Type': 'application/json',
		},
		method,
		body,
		qs,
		uri: uri || `https://api.retellai.com${resource}`,
		json: true,
		...option,
	};

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

export async function validateRetellCredentials(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
): Promise<void> {
	try {
		await retellApiRequest.call(this, 'GET', '/get-concurrency');
	} catch (error) {
		throw new NodeOperationError(this.getNode(), 'Invalid API key provided');
	}
}

export function validateE164Number(phoneNumber: string): boolean {
	const e164Regex = /^\+[1-9]\d{10,14}$/;
	return e164Regex.test(phoneNumber);
}

export function validatePhoneNumber(
	this: IExecuteFunctions,
	phoneNumber: string,
	parameterName: string,
	itemIndex: number,
): void {
	if (!validateE164Number(phoneNumber)) {
		throw new NodeOperationError(
			this.getNode(),
			`Invalid phone number format for ${parameterName}. Must be in E.164 format (e.g., +14157774444)`,
			{ itemIndex },
		);
	}
}