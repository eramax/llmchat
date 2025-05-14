// markdownStreamProcessor.js
import { marked } from 'marked';

const DEFAULT_MARKED_OPTIONS = {
    mangle: false,
    headerIds: false,
    gfm: true,
    breaks: false,
    pedantic: false
};

export class MarkdownStreamProcessor {
    // Internal state
    #finalizedHtmlContent = '';
    #activeMarkdownBuffer = '';
    #streamEnded = false;
    #isLoading = true;

    // Callbacks to notify the consumer (e.g., Svelte component)
    #onUpdateCallbacks;

    // Marked options
    #markedOptions;

    constructor(callbacks, markedOptions = {}) {
        console.log("MarkdownStreamProcessor")
        if (!callbacks || typeof callbacks.onStateUpdate !== 'function') {
            throw new Error(
                'MarkdownStreamProcessor requires a `onStateUpdate` callback in the constructor.'
            );
        }
        this.#onUpdateCallbacks = callbacks;
        this.#markedOptions = { ...DEFAULT_MARKED_OPTIONS, ...markedOptions };
        this.#notifyStateChange(); // Initial state notification
        console.log("MarkdownStreamProcessor Initial")
    }

    // --- Private methods ---

    #notifyStateChange() {
        this.#onUpdateCallbacks.onStateUpdate({
            finalizedHtmlContent: this.#finalizedHtmlContent,
            activeHtml: this.#deriveActiveHtml(), // activeHtml should be empty if not streaming
            isLoading: this.#isLoading,
            streamEnded: this.#streamEnded
        });
    }

    #deriveActiveHtml() {
        // If stream has ended or we are not loading, and there's no active buffer, activeHTML should be empty.
        // This prevents a flash of parsed empty string if activeMarkdownBuffer is cleared.
        if ((this.#streamEnded || !this.#isLoading) && !this.#activeMarkdownBuffer) return '';
        return marked.parse(this.#activeMarkdownBuffer, this.#markedOptions);
    }

    #setFinalizedHtmlContent(html) {
        if (this.#finalizedHtmlContent !== html) {
            this.#finalizedHtmlContent = html;
        }
    }

    #setActiveMarkdownBuffer(markdown) {
        if (this.#activeMarkdownBuffer !== markdown) {
            this.#activeMarkdownBuffer = markdown;
        }
    }

    #setIsLoading(loading) {
        if (this.#isLoading !== loading) {
            this.#isLoading = loading;
        }
    }

    #setStreamEnded(ended) {
        if (this.#streamEnded !== ended) {
            this.#streamEnded = ended;
        }
    }

    // --- Public methods ---

    processNewChunk(chunk) {
        this.#setIsLoading(true); // Ensure loading is true while processing chunks
        this.#setActiveMarkdownBuffer(this.#activeMarkdownBuffer + chunk);
        this.#setStreamEnded(false); // Reset if new data comes after a previous end

        const tokens = marked.lexer(this.#activeMarkdownBuffer);
        let markdownToFinalizeAggregator = '';
        let charsProcessedFromBuffer = 0;

        if (tokens.length === 0) {
            this.#notifyStateChange();
            return;
        }

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const isLastToken = i === tokens.length - 1;

            if (isLastToken && !this.#streamEnded) {
                break;
            }

            if (token.raw) {
                markdownToFinalizeAggregator += token.raw;
                charsProcessedFromBuffer += token.raw.length;
            } else if (token.type === 'space' && markdownToFinalizeAggregator.length > 0) {
                if (!isLastToken || (tokens[i + 1] && tokens[i + 1].type !== 'space')) {
                    markdownToFinalizeAggregator += token.raw;
                    charsProcessedFromBuffer += token.raw.length;
                }
            } else if (markdownToFinalizeAggregator.length > 0) {
                break;
            }
        }

        if (markdownToFinalizeAggregator) {
            const htmlFromFinalized = marked.parse(markdownToFinalizeAggregator, this.#markedOptions);
            this.#setFinalizedHtmlContent(this.#finalizedHtmlContent + htmlFromFinalized);
            this.#setActiveMarkdownBuffer(this.#activeMarkdownBuffer.substring(charsProcessedFromBuffer));
        }
        // Don't set isLoading to false here, only in endStreamProcessing or processFullMarkdown
        this.#notifyStateChange();
    }

    endStreamProcessing() {
        this.#setStreamEnded(true);
        if (this.#activeMarkdownBuffer.trim()) {
            const finalActiveHtml = marked.parse(this.#activeMarkdownBuffer, this.#markedOptions);
            this.#setFinalizedHtmlContent(this.#finalizedHtmlContent + finalActiveHtml);
            this.#setActiveMarkdownBuffer('');
        }
        this.#setIsLoading(false);
        this.#notifyStateChange();
    }

    reset() {
        this.#setFinalizedHtmlContent('');
        this.#setActiveMarkdownBuffer('');
        this.#setStreamEnded(false);
        this.#setIsLoading(true);
        this.#notifyStateChange();
    }

    async processStream(asyncGenerator) {
        console.log(asyncGenerator)
        this.reset(); // This sets isLoading to true

        try {
            for await (const chunk of asyncGenerator) {
                if (typeof chunk !== 'string') {
                    console.warn('MarkdownStreamProcessor received non-string chunk:', chunk);
                    continue;
                }
                this.processNewChunk(chunk);
            }
            this.endStreamProcessing(); // This sets isLoading to false
        } catch (e) {
            console.error('Error processing stream:', e);
            const errorMarkdown = `\n\n**Error during stream: ${e.message}**`;
            this.#setActiveMarkdownBuffer(this.#activeMarkdownBuffer + errorMarkdown);
            this.endStreamProcessing(); // Finalize with error, also sets isLoading to false
        }
    }

    /**
     * Processes a complete Markdown string at once.
     * This is for non-streamed content.
     * @param {string} markdownString - The full Markdown content.
     */
    processFullMarkdown(markdownString) {
        const html = marked.parse(markdownString, this.#markedOptions);
        return html
    }
}