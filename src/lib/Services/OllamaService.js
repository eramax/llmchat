import ollama from 'ollama';

const OllamaService = {
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
    }
}

export default OllamaService;
