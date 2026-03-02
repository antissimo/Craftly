# Semester Project <!-- omit in toc -->

- [Project Structure](#project-structure)
- [My Project Links](#my-project-links)
  - [Semester Project](#semester-project)
  - [Semester Assignments](#semester-assignments)
- [Project Requirements](#project-requirements)
  - [Web Application Requirements](#web-application-requirements)
  - [Project Demonstration](#project-demonstration)

## Project Structure

- **`/`**: The source code of your main project
- **`/assignments`**: Results of your semester assignments
- **`/docs`**: If using GitHub for documentation (e.g., your final report in Markdown format)

## My Project Links

### Semester Project

- Link to your production version: [ Production](https://craftly-omega.vercel.app/explore) <!-- Replace with actual URL -->
- Link to your final report: [**Final Report**](URL_TO_FINAL_REPORT) <!-- Replace with actual URL -->
<!-- Add more as necessary -->

### Semester Assignments

- Link to Assignment 1: [Idea pitch](assignments/1%20-%20Idea%20pitch/)
- Link to Assignment 2: [User personas](assignments/2%20-%20User%20personas/)
- Link to Assignment 3: [Next.js deploy](https://craftly-omega.vercel.app/)
- Link to Assignment 4: [Low High fidelity prototype](assignments/4%20-%20Low%20High%20fidelity%20prototype/)
- Link to Assignment 5: [Dynamic routes, data fetching](https://craftly-omega.vercel.app/explore)
<!-- Add more assignments as necessary -->

## Project Requirements

### Web Application Requirements

- [ ] The application will be used from a web browser
- [ ] It will be accessible on devices of different sizes
- [ ] Users can search/filter products or services
- [ ] The application will support user login for showing private content
- [ ] One of the public pages will be a blog containing multiple posts with diverse content (images, videos, code snippets)
- [ ] Part of the application's content will be stored in a remote headless CMS system

### Project Demonstration

- [ ] Show the production version of the project or produce a video demonstrating the above requirements
- [ ] The production version will be deployed online (on an appropriate cloud platform [Vercel](https://vercel.com), [Netlify](https://www.netlify.com/) or personal VPS)
- [ ] Conduct usablity evaluation of your web application
- [ ] Analyze the application's performance ([PageSpeed Insights](https://pagespeed.web.dev/))
- [ ] The analysis results will be part of the final report

## Heuristic Evaluation (Nielsen)

This project was evaluated using Nielsen's usability heuristics.

1. Visibility of system status
Finding: Search actions did not always provide explicit progress feedback.
Severity: Medium
Action: Added clear `Searching...` feedback on Explore search.

2. User control and freedom
Finding: Active filters/search did not offer a fast reset.
Severity: Medium
Action: Added `Clear` search action and a no-results shortcut to reset query.

3. Help users recognize, diagnose, and recover from errors
Finding: Error states lacked direct recovery actions.
Severity: Medium
Action: Added `Try again` and `Go to first page` actions on Explore API errors.

4. Error prevention
Finding: Portfolio editing relied too much on backend validation.
Severity: Medium
Action: Added inline form validation and blocked save until invalid fields are corrected.

5. Match between system and the real world / consistency
Finding: Terminology and UI patterns were mostly consistent with minor gaps.
Severity: Low
Action: Standardized wording and state cues in search and form flows.
