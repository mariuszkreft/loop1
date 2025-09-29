// App state
let selectedPersona = 'elara';
let selectedState = null;

// Configuration - ADD YOUR API KEY HERE
const OPENROUTER_API_KEY = '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'; // Replace with your OpenRouter API key
const API_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
// const MODEL = 'moonshotai/kimi-k2-0905'; // May not be available
const MODEL = 'google/gemini-flash-1.5'; // Fast, cheap, and reliable
// const MODEL = 'openai/gpt-3.5-turbo'; // Another good option
// const MODEL = 'anthropic/claude-3-haiku'; // Fast Claude option

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updatePersonaDisplay();
    displayAllInspirations(); // Show all inspirations on load

    // Persona selector
    document.getElementById('personaSelect').addEventListener('change', (e) => {
        selectedPersona = e.target.value;
        updatePersonaDisplay();
        resetResults();
        displayAllInspirations(); // Refresh display
    });

    // State buttons
    document.querySelectorAll('.state-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.state-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedState = btn.dataset.state;
            document.getElementById('matchBtn').disabled = false;
            // Update highlighting when state changes
            updateStateHighlighting();
        });
    });

    // Match button
    document.getElementById('matchBtn').addEventListener('click', findMatch);
});

function updatePersonaDisplay() {
    const persona = personas[selectedPersona];
    const summary = `
        <strong>${persona.name}</strong> - ${persona.role}<br>
        <em>${persona.summary}</em><br><br>
        <strong>Core Need:</strong> ${persona.coreNeed}<br>
        <strong>Key Traits:</strong> ${persona.traits.learningStyle}, ${persona.traits.motivation}<br>
        <strong>Challenges:</strong> ${persona.traits.challenges.join(', ')}
    `;
    document.getElementById('personaSummary').innerHTML = summary;
}

function resetResults() {
    // Don't hide the section anymore, just clear selections
    const items = document.querySelectorAll('.inspiration-item');
    items.forEach(item => {
        item.classList.remove('selected');
        const matchScore = item.querySelector('.match-score');
        if (matchScore) matchScore.remove();
    });

    // Clear the selected inspiration display
    document.getElementById('selectedInspiration').innerHTML = '';
    document.getElementById('inspirationType').textContent = '';
    document.getElementById('reasoningContent').innerHTML = '<em>Select a state and click "Find Perfect Inspiration" to see matching logic</em>';
}

async function findMatch() {
    if (!selectedState) return;

    const persona = personas[selectedPersona];
    const allInspirations = [...inspirations.quotes, ...inspirations.songs];

    // Show loading state and thinking section
    document.getElementById('matchBtn').disabled = true;
    document.getElementById('matchBtn').textContent = 'Finding Perfect Match...';
    document.getElementById('reasoningContent').innerHTML = '<em>AI is analyzing...</em>';

    // Show thinking section
    const thinkingSection = document.getElementById('thinkingSection');
    const thinkingContent = document.getElementById('thinkingContent');
    thinkingSection.style.display = 'block';
    thinkingContent.textContent = 'Initializing AI reasoning engine...';

    try {
        // Use real LLM if API key is set, otherwise fall back to simulation
        const match = OPENROUTER_API_KEY !== 'YOUR_OPENROUTER_API_KEY_HERE'
            ? await realLLMMatching(persona, selectedState, allInspirations, updateThinking)
            : await simulateLLMMatching(persona, selectedState, allInspirations, updateThinking);

        displayResults(match, allInspirations);
    } catch (error) {
        console.error('Error in matching:', error);
        document.getElementById('reasoningContent').innerHTML = `<em>Error: ${error.message}</em>`;
        updateThinking(`\n❌ Error occurred: ${error.message}`);
    } finally {
        document.getElementById('matchBtn').disabled = false;
        document.getElementById('matchBtn').textContent = 'Find Perfect Inspiration';
    }
}

function updateThinking(message) {
    const thinkingContent = document.getElementById('thinkingContent');
    if (message.startsWith('\n')) {
        thinkingContent.textContent += message;
    } else {
        thinkingContent.textContent = message;
    }
}

