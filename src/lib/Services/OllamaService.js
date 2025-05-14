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
    //  function for a simulated stream
    async *simulatedMarkdownChunks() {
        const chunks = [
            '# Welcome to Markdown Streaming!\n\nThis is the first paragraph. ',
            'It might arrive in multiple chunks.\n\n',
            "```javascript\n// A code block is starting\nconsole.log('Hello');\n",
            'function greet(name) {\n  return `Hello, ${name}!`;\n}\n',
            '```\n\n*   List item 1\n*   List item 2\n    *   Nested item A\n',
            '*   List item 3\n\nAnother paragraph, appearing piece by piece.',
            ' And this is the *final* piece of the stream.'
        ]

        for await (const chunk of chunks) {
            await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network latency
            yield chunk
        }
    }
}

export default OllamaService;
