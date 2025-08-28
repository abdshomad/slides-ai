export interface LoadingStep {
    title: string;
    subSteps: string[];
}

export const slideGenerationSteps: LoadingStep[] = [
    {
        title: "Analyze requirements",
        subSteps: [
            "Parsing uploaded documents...",
            "Identifying key themes and topics...",
            "Defining presentation objectives...",
            "Structuring content flow...",
        ],
    },
    {
        title: "Research and information gathering",
        subSteps: [
            "Querying knowledge bases for modern technologies...",
            "Analyzing current market approaches...",
            "Synthesizing relevant data points...",
            "Identifying supporting evidence and sources...",
        ],
    },
    {
        title: "Collect visual assets",
        subSteps: [
            "Generating conceptual illustrations...",
            "Designing data-driven diagrams and charts...",
            "Sourcing high-quality stock imagery...",
            "Ensuring visual consistency across assets...",
        ],
    },
    {
        title: "Create comprehensive solution slides",
        subSteps: [
            "Drafting compelling slide titles and narratives...",
            "Writing concise and impactful bullet points...",
            "Integrating visual assets seamlessly...",
            "Formatting content for maximum clarity and impact...",
            "Finalizing presentation for delivery...",
        ],
    },
];
