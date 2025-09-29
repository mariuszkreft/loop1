# Give.T Persona-to-Inspiration Matcher Demo

## Overview
This is a simple proof-of-concept demonstrating the core matching logic of the Give.T personalization engine. It shows how different personas receive different inspirations based on their current state and personal traits.

## How It Works

### 1. Two-Stage Filtering Process
- **Stage 1 (State Filter):** Filters all inspirations by the user's current emotional state
- **Stage 2 (Trait Modulation):** Scores remaining inspirations based on persona traits and selects the best match

### 2. Visual Feedback
- **Yellow highlight:** Inspirations that match the current state
- **Purple highlight:** The selected best match
- **Reasoning panel:** Explains why this specific inspiration was chosen

## Files Structure
- `index.html` - Main UI interface
- `styles.css` - Visual styling
- `personas.js` - Three hardcoded persona profiles (Elara, Sarah, Maria)
- `inspirations.js` - Library of quotes and songs with metadata
- `app.js` - Matching logic and UI interactions

## Running the Demo
1. Open `index.html` in a web browser
2. Select a persona from the dropdown
3. Click on a current state button
4. Click "Find Perfect Inspiration" to see the matching process

## Key Features Demonstrated
- Persona-based personalization
- State-aware content selection
- Transparent reasoning for selections
- Visual distinction between all matches and the best match

## Future Enhancements
To make this production-ready:
1. Replace simulated matching with actual LLM API calls
2. Add more personas dynamically from Step 1 onboarding
3. Expand inspiration library from Step 4
4. Implement feedback loop to refine matching
5. Add session tracking and learning loop

## Customization
- Add personas: Edit `personas.js`
- Add inspirations: Edit `inspirations.js`
- Modify matching logic: Update `simulateLLMMatching()` in `app.js`
- Change styling: Edit `styles.css`

## Notes
This is a static demo with hardcoded data. The LLM reasoning is simulated locally using rule-based scoring. In production, this would connect to OpenAI/Claude API for more sophisticated matching.