async function realLLMMatching(persona, state, allInspirations, updateThinking) {
    updateThinking('📊 Analyzing persona profile...');
    updateThinking('\n→ Name: ' + persona.name);
    updateThinking('\n→ Core need: ' + persona.coreNeed);
    updateThinking('\n→ Current state: ' + state);

    updateThinking('\n\n🔍 Stage 1: Filtering inspirations by state "' + state + '"...');

    // Prepare inspirations for LLM
    const inspirationsList = allInspirations.map((insp, idx) => {
        const text = insp.type === 'quote'
            ? `"${insp.text}" - ${insp.author}`
            : `Song: "${insp.title}" by ${insp.artist}`;
        return `${idx + 1}. [${insp.id}] ${text} (States: ${insp.targetStates.join(', ')}, Traits: ${insp.traits.join(', ')})`;
    }).join('\n');

    const prompt = `You are an AI personalization engine. Select the SINGLE best inspiration for this persona based on their current state and traits.

PERSONA PROFILE:
Name: ${persona.name}
Role: ${persona.role}
Core Need: ${persona.coreNeed}
Key Traits:
- Decision Making: ${persona.traits.decisionMaking}
- Learning Style: ${persona.traits.learningStyle}
- Core Values: ${persona.traits.coreValues.join(', ')}
- Motivation: ${persona.traits.motivation}
- Energy Patterns: ${persona.traits.energyPatterns}
- Preferred Activities: ${persona.traits.preferredActivities.join(', ')}
- Time Availability: ${persona.traits.timeAvailability}
- Current Challenges: ${persona.traits.challenges.join(', ')}

CURRENT STATE: ${state}

AVAILABLE INSPIRATIONS:
${inspirationsList}

INSTRUCTIONS:
1. Apply two-stage filtering:
   - Stage 1: Consider ONLY inspirations that match the current state "${state}"
   - Stage 2: From those, select the ONE that best aligns with the persona's traits

2. Consider:
   - Learning style compatibility
   - Value alignment
   - Time constraints
   - Current challenges
   - Energy levels
   - Activity preferences

3. Return a JSON object with this EXACT structure:
{
  "selected_id": "the_id_of_selected_inspiration",
  "selected_index": number_from_list,
  "reasoning": {
    "primary": "One sentence summary of why this was selected",
    "points": [
      "Specific reason 1",
      "Specific reason 2",
      "Specific reason 3",
      "How it addresses their core need"
    ]
  },
  "expected_impact": "Brief description of expected positive impact"
}

Return ONLY the JSON object, no additional text.`;

    updateThinking('\n→ Found ' + allInspirations.filter(i => i.targetStates.includes(state)).length + ' matching inspirations');

    updateThinking('\n\n🤖 Stage 2: Applying trait-based modulation...');
    updateThinking('\n→ Learning style: ' + persona.traits.learningStyle);
    updateThinking('\n→ Core values: ' + persona.traits.coreValues.join(', '));
    updateThinking('\n→ Current challenges: ' + persona.traits.challenges.join(', '));

    updateThinking('\n\n💭 Sending to AI model: ' + MODEL);

    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin, // Optional but recommended for OpenRouter
            'X-Title': 'Give.T Demo' // Optional: helps OpenRouter identify your app
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are a personalization engine that matches personas with inspirational content. Always return valid JSON.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 500
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        updateThinking('\n\n❌ API Error: ' + (errorData.error?.message || 'Unknown error'));
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    updateThinking('\n✅ Response received from AI');

    const data = await response.json();
    const llmResponse = JSON.parse(data.choices[0].message.content);

    updateThinking('\n\n🎯 AI Selection: ' + llmResponse.selected_id);

    // Find the selected inspiration
    const selected = allInspirations.find(i => i.id === llmResponse.selected_id);

    if (selected) {
        updateThinking('\n\n📝 Selected Content:');
        if (selected.type === 'quote') {
            updateThinking('\n   "' + selected.text + '"');
            updateThinking('\n   — ' + selected.author);
        } else {
            updateThinking('\n   🎵 ' + selected.title + ' by ' + selected.artist);
        }
    } else {
        updateThinking('\n\n⚠️ Warning: Selected ID not found, using fallback');
    }

    updateThinking('\n\n💡 Expected impact: ' + llmResponse.expected_impact);

    // Add score for display
    selected.score = 100; // LLM selected = perfect score

    return {
        selected,
        reasoning: llmResponse.reasoning,
        allScored: allInspirations.map(i => ({
            ...i,
            score: i.id === selected.id ? 100 : (i.targetStates.includes(state) ? 50 : 0)
        }))
    };
}

