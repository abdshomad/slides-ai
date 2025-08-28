# 4.4. Step 3: Slide Generation & Editing

*   **F-SE-01:** The AI generates a complete set of slides based on the approved outline, selected tone, and template.
    *   Each slide contains a title and a list of bullet points.
*   **F-SE-01a (Generation Progress View):** During initial slide generation, a detailed progress screen is displayed. It shows the current stage (e.g., Researching, Creating Slides), sub-steps, key statistics (e.g., sources analyzed, slides created), and an estimated time to completion.
*   **F-SE-01b (Post-Generation Image Review):** After slide generation completes, if any images were sourced from web searches, the user is presented with a gallery of these images. This "Visuals Sourced by AI" screen provides a preview of the visual assets before the user proceeds to the main editor.
*   **F-SE-02 (UI Layout):** The slide editor displays a list of slide thumbnails in a sidebar for easy navigation and a large detail view for the currently selected slide.
*   **F-SE-02a (Grouped Slide Actions):** All individual slide actions (e.g., Edit, Style, Generate Notes) are consolidated into a single "AI Tools & Actions" dropdown menu to reduce UI clutter and streamline the user experience.
*   **F-SE-03 (AI-Powered Text Editing):** From the slide's action menu, users can select "Edit Content" to open a modal and issue a natural language prompt to modify a slide's content (e.g., "Simplify the second bullet point", "change the image to a picture of a sunset"). The AI can also populate content for specialized layouts, for instance, by responding to prompts like "Add a subtitle: 'Q3 Financial Results'" or "Change this slide to be a quote from Albert Einstein". A visual change request will trigger a new image search (see F-SE-07) or, if the user asks for a video, will populate the prompt for the video generator (see F-SE-17).
*   **F-SE-04 (Speaker Notes):** From the slide's action menu, users can ask the AI to generate speaker notes for any slide. The menu item will show a loading state while the AI is processing.
*   **F-SE-05 (Key Takeaway):** From the slide's action menu, users can ask the AI to generate a single, concise key takeaway for any slide. The menu item will show a loading state while the AI is processing.
*   **F-SE-06 (Slide Expansion):** From the slide's action menu, users can ask the AI to expand a single slide into 2-3 new, more detailed slides. The menu item will show a loading state while the AI is processing.
*   **F-SE-07 (Intelligent Image Sourcing & Generation):**
    *   **F-SE-07a (Initial Sourcing):** During the initial slide creation, the AI will either find relevant, royalty-free images from a web search (`imageSearchResults`) or create a descriptive prompt for an AI image generator (`imagePrompt`).
    *   **F-SE-07b (On-Demand AI Suggestions):** In the editor, for any slide requiring a visual, the user can click "Find Images with AI". This triggers the AI to generate a set of unique image suggestions based on the slide's title and content.
    *   **F-SE-07c (Interactive Selection):** Both web search results and AI-generated suggestions are presented as a gallery of interactive thumbnails. The user can select an image to apply it to the slide with a single click.
    *   **F-SE-07d (Custom Prompts):** Users retain full control and can opt to write their own custom prompt for the image generator via the slide's main editing modal.
    *   **F-SE-07e (Regeneration & Change):** If a slide already has an image, users can easily change it, returning to the suggestion view to select a different option or generate new ones.
*   **F-SE-08 (Slide Layout/Style):** From the slide's action menu, users can select "Change Style" to open a modal and change the layout of a slide. Available layouts include standard formats (e.g., Image Left, Image Right, Title Only) as well as specialized, visually distinct layouts such as 'Section Header' (title and subtitle), 'Main Point Emphasis' (highlights a key statistic or phrase), and 'Quote' (showcases a quote with attribution).
*   **F-SE-09 (Fact-Checking):**
    *   From the slide's action menu, users can trigger an AI-powered fact-check for any individual slide. The menu item will show a loading state during this process.
    *   The AI uses Google Search to verify the information on the slide for accuracy and timeliness.
    *   The results are presented in a modal view, showing a side-by-side comparison of the original content and the AI's suggested, fact-checked version.
    *   The modal includes a summary explaining the changes made by the AI.
    *   Users have the option to accept and apply the suggested changes or discard them.
*   **F-SE-10 (Slide Reordering):** Users can change the order of slides by dragging and dropping the slide thumbnails in the navigation sidebar. The new order is saved automatically.
*   **F-SE-11 (AI-Powered Chart Generation):** Users can request data visualizations through natural language prompts (e.g., "create a bar chart of our quarterly sales"). The AI generates the necessary structured data (chart type, data points, labels, colors), which the application then renders as a visual chart on the slide, replacing the standard bullet points.
*   **F-SE-12 (AI Design Suggestions):** From the slide's action menu, users can select "Suggest Ideas" to request creative ideas for a slide's design.
    *   The action captures the current visual state of the slide as an image.
    *   This image, along with the slide's text content, is sent to a multimodal AI for analysis.
    *   The AI provides a critique and a list of actionable visual improvement ideas, which are displayed to the user in a modal.
*   **F-SE-13 (AI Image In-Painting - "Magic Edit"):**
    *   Within the Visuals Studio, users can select an "Edit" tab for slides that already have a generated image.
    *   Users can provide a natural language prompt to modify the existing image (e.g., "add a sun to the sky," "make the car red," "remove the person on the left").
    *   The multimodal AI processes the image and the prompt to generate an edited version of the image.
*   **F-SE-14 (Stock Photo Integration):**
    *   The Visuals Studio includes a "Search" tab, providing access to a library of high-quality, royalty-free stock photos.
    *   Users can enter search queries to find relevant images for their slide content.
    *   Users can select an image from the search results to apply it directly to their slide.
*   **F-SE-15 (Advanced Image Controls):** The Visuals Studio provides granular control over AI image generation. Users can provide "negative prompts" to exclude unwanted elements and select from a range of artistic styles to guide the visual output.
*   **F-SE-16 (Presentation-Wide Style Cohesion):** Users can apply a single artistic style across all AI-generated images in the presentation via an "Apply Style to All" function, ensuring a consistent and professional aesthetic.
*   **F-SE-17 (AI Video Generation):**
    *   **F-SE-17a:** Within the "Visuals Studio", users can access a dedicated "Video" tab.
    *   **F-SE-17b:** Users can provide a natural language prompt describing a scene or concept.
    *   **F-SE-17c:** The AI will generate a short, silent video clip based on the prompt. The UI will provide clear, reassuring progress updates during the generation process, which may take several minutes.
    *   **F-SE-17d:** The generated video clip can be included in the slide, replacing the standard image area.