// App state
let selectedPersona = 'elara';
let selectedState = null;

// Configuration - ADD YOUR API KEY HERE
const OPENROUTER_API_KEY = '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'; // Replace with your OpenRouter API key
const API_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Try different models if one fails
const MODEL = 'moonshotai/kimi-k2-0905'; // May not be available
//const MODEL = 'openai/gpt-3.5-turbo'; // Cheaper, usually available
//const MODEL = 'google/gemini-flash-1.5'; // Fast and cheap
// const MODEL = 'anthropic/claude-3-haiku'; // Good alternative

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
    thinkingContent.textContent = '';

    try {
        // Use real LLM if API key is set, otherwise fall back to simulation
        const match = OPENROUTER_API_KEY !== 'YOUR_OPENROUTER_API_KEY_HERE'
            ? await realLLMStreamingMatch(persona, selectedState, allInspirations)
            : await simulateLLMStreamingMatch(persona, selectedState, allInspirations);

        displayResults(match, allInspirations);
    } catch (error) {
        console.error('Error in matching:', error);
        document.getElementById('reasoningContent').innerHTML = `<em>Error: ${error.message}</em>`;
        streamThinking(`\n❌ Error occurred: ${error.message}`);
    } finally {
        document.getElementById('matchBtn').disabled = false;
        document.getElementById('matchBtn').textContent = 'Find Perfect Inspiration';
    }
}

async function streamThinking(message, delayMs = 15) {
    const thinkingContent = document.getElementById('thinkingContent');
    const chars = message.split('');

    // Batch characters for smoother performance
    const batchSize = 2; // Write 2 chars at a time for speed

    for (let i = 0; i < chars.length; i += batchSize) {
        const batch = chars.slice(i, i + batchSize).join('');
        thinkingContent.textContent += batch;
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }
}

async function typewriterEffect(message, instant = false) {
    if (instant) {
        document.getElementById('thinkingContent').textContent += message;
        return;
    }
    // Much faster: 10ms delay, 2 chars at a time
    await streamThinking(message, 10);
}