async function simulateLLMMatching(persona, state, allInspirations, updateThinking) {
    updateThinking('📊 Analyzing persona profile (Simulation Mode)...');
    updateThinking('\n→ Name: ' + persona.name);
    updateThinking('\n→ Current state: ' + state);

    // Step 1: Filter by state
    updateThinking('\n\n🔍 Stage 1: Filtering inspirations by state...');
    const stateMatches = allInspirations.filter(i =>
        i.targetStates.includes(state)
    );
    updateThinking('\n→ Found ' + stateMatches.length + ' matching inspirations');

    // Step 2: Score by trait alignment
    updateThinking('\n\n🤖 Stage 2: Scoring by trait alignment...');
    const scored = stateMatches.map(inspiration => {
        let score = 0;
        let reasons = [];

        // Check learning style match
        if (persona.traits.learningStyle.toLowerCase().includes('visual') &&
            inspiration.traits.includes('visual')) {
            score += 2;
            reasons.push("Matches visual learning preference");
        }

        // Check value alignment
        persona.traits.coreValues.forEach(value => {
            if (inspiration.traits.some(trait => trait.includes(value))) {
                score += 1;
                reasons.push(`Aligns with ${value} value`);
            }
        });

        // Check for current challenges
        persona.traits.challenges.forEach(challenge => {
            if (inspiration.effect && inspiration.effect.includes(challenge.split(' ')[0])) {
                score += 2;
                reasons.push(`Addresses ${challenge} challenge`);
            }
        });

        // Check activity preferences
        if (inspiration.type === 'song' &&
            persona.traits.preferredActivities.some(a => a.includes('creative'))) {
            score += 1;
            reasons.push("Music aligns with creative outlets preference");
        }

        // Time availability consideration
        if (persona.traits.timeAvailability.includes('fragmented') &&
            inspiration.traits.includes('simple')) {
            score += 1;
            reasons.push("Simple enough for fragmented time");
        }

        return {
            ...inspiration,
            score,
            reasons
        };
    });

    // Sort by score and pick the best
    scored.sort((a, b) => b.score - a.score);
    const selected = scored[0];

    updateThinking('\n\n🎯 Best match found: ' + selected.id);
    updateThinking('\n→ Score: ' + selected.score + ' points');

    // Display the actual content
    updateThinking('\n\n📝 Selected Content:');
    if (selected.type === 'quote') {
        updateThinking('\n   "' + selected.text + '"');
        updateThinking('\n   — ' + selected.author);
    } else {
        updateThinking('\n   🎵 ' + selected.title + ' by ' + selected.artist);
    }

    if (selected.reasons && selected.reasons.length > 0) {
        updateThinking('\n\n→ Key reason: ' + selected.reasons[0]);
    }

    // Generate reasoning
    const reasoning = generateReasoning(persona, state, selected);

    return {
        selected,
        reasoning,
        allScored: scored
    };
}

function generateReasoning(persona, state, inspiration) {
    const reasoning = {
        primary: `Selected for ${persona.name} who is feeling ${state}`,
        points: [
            `State Match: This inspiration specifically targets the "${state}" emotional state`,
            `Personal Fit: ${inspiration.reasons ? inspiration.reasons[0] : 'Aligns with personal traits'}`,
            `Expected Impact: Will provide ${inspiration.effect} effect`,
            `Delivery Format: ${inspiration.type === 'quote' ? 'Quick read perfect for fragmented time' : 'Audio experience for multi-sensory engagement'}`
        ]
    };

    if (inspiration.reasons && inspiration.reasons.length > 1) {
        reasoning.points.push(`Additional Benefits: ${inspiration.reasons.slice(1).join(', ')}`);
    }

    return reasoning;
}

function displayResults(match, allInspirations) {
    // Display selected inspiration - show both quote and song if song is selected
    const selectedDiv = document.getElementById('selectedInspiration');

    if (match.selected.type === 'quote') {
        selectedDiv.innerHTML = `"${match.selected.text}"<br><small>— ${match.selected.author}</small>`;
    } else {
        // For songs, show a complementary quote first, then the song
        const complementaryQuote = findComplementaryQuote(match.selected, allInspirations);

        if (complementaryQuote) {
            selectedDiv.innerHTML = `
                <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid #667eea; border-radius: 5px;">
                    <em>"${complementaryQuote.text}"</em><br>
                    <small>— ${complementaryQuote.author}</small>
                </div>
                <div>
                    🎵 ${match.selected.text}
                </div>
            `;
        } else {
            selectedDiv.innerHTML = `🎵 ${match.selected.text}`;
        }
    }

    document.getElementById('inspirationType').textContent =
        match.selected.type.toUpperCase() + ' • Match Score: ' + match.selected.score;

    // Display reasoning
    const reasoningDiv = document.getElementById('reasoningContent');
    reasoningDiv.innerHTML = `
        <p><strong>${match.reasoning.primary}</strong></p>
        <ul>
            ${match.reasoning.points.map(p => `<li>${p}</li>`).join('')}
        </ul>
    `;

    // Update highlighting to show selection
    updateInspirationDisplay(allInspirations, match.selected.id);

    // Smooth scroll to results
    document.querySelector('.selected-inspiration').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Rest of the functions remain the same...
function displayAllInspirations() {
    const allInspirations = [...inspirations.quotes, ...inspirations.songs];
    const gridDiv = document.getElementById('inspirationGrid');

    // Show the results section but with empty selection
    document.getElementById('resultsSection').style.display = 'block';

    // Clear previous content
    gridDiv.innerHTML = '';

    allInspirations.forEach(inspiration => {
        const div = createInspirationElement(inspiration);
        gridDiv.appendChild(div);
    });
}

function updateStateHighlighting() {
    const items = document.querySelectorAll('.inspiration-item');
    items.forEach((item, index) => {
        const allInspirations = [...inspirations.quotes, ...inspirations.songs];
        const inspiration = allInspirations[index];

        if (selectedState && inspiration.targetStates.includes(selectedState)) {
            item.classList.add('highlighted');
        } else {
            item.classList.remove('highlighted');
        }
    });
}

function updateInspirationDisplay(allInspirations, selectedId) {
    const gridDiv = document.getElementById('inspirationGrid');
    gridDiv.innerHTML = '';

    allInspirations.forEach(inspiration => {
        const div = createInspirationElement(inspiration);

        // Highlight if it matches state
        if (selectedState && inspiration.targetStates.includes(selectedState)) {
            div.classList.add('highlighted');
        }

        // Mark as selected if it's the chosen one
        if (inspiration.id === selectedId) {
            div.classList.add('selected');
            const matchBadge = document.createElement('span');
            matchBadge.className = 'match-score';
            matchBadge.textContent = 'SELECTED';
            div.appendChild(matchBadge);
        }

        gridDiv.appendChild(div);
    });
}

function createInspirationElement(inspiration) {
    const div = document.createElement('div');
    div.className = 'inspiration-item';

    // Add content
    const text = inspiration.type === 'quote'
        ? `"${inspiration.text}" — ${inspiration.author}`
        : `🎵 ${inspiration.title} by ${inspiration.artist}`;

    div.innerHTML = `
        <div class="inspiration-text">${text}</div>
        <div class="inspiration-meta">
            <span>States: ${inspiration.targetStates.join(', ')}</span>
            <span>Type: ${inspiration.type}</span>
        </div>
    `;

    return div;
}

function findComplementaryQuote(selectedSong, allInspirations) {
    // Find a quote that matches the same emotional state as the selected song
    const quotes = allInspirations.filter(i => i.type === 'quote');

    // Look for quotes that share the same target states
    const matchingQuotes = quotes.filter(quote =>
        quote.targetStates.some(state => selectedSong.targetStates.includes(state))
    );

    if (matchingQuotes.length > 0) {
        // Return the first matching quote, or could add more sophisticated selection logic
        return matchingQuotes[0];
    }

    // Fallback to any quote if no perfect match
    return quotes.length > 0 ? quotes[0] : null;
}