export const loadChat = async (chatId) => {
    let md1 = await fetch('/md1.md').then(res => res.text())
    let md2 = await fetch('/md2.md').then(res => res.text())

    let chat = {
        id: 'chat-1',
        title: 'Chat Title',
        createdAt: '2023-10-01T12:00:00Z',
        updatedAt: '2023-10-01T12:00:00Z',
        createdBy: 'user-1',
        direction: 'ltr',
        messages: [
            {
                role: 'user',
                active_id: 0,
                instances: [
                    {
                        message_id: 'uuid-1',
                        createdAt: '2023-10-01T12:00:00Z',
                        createdBy: 'Ahmed',
                        parent_message_id: null,
                        body: [{ content: md2 }]
                    },
                    {
                        message_id: 'uuid-1a',
                        createdAt: '2023-10-01T12:05:00Z',
                        createdBy: 'Ahmed',
                        parent_message_id: null,
                        body: [{ content: 'How are you?' }]
                    }
                ]
            },
            {
                role: 'assistant',
                active_id: 0,
                instances: [
                    // Branch 1: Responses to "Hi" (uuid-1)
                    {
                        message_id: 'uuid-2',
                        createdAt: '2023-10-01T12:01:00Z',
                        createdBy: 'llama3-7B',
                        parent_message_id: 'uuid-1', // Parent is "Hi"
                        metadata: { token_count: 10, tokenpersecond: 5 },
                        body: [{ task: 'think', content: 'Thinking...', duration: 5 }, { content: 'Hello! How can I assist you today? 😊' }]
                    },
                    {
                        message_id: 'uuid-3',
                        createdAt: '2023-10-01T12:02:00Z',
                        createdBy: 'llama3-8B',
                        parent_message_id: 'uuid-1', // Parent is "Hi"
                        metadata: { token_count: 15, tokenpersecond: 7 },
                        body: [{ task: 'think', content: 'Analyzing greeting...', duration: 3 }, { content: md1 }]
                    },
                    // Branch 2: Responses to "How are you?" (uuid-1a)
                    {
                        message_id: 'uuid-4',
                        createdAt: '2023-10-01T12:06:00Z',
                        createdBy: 'llama3-7B',
                        parent_message_id: 'uuid-1a', // Parent is "How are you?"
                        metadata: { token_count: 12, tokenpersecond: 5 },
                        body: [{ task: 'think', content: 'Processing question...', duration: 2, isLoading: true }, { content: "I'm an AI, so I don't have feelings, but I'm functioning well! How are you?" }]
                    }
                ]
            },
            {
                role: 'user',
                active_id: 0,
                instances: [
                    // Branch 1A: Follow-up to first response to "Hi"
                    {
                        message_id: 'uuid-5',
                        createdAt: '2023-10-01T12:03:00Z',
                        createdBy: 'Ahmed',
                        parent_message_id: 'uuid-2', // Parent is first response to "Hi"
                        body: [{ content: 'I need help with coding.' }]
                    },
                    // Branch 1B: Follow-up to second response to "Hi"
                    {
                        message_id: 'uuid-6',
                        createdAt: '2023-10-01T12:04:00Z',
                        createdBy: 'Ahmed',
                        parent_message_id: 'uuid-3', // Parent is second response to "Hi"
                        body: [{ content: 'Can you explain machine learning?' }]
                    },
                    // Branch 2A: Follow-up to response to "How are you?"
                    {
                        message_id: 'uuid-7',
                        createdAt: '2023-10-01T12:07:00Z',
                        createdBy: 'Ahmed',
                        parent_message_id: 'uuid-4', // Parent is response to "How are you?"
                        body: [{ content: "I'm good! Tell me about yourself." }]
                    }
                ]
            },
            {
                role: 'assistant',
                active_id: 0,
                instances: [
                    // Branch 1A: Response to "I need help with coding"
                    {
                        message_id: 'uuid-8',
                        createdAt: '2023-10-01T12:03:30Z',
                        createdBy: 'llama3-7B',
                        parent_message_id: 'uuid-5', // Parent is "I need help with coding"
                        metadata: { token_count: 25, tokenpersecond: 8 },
                        body: [{ task: 'think', content: 'Analyzing coding request...', duration: 4 }, { content: 'I can certainly help with coding! What programming language or problem are you working with?' }]
                    },
                    // Branch 1B: Response to "Can you explain machine learning?"
                    {
                        message_id: 'uuid-9',
                        createdAt: '2023-10-01T12:04:30Z',
                        createdBy: 'llama3-8B',
                        parent_message_id: 'uuid-6', // Parent is "Can you explain machine learning?"
                        metadata: { token_count: 45, tokenpersecond: 9 },
                        body: [{ task: 'think', content: 'Formulating ML explanation...', duration: 5 }, { content: 'Machine learning is a subset of AI where systems learn from data and improve without explicit programming. The main types are supervised, unsupervised, and reinforcement learning.' }]
                    },
                    // Branch 2A: Response to "I'm good! Tell me about yourself."
                    {
                        message_id: 'uuid-10',
                        createdAt: '2023-10-01T12:08:00Z',
                        createdBy: 'llama3-7B',
                        parent_message_id: 'uuid-7', // Parent is "I'm good! Tell me about yourself."
                        metadata: { token_count: 30, tokenpersecond: 6 },
                        body: [{ task: 'think', content: 'Preparing self-description...', duration: 3 }, { content: "I'm an AI assistant built on the Llama 3 architecture. I was trained on a diverse dataset to help users with a wide range of tasks including answering questions, creative writing, and problem-solving." }]
                    }
                ]
            }
        ]
    }
    return chat;
}