async function realLLMStreamingMatch(persona, state, allInspirations) {
    // Simulate streaming with typewriter effect
    await typewriterEffect('🚀 Initializing Give.T Personalization Engine...\n\n');
    await new Promise(r => setTimeout(r, 100)); // Reduced from 300ms

    await typewriterEffect('📊 Loading persona profile: ');
    await typewriterEffect(persona.name, true);
    await typewriterEffect('\n');

    await typewriterEffect('   ├─ Role: ');
    await typewriterEffect(persona.role, true);
    await typewriterEffect('\n');

    await typewriterEffect('   ├─ Current state: ');
    await typewriterEffect(state.toUpperCase(), true);
    await typewriterEffect('\n');

    await typewriterEffect('   └─ Core need: ');
    await typewriterEffect(persona.coreNeed, true);
    await typewriterEffect('\n\n');

    await new Promise(r => setTimeout(r, 200)); // Reduced from 500ms

    // Stage 1
    await typewriterEffect('━━━ STAGE 1: STATE FILTERING ━━━\n');
    const stateMatches = allInspirations.filter(i => i.targetStates.includes(state));
    await typewriterEffect('🔍 Scanning inspiration library...\n');
    await new Promise(r => setTimeout(r, 100)); // Reduced from 300ms
    await typewriterEffect(`   → Total inspirations: ${allInspirations.length}\n`);
    await typewriterEffect(`   → Matching state "${state}": ${stateMatches.length}\n`);
    await typewriterEffect(`   → Filtered out: ${allInspirations.length - stateMatches.length}\n\n`);

    await new Promise(r => setTimeout(r, 150)); // Reduced from 500ms

    // Stage 2
    await typewriterEffect('━━━ STAGE 2: TRAIT MODULATION ━━━\n');
    await typewriterEffect('🧠 Analyzing persona traits...\n');
    await typewriterEffect(`   • Learning style: ${persona.traits.learningStyle}\n`);
    await typewriterEffect(`   • Values: ${persona.traits.coreValues.slice(0, 2).join(', ')}\n`);
    await typewriterEffect(`   • Challenges: ${persona.traits.challenges[0]}\n\n`);

    await new Promise(r => setTimeout(r, 150)); // Reduced from 500ms

    // API Call
    await typewriterEffect('🤖 Consulting AI model: ');
    await typewriterEffect(MODEL, true);
    await typewriterEffect('\n');
    await typewriterEffect('   ');

    // Simulate thinking dots - much faster
    for (let i = 0; i < 5; i++) {
        await typewriterEffect('●', true);
        await new Promise(r => setTimeout(r, 150)); // Reduced from 400ms to 150ms
    }
    await typewriterEffect(' ✓\n\n', true);

    // Prepare the actual API call
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

Return a JSON object with this EXACT structure:
{
  "selected_id": "the_id_of_selected_inspiration",
  "reasoning": {
    "primary": "One sentence summary",
    "points": ["Point 1", "Point 2", "Point 3"]
  },
  "expected_impact": "Brief impact description"
}

Return ONLY the JSON object.`;

    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Give.T Demo'
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: 'system', content: 'You are a personalization engine. Return only valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 500,
            stream: false // OpenRouter supports streaming but we're simulating it visually
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Full error response:', errorData);

        // More detailed error handling
        let errorMsg = 'Unknown error';
        if (errorData.error?.message) {
            errorMsg = errorData.error.message;
        } else if (errorData.message) {
            errorMsg = errorData.message;
        }

        // Show helpful error messages
        await typewriterEffect(`\n\n❌ API Error: ${errorMsg}\n`);

        if (errorMsg.includes('credit') || errorMsg.includes('balance')) {
            await typewriterEffect('💡 Tip: Check your OpenRouter credit balance\n');
        } else if (errorMsg.includes('model')) {
            await typewriterEffect('💡 Tip: Try a different model (edit MODEL in app-with-streaming.js)\n');
        }

        throw new Error(`API error: ${errorMsg}`);
    }

    const data = await response.json();
    const llmResponse = JSON.parse(data.choices[0].message.content);

    // Show results with streaming
    await typewriterEffect('━━━ MATCH FOUND ━━━\n');
    await typewriterEffect('🎯 Selected: ');
    await typewriterEffect(llmResponse.selected_id, true);
    await typewriterEffect('\n');

    const selected = allInspirations.find(i => i.id === llmResponse.selected_id);

    // Display the actual content
    if (selected) {
        await typewriterEffect('\n📝 Content:\n');
        if (selected.type === 'quote') {
            await typewriterEffect('   "' + selected.text + '"\n');
            await typewriterEffect('   — ' + selected.author + '\n');
        } else {
            await typewriterEffect('   🎵 ' + selected.title + ' by ' + selected.artist + '\n');
        }
    }

    await typewriterEffect('\n💡 Impact: ');
    await typewriterEffect(llmResponse.expected_impact, true);
    await typewriterEffect('\n\n');

    await typewriterEffect('✨ Match complete!\n');
    selected.score = 100;

    return {
        selected,
        reasoning: llmResponse.reasoning,
        allScored: allInspirations.map(i => ({
            ...i,
            score: i.id === selected.id ? 100 : (i.targetStates.includes(state) ? 50 : 0)
        }))
    };
}

async function simulateLLMStreamingMatch(persona, state, allInspirations) {
    // Simulated version with streaming effect - FAST VERSION
    await typewriterEffect('🚀 Initializing Simulation Mode...\n\n');

    await typewriterEffect('📊 Analyzing: ' + persona.name + '\n');
    await typewriterEffect('   Current state: ' + state + '\n\n');

    await typewriterEffect('🔍 Stage 1: Filtering by state...\n');
    const stateMatches = allInspirations.filter(i => i.targetStates.includes(state));
    await new Promise(r => setTimeout(r, 150)); // Much faster
    await typewriterEffect(`   Found ${stateMatches.length} matches\n\n`);

    await typewriterEffect('🧠 Stage 2: Scoring by traits...\n');
    await new Promise(r => setTimeout(r, 150)); // Much faster

    // Score logic (same as before)
    const scored = stateMatches.map(inspiration => {
        let score = 0;
        let reasons = [];

        if (persona.traits.learningStyle.toLowerCase().includes('visual') &&
            inspiration.traits.includes('visual')) {
            score += 2;
            reasons.push("Matches visual learning preference");
        }

        persona.traits.coreValues.forEach(value => {
            if (inspiration.traits.some(trait => trait.includes(value))) {
                score += 1;
                reasons.push(`Aligns with ${value} value`);
            }
        });

        persona.traits.challenges.forEach(challenge => {
            if (inspiration.effect && inspiration.effect.includes(challenge.split(' ')[0])) {
                score += 2;
                reasons.push(`Addresses ${challenge} challenge`);
            }
        });

        if (inspiration.type === 'song' &&
            persona.traits.preferredActivities.some(a => a.includes('creative'))) {
            score += 1;
            reasons.push("Music aligns with creative outlets preference");
        }

        if (persona.traits.timeAvailability.includes('fragmented') &&
            inspiration.traits.includes('simple')) {
            score += 1;
            reasons.push("Simple enough for fragmented time");
        }

        return { ...inspiration, score, reasons };
    });

    scored.sort((a, b) => b.score - a.score);
    const selected = scored[0];

    await typewriterEffect(`   Best match: ${selected.id}\n`);
    await typewriterEffect(`   Score: ${selected.score} points\n`);

    // Display the actual content
    await typewriterEffect('\n📝 Selected Content:\n');
    if (selected.type === 'quote') {
        await typewriterEffect('   "' + selected.text + '"\n');
        await typewriterEffect('   — ' + selected.author + '\n\n');
    } else {
        await typewriterEffect('   🎵 ' + selected.title + ' by ' + selected.artist + '\n\n');
    }

    await typewriterEffect('✨ Selection complete!\n');

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

// Rest of the helper functions remain the same...
function displayAllInspirations() {
    const allInspirations = [...inspirations.quotes, ...inspirations.songs];
    const gridDiv = document.getElementById('inspirationGrid');
    document.getElementById('resultsSection').style.display = 'block';
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

        if (selectedState && inspiration.targetStates.includes(selectedState)) {
            div.classList.add('highlighted');
        }

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