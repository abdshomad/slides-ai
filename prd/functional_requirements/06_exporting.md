# 4.6. Exporting

*   **F-EX-01:** Users can download the final presentation as a standard `.pptx` file.
*   **F-EX-02:** The exported file is formatted according to the selected design template, including master slides, colors, layouts, and automatic slide numbers.
*   **F-EX-03 (Single Slide Export):** Users can export the currently selected slide as a high-resolution PNG image file.
    *   **UI & Location:** An "Export Slide" button, featuring an icon and text, is located in the action toolbar at the bottom of the slide detail view.
    *   **Functional Behavior:** Clicking the button initiates a capture of the main slide content area. The captured area includes the slide's visual (image/placeholder), title, bullet points, and the slide number overlay, while excluding other UI elements like the action toolbar at the bottom. The application converts the captured content into a PNG and triggers a browser download.
    *   **Loading State:** During the capture and conversion process, the "Export Slide" button becomes disabled. Its text changes to "Exporting..." and displays a loading spinner. The button returns to its normal state once the download begins or if an error occurs.
    *   **File Naming Convention:** The downloaded file will be named using the format: `slide_[slide_number]_[sanitized_slide_title].png`. For example, slide #3, "Quarterly Results", becomes `slide_3_quarterly_results.png`.
*   **F-EX-04 (Branded Exports):** When exporting to `.pptx`, the user's configured Brand Kit (logo, colors, fonts) is automatically applied to the selected template, ensuring a consistent brand identity across the presentation.