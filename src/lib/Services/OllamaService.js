import { Ollama } from 'ollama'

let ollama = null

const OllamaService = {
    // Initialize the Ollama service
    init(options) {
        try {
            ollama = new Ollama(options)
            console.log('Ollama service initialized successfully');
        } catch (error) {
            console.error('Error initializing Ollama service:', error);
            throw new Error('Failed to initialize Ollama service');
        }
    },
    async getModels() {
        try {
            const models = await ollama.list();
            return models
        } catch (error) {
            console.error('Error fetching models:', error)
            throw new Error('Failed to fetch models')
        }
    },
    async getModelInfo(modelName) {
        try {
            const modelInfo = await ollama.modelInfo(modelName)
            return modelInfo
        } catch (error) {
            console.error('Error fetching model info:', error)
            throw new Error('Failed to fetch model info')
        }
    },
    async abort() {
        try {
            await ollama.abort();
            console.log('Ollama service aborted successfully');
        } catch (error) {
            console.error('Error aborting Ollama service:', error);
            throw new Error('Failed to abort Ollama service');
        }
    },
    async *chat(modelName, message) {
        try {
            const response = await ollama.chat({ model: modelName, messages: [message], stream: true });
            for await (const part of response) {
                yield part.message.content;
            }
            return response.response_metadata; 
        } catch (error) {
            console.error('Error during chat:', error);
            throw new Error('Failed to chat with model');
        }
    },
}

export default OllamaService;
