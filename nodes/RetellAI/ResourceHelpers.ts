import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { retellApiRequest, validatePhoneNumber } from './GenericFunctions';

export async function handleCallOperations(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject> {
	let responseData: IDataObject = {};

	if (operation === 'createPhoneCall') {
		const fromNumber = this.getNodeParameter('fromNumber', i) as string;
		const toNumber = this.getNodeParameter('toNumber', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		
        // Validate both phone numbers
		validatePhoneNumber.call(this, fromNumber, 'fromNumber', i);
		validatePhoneNumber.call(this, toNumber, 'toNumber', i);
        
		const body: IDataObject = {
			from_number: fromNumber,
			to_number: toNumber,
		};

		if (additionalFields.overrideAgentId) {
			body.override_agent_id = additionalFields.overrideAgentId;
		}

		responseData = await retellApiRequest.call(
			this,
			'POST',
			'/v2/create-phone-call',
			body,
		);
	} else if (operation === 'createWebCall') {
		const agentId = this.getNodeParameter('agentId', i) as string;
		const body: IDataObject = {
			agent_id: agentId,
		};

		responseData = await retellApiRequest.call(
			this,
			'POST',
			'/v2/create-web-call',
			body,
		);
	} else if (operation === 'get') {
		const callId = this.getNodeParameter('callId', i) as string;
		responseData = await retellApiRequest.call(
			this,
			'GET',
			`/v2/get-call/${callId}`,
		);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const body: IDataObject = { filter_criteria: filters };

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', i) as number;
			body.limit = limit;
		}

		responseData = await retellApiRequest.call(
			this,
			'POST',
			'/v2/list-calls',
			body,
		);
	}

	return responseData;
}

export async function  handleLLMOperations(this: IExecuteFunctions, operation: string, itemIndex: number) {
    const llmId = this.getNodeParameter('llmId', itemIndex, '') as string;

    if (operation === 'create') {
        const model = this.getNodeParameter('model', itemIndex) as string;
        const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

        const body = {
            model,
            ...additionalFields,
        };

        return await retellApiRequest.call(this, 'POST', '/create-retell-llm', body);
    }

    if (operation === 'get') {
        return await retellApiRequest.call(this, 'GET', `/get-retell-llm/${llmId}`);
    }

    if (operation === 'getAll') {
        return await retellApiRequest.call(this, 'GET', '/list-retell-llms');
    }

    if (operation === 'update') {
        const updateFields = this.getNodeParameter('updateFields', itemIndex, {});
        return await retellApiRequest.call(this, 'PATCH', `/update-retell-llm/${llmId}`, updateFields);
    }

    if (operation === 'delete') {
        return await retellApiRequest.call(this, 'DELETE', `/delete-retell-llm/${llmId}`);
    }

    throw new NodeOperationError(
        this.getNode(),
        `The operation "${operation}" is not supported for resource LLM!`,
    );
}

export async function handlePhoneNumberOperations(this: IExecuteFunctions,operation: string, itemIndex: number) {
	if (operation === 'create') {
		const areaCode = this.getNodeParameter('areaCode', itemIndex) as number;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

		const body = {
			area_code: areaCode,
			...additionalFields,
		};

		// Area code validation
		if (areaCode < 200 || areaCode > 999) {
			throw new NodeOperationError(
				this.getNode(),
				'Area code must be a 3-digit number between 200 and 999',
				{ itemIndex },
			);
		}

		return await retellApiRequest.call(this, 'POST', '/create-phone-number', body);
	}

	const phoneNumber = this.getNodeParameter('phoneNumber', itemIndex, '') as string;
	
	// Validate phone number for all operations that use it
	if (['get', 'update', 'delete'].includes(operation)) {
		validatePhoneNumber.call(this, phoneNumber, 'phoneNumber', itemIndex);
	}

	if (operation === 'get') {
		return await retellApiRequest.call(this, 'GET', `/get-phone-number/${phoneNumber}`);
	}

	if (operation === 'getAll') {
		return await retellApiRequest.call(this, 'GET', '/list-phone-numbers');
	}

	if (operation === 'update') {
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

		// Validate any phone numbers in update fields
		if (updateFields.inboundNumber) {
			validatePhoneNumber.call(this, updateFields.inboundNumber as string, 'inboundNumber', itemIndex);
		}
		if (updateFields.outboundNumber) {
			validatePhoneNumber.call(this, updateFields.outboundNumber as string, 'outboundNumber', itemIndex);
		}

		return await retellApiRequest.call(
			this,
			'PATCH',
			`/update-phone-number/${phoneNumber}`,
			updateFields,
		);
	}

	if (operation === 'delete') {
		return await retellApiRequest.call(this, 'DELETE', `/delete-phone-number/${phoneNumber}`);
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for resource Phone Number!`,
		{ itemIndex },
	);
}

export async function handleVoiceOperations(this: IExecuteFunctions,operation: string, itemIndex: number) {
    if (operation === 'get') {
        const voiceId = this.getNodeParameter('voiceId', itemIndex) as string;
        return await retellApiRequest.call(this, 'GET', `/get-voice/${voiceId}`);
    }

    if (operation === 'getAll') {
        const options = this.getNodeParameter('options', itemIndex, {});
        return await retellApiRequest.call(this, 'GET', '/list-voices', {}, options);
    }

    throw new NodeOperationError(
        this.getNode(),
        `The operation "${operation}" is not supported for resource Voice!`,
    );
}

export async function handleKnowledgeBaseOperations(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject> {
	let responseData: IDataObject = {};

	if (operation === 'create') {
		// Using FormData for file uploads
		const formData = new FormData();
		
		const name = this.getNodeParameter('knowledgeBaseName', i) as string;
		formData.append('knowledge_base_name', name);

		// Handle binary files
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
		const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
        const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
        const uint8Array = new Uint8Array(dataBuffer as unknown as ArrayBuffer);
        const arrayBuffer = uint8Array.buffer;
        
        formData.append( 'knowledge_base_files', new Blob([arrayBuffer]), binaryData.fileName);
        
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		
		if (additionalFields.knowledgeBaseUrls) {
			formData.append('knowledge_base_urls', JSON.stringify(additionalFields.knowledgeBaseUrls));
		}

		responseData = await retellApiRequest.call(
			this,
			'POST',
			'/create-knowledge-base',
			formData,
			{},
			undefined,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		);
	} else if (operation === 'get') {
		const knowledgeBaseId = this.getNodeParameter('knowledgeBaseId', i) as string;
		responseData = await retellApiRequest.call(
			this,
			'GET',
			`/get-knowledge-base/${knowledgeBaseId}`,
		);
	}

	return responseData;
}

export async function handleAgentOperations(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject> {
	let responseData: IDataObject = {};

	if (operation === 'create') {
		const responseEngine = this.getNodeParameter('responseEngine.properties', i) as {
			llmId: string;
			type: string;
		};
		const voiceId = this.getNodeParameter('voiceId', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

		const body: IDataObject = {
			response_engine: {
				llm_id: responseEngine.llmId,
				type: responseEngine.type,
			},
			voice_id: voiceId,
		};

		if (additionalFields.voiceSpeed) {
			body.voice_speed = additionalFields.voiceSpeed;
		}

		responseData = await retellApiRequest.call(
			this,
			'POST',
			'/create-agent',
			body,
		);
	} else if (operation === 'update') {
		const agentId = this.getNodeParameter('agentId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

		responseData = await retellApiRequest.call(
			this,
			'PATCH',
			`/update-agent/${agentId}`,
			updateFields,
		);
	}

	return responseData;
}

export async function loadVoiceOptions(
	this: ILoadOptionsFunctions,
): Promise<Array<{ name: string; value: string; description?: string }>> {
	const voices = await retellApiRequest.call(this, 'GET', '/list-voices');
	
	return voices.map((voice: JsonObject) => ({
		name: voice.voice_name as string,
		value: voice.voice_id as string,
		description: `${voice.gender} voice with ${voice.accent} accent`,
	}));
}

export function formatPhoneNumber(phoneNumber: string): string {
	// Remove any non-digit characters
	const cleaned = phoneNumber.replace(/\D/g, '');
	// Check if it's a valid number (at least 10 digits)
	if (cleaned.length < 10) return phoneNumber;
	
	// Format as +1XXXXXXXXXX for US numbers
	if (cleaned.length === 10) {
		return `+1${cleaned}`;
	}
	// Format as +XXXXXXXXXXX for international numbers
	return `+${cleaned}`;
}

export interface IWebSocketMessage {
	type: string;
	data: JsonObject;
}

export function createWebSocketHandler(
	url: string,
	onMessage: (message: IWebSocketMessage) => void,
	onError: (error: Error) => void,
): WebSocket {
	const ws = new WebSocket(url);

	ws.onmessage = (event) => {
		try {
			const message = JSON.parse(event.data as string) as IWebSocketMessage;
			onMessage(message);
		} catch (error) {
			onError(new Error('Failed to parse WebSocket message'));
		}
	};

    ws.onerror = (event) => {
        if (event instanceof ErrorEvent) {
          onError(new Error(event.message));
        } else {
          onError(new Error('WebSocket error occurred'));
        }
      };

	return ws;
}