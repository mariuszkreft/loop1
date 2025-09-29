// App state
let selectedPersona = 'elara';
let selectedState = null;

// Configuration - ADD YOUR API KEY HERE
const OPENROUTER_API_KEY = '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'; 
const API_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Try different models if one fails
//const MODEL = 'moonshotai/kimi-k2-0905'; // May not be available
const MODEL = 'openai/gpt-4o-mini'; // Cheaper, usually available
//const MODEL = 'google/gemini-flash-1.5'; // Fast and cheap
// const MODEL = 'anthropic/claude-3-haiku'; // Good alternative

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting initialization...');
    console.log('Inspirations loaded:', inspirations.quotes.length, 'quotes,', inspirations.songs.length, 'songs');

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

    // Add evidence-based interventions (but won't show in library display)
    const interventions = getEvidenceBasedInterventions();
    const allContent = [...allInspirations, ...interventions];

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
            ? await realLLMStreamingMatch(persona, selectedState, allContent)
            : await simulateLLMStreamingMatch(persona, selectedState, allContent);

        displayResults(match, allInspirations); // Only show quotes/songs in library display
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

    // Prepare the actual API call (including interventions)
    const inspirationsList = allInspirations.map((insp, idx) => {
        let text;
        if (insp.type === 'quote') {
            text = `"${insp.text}" - ${insp.author}`;
        } else if (insp.type === 'song') {
            text = `Song: "${insp.title}" by ${insp.artist}`;
        } else if (insp.type === 'intervention') {
            text = `${insp.intervention} (${insp.source}): ${insp.text} [${insp.timeRequirement}, ${insp.energyRequirement} energy]`;
        }
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
        console.error('Response status:', response.status);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));

        // More detailed error handling
        let errorMsg = 'Unknown error';
        if (errorData.error?.message) {
            errorMsg = errorData.error.message;
        } else if (errorData.message) {
            errorMsg = errorData.message;
        }

        // Show detailed debugging info
        await typewriterEffect(`\n\n❌ API Error (${response.status}): ${errorMsg}\n`);
        await typewriterEffect(`🔍 Debug info:\n`);
        await typewriterEffect(`   → Model: ${MODEL}\n`);
        await typewriterEffect(`   → API Key: ${OPENROUTER_API_KEY.substring(0, 12)}...\n`);
        await typewriterEffect(`   → Status: ${response.status}\n`);

        // Try with fallback to different model first
        if (errorMsg.includes('User not found')) {
            await typewriterEffect('💡 Trying with fallback model: openai/gpt-3.5-turbo\n');

            // Try once more with a different model
            const fallbackResponse = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Give.T Demo'
                },
                body: JSON.stringify({
                    model: 'openai/gpt-3.5-turbo', // More reliable fallback
                    messages: [
                        { role: 'system', content: 'You are a personalization engine. Return only valid JSON.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 500
                })
            });

            if (fallbackResponse.ok) {
                await typewriterEffect('✅ Fallback model worked!\n\n');
                const fallbackData = await fallbackResponse.json();
                const llmResponse = JSON.parse(fallbackData.choices[0].message.content);

                // Continue with normal processing
                await typewriterEffect('━━━ MATCH FOUND ━━━\n');
                await typewriterEffect('🎯 Selected: ');
                await typewriterEffect(llmResponse.selected_id, true);
                // ... rest of normal response processing

                const selected = allInspirations.find(i => i.id === llmResponse.selected_id);
                if (selected) {
                    await typewriterEffect('\n📝 Content:\n');
                    if (selected.type === 'quote') {
                        await typewriterEffect('   "' + selected.text + '"\n');
                        await typewriterEffect('   — ' + selected.author + '\n');
                    } else if (selected.type === 'song') {
                        await typewriterEffect('   🎵 ' + selected.title + ' by ' + selected.artist + '\n');
                    } else if (selected.type === 'intervention') {
                        await typewriterEffect('   🧠 ' + selected.intervention + ' (' + selected.source + ')\n');
                        await typewriterEffect('   "' + selected.text.substring(0, 80) + '..."\n');
                    }
                }

                await typewriterEffect('\n💡 Impact: ');
                await typewriterEffect(llmResponse.expected_impact, true);
                await typewriterEffect('\n\n✨ Match complete!\n');

                selected.score = 100;
                return {
                    selected,
                    reasoning: llmResponse.reasoning,
                    allScored: allInspirations.map(i => ({
                        ...i,
                        score: i.id === selected.id ? 100 : (i.targetStates.includes(state) ? 50 : 0)
                    }))
                };
            } else {
                await typewriterEffect('❌ Fallback also failed - switching to simulation\n');
            }
        }

        if (errorMsg.includes('credit') || errorMsg.includes('balance')) {
            await typewriterEffect('💡 This looks like a credit/billing issue\n');
        } else if (errorMsg.includes('model')) {
            await typewriterEffect('💡 Model unavailable\n');
        }

        await typewriterEffect('🔄 Falling back to simulation mode...\n\n');
        return await simulateLLMStreamingMatch(persona, state, allInspirations);
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
        } else if (selected.type === 'song') {
            await typewriterEffect('   🎵 ' + selected.title + ' by ' + selected.artist + '\n');
        } else if (selected.type === 'intervention') {
            await typewriterEffect('   🧠 ' + selected.intervention + ' (' + selected.source + ')\n');
            await typewriterEffect('   "' + selected.text.substring(0, 80) + '..."\n');
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
    } else if (selected.type === 'song') {
        await typewriterEffect('   🎵 ' + selected.title + ' by ' + selected.artist + '\n\n');
    } else if (selected.type === 'intervention') {
        await typewriterEffect('   🧠 ' + selected.intervention + ' (' + selected.source + ')\n');
        await typewriterEffect('   "' + selected.text.substring(0, 80) + '..."\n\n');
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
            `Personal Fit: ${inspiration.reasons && inspiration.reasons.length > 0 ? inspiration.reasons[0] : 'Aligns with personal traits'}`,
            `Expected Impact: Will provide ${inspiration.effect} effect`,
            `Delivery Format: ${inspiration.type === 'quote' ? 'Quick read perfect for fragmented time' : inspiration.type === 'song' ? 'Audio experience for multi-sensory engagement' : 'Evidence-based intervention'}`
        ]
    };

    if (inspiration.reasons && inspiration.reasons.length > 1) {
        reasoning.points.push(`Additional Benefits: ${inspiration.reasons.slice(1).join(', ')}`);
    }

    return reasoning;
}

// Function to extract YouTube video ID from URL
function getYouTubeVideoId(url) {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

// Function to create YouTube embed HTML
function createYouTubeEmbed(videoId, title = '') {
    if (!videoId) return '';
    return `
        <div style="margin-top: 10px;">
            <iframe
                width="320"
                height="180"
                src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1"
                title="${title}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
                style="border-radius: 8px;">
            </iframe>
        </div>
    `;
}

function displayResults(match, allInspirations) {
    // Display selected inspiration - ALWAYS show all three types that match the state
    const selectedDiv = document.getElementById('selectedInspiration');

    // Get all interventions for comprehensive matching
    const allContent = [...allInspirations, ...getEvidenceBasedInterventions()];

    // Find the best match of each type for the current state
    const bestQuote = findBestMatchingQuote(selectedState, allContent);
    const bestSong = findBestMatchingSong(selectedState, allContent);
    const bestIntervention = findBestMatchingIntervention(selectedState, allContent);

    let content = '';

    // Always show quote if available
    if (bestQuote) {
        const isSelected = match.selected.id === bestQuote.id;
        content += `
            <div style="margin-bottom: 20px; padding: 15px; background: ${isSelected ? '#e3f2fd' : '#f8f9fa'}; border-left: 4px solid #667eea; border-radius: 5px; ${isSelected ? 'box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);' : ''}">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <strong style="color: #667eea;">📖 Inspirational Quote</strong>
                    ${isSelected ? '<span style="margin-left: auto; background: #667eea; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em;">AI SELECTED</span>' : ''}
                </div>
                <em>"${bestQuote.text}"</em><br>
                <small>— ${bestQuote.author}</small>
            </div>
        `;
    }

    // Always show song if available with YouTube embed
    if (bestSong) {
        const isSelected = match.selected.id === bestSong.id;
        const videoId = getYouTubeVideoId(bestSong.youtube);

        content += `
            <div style="margin-bottom: 20px; padding: 15px; background: ${isSelected ? '#fff3e0' : '#fff8e1'}; border-left: 4px solid #ff9800; border-radius: 5px; ${isSelected ? 'box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);' : ''}">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <strong style="color: #ef6c00;">🎵 Music Inspiration</strong>
                    ${isSelected ? '<span style="margin-left: auto; background: #ff9800; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em;">AI SELECTED</span>' : ''}
                </div>
                <div style="margin-bottom: 10px;">${bestSong.text}</div>
                ${videoId ? createYouTubeEmbed(videoId, `${bestSong.title} by ${bestSong.artist}`) : ''}
            </div>
        `;
    }

    // Always show intervention if available
    if (bestIntervention) {
        const isSelected = match.selected.id === bestIntervention.id;
        content += `
            <div style="padding: 20px; background: ${isSelected ? '#e8f8e8' : 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)'}; border: 2px solid #4caf50; border-radius: 10px; ${isSelected ? 'box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);' : ''}">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <span style="font-size: 1.5em; margin-right: 10px;">🧠</span>
                    <strong style="color: #2e7d32; font-size: 1.1em;">${bestIntervention.intervention}</strong>
                    <span style="margin-left: auto; background: #4caf50; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8em;">${bestIntervention.source}</span>
                    ${isSelected ? '<span style="margin-left: 8px; background: #2e7d32; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em;">AI SELECTED</span>' : ''}
                </div>
                <div style="color: #555; line-height: 1.6; margin-bottom: 15px;">
                    ${bestIntervention.text}
                </div>
                <div style="display: flex; gap: 15px; font-size: 0.9em; color: #666;">
                    <span>⏱️ ${bestIntervention.timeRequirement}</span>
                    <span>⚡ ${bestIntervention.energyRequirement} energy</span>
                    <span>📊 ${bestIntervention.evidenceBase}</span>
                </div>
            </div>
        `;
    }

    if (content === '') {
        content = '<em>No matching inspirations found for this state.</em>';
    }

    selectedDiv.innerHTML = content;

    document.getElementById('inspirationType').textContent =
        'PERSONALIZED INSPIRATION SUITE • AI Score: ' + match.selected.score;

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
    const libraryCount = document.getElementById('libraryCount');

    // Update the library count
    if (libraryCount) {
        libraryCount.textContent = `(${allInspirations.length} items)`;
    }

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

// Library toggle functionality
function toggleLibrary() {
    const grid = document.getElementById('inspirationGrid');
    const toggle = document.getElementById('libraryToggle');

    if (grid.style.display === 'none') {
        grid.style.display = 'grid';
        toggle.textContent = '▼';
        toggle.classList.add('expanded');
    } else {
        grid.style.display = 'none';
        toggle.textContent = '▶';
        toggle.classList.remove('expanded');
    }
}

// Evidence-based interventions data
function getEvidenceBasedInterventions() {
    return [
        {
            id: 'i1',
            intervention: "3-Minute Breathing Space",
            source: "MBSR",
            type: "intervention",
            text: "Take a 3-minute breathing space: Notice what's here right now, focus on your breath, then expand awareness to your whole body",
            targetStates: ["overwhelmed", "anxious", "stressed"],
            traits: ["mindfulness", "balance", "self-care", "audio", "kinesthetic"],
            effect: "reduce stress, recenter attention",
            timeRequirement: "3 min",
            energyRequirement: "very_low",
            evidenceBase: "RCTs on MBSR (Kabat-Zinn, 1990+)"
        },
        {
            id: 'i2',
            intervention: "Cognitive Reframe",
            source: "CBT",
            type: "intervention",
            text: "Ask yourself: What's another way to look at this situation? What would you tell a friend facing this?",
            targetStates: ["overwhelmed", "anxious", "disempowered"],
            traits: ["achievement", "balance", "reflection"],
            effect: "shift perspective, increase cognitive flexibility",
            timeRequirement: "5 min",
            energyRequirement: "low",
            evidenceBase: "High (CBT RCTs)"
        },
        {
            id: 'i3',
            intervention: "Leaves on a Stream",
            source: "ACT",
            type: "intervention",
            text: "Imagine your thoughts as leaves floating down a stream. Notice them, let them pass by without getting caught up in them",
            targetStates: ["anxious", "overwhelmed", "sad"],
            traits: ["calm", "balance", "audio", "visualization"],
            effect: "reduce entanglement with thoughts, increase mindfulness",
            timeRequirement: "5-10 min",
            energyRequirement: "low",
            evidenceBase: "ACT evidence base"
        },
        {
            id: 'i4',
            intervention: "Best Possible Self",
            source: "Positive Psychology",
            type: "intervention",
            text: "Write about your life going as well as it possibly could. Be specific about your relationships, career, and personal growth",
            targetStates: ["disempowered", "sad", "inspired"],
            traits: ["growth", "hope", "creativity", "writing", "visualization"],
            effect: "boost optimism, increase future orientation",
            timeRequirement: "15-20 min",
            energyRequirement: "high",
            evidenceBase: "Multiple RCTs"
        },
        {
            id: 'i5',
            intervention: "Scaling Questions",
            source: "Motivational Interviewing",
            type: "intervention",
            text: "On a scale of 1-10, how confident are you that you can handle this? What would move you up just one number?",
            targetStates: ["disempowered", "overwhelmed"],
            traits: ["growth", "agency", "reflection"],
            effect: "enhance self-efficacy, increase readiness to act",
            timeRequirement: "2-5 min",
            energyRequirement: "very_low",
            evidenceBase: "Strong MI evidence"
        },
        {
            id: 'i6',
            intervention: "Gratitude Letter",
            source: "Positive Psychology",
            type: "intervention",
            text: "Write a letter to someone who has helped you but you've never properly thanked. Be specific about what they did and how it affected you",
            targetStates: ["sad", "lonely", "happy"],
            traits: ["connection", "kindness", "writing"],
            effect: "increase positive affect, deepen social connection",
            timeRequirement: "15 min",
            energyRequirement: "medium",
            evidenceBase: "Robust RCT evidence"
        }
    ];
}

function findComplementaryQuote(selectedItem, allInspirations) {
    // Find a quote that matches the same emotional state as the selected item
    const quotes = allInspirations.filter(i => i.type === 'quote');

    // Look for quotes that share the same target states
    const matchingQuotes = quotes.filter(quote =>
        quote.targetStates.some(state => selectedItem.targetStates.includes(state))
    );

    if (matchingQuotes.length > 0) {
        // Return the first matching quote, or could add more sophisticated selection logic
        return matchingQuotes[0];
    }

    // Fallback to any quote if no perfect match
    return quotes.length > 0 ? quotes[0] : null;
}

function findComplementarySong(selectedItem, allInspirations) {
    // Find a song that matches the same emotional state as the selected item
    const songs = allInspirations.filter(i => i.type === 'song');

    // Look for songs that share the same target states
    const matchingSongs = songs.filter(song =>
        song.targetStates.some(state => selectedItem.targetStates.includes(state))
    );

    if (matchingSongs.length > 0) {
        // Return the first matching song
        return matchingSongs[0];
    }

    // Fallback to any song if no perfect match
    return songs.length > 0 ? songs[0] : null;
}

// Helper functions to find best match of each type for a given state
function findBestMatchingQuote(state, allContent) {
    const quotes = allContent.filter(i => i.type === 'quote');
    const matching = quotes.filter(q => q.targetStates.includes(state));
    return matching.length > 0 ? matching[0] : quotes[0] || null;
}

function findBestMatchingSong(state, allContent) {
    const songs = allContent.filter(i => i.type === 'song');
    const matching = songs.filter(s => s.targetStates.includes(state));
    return matching.length > 0 ? matching[0] : songs[0] || null;
}

function findBestMatchingIntervention(state, allContent) {
    const interventions = allContent.filter(i => i.type === 'intervention');
    const matching = interventions.filter(i => i.targetStates.includes(state));
    return matching.length > 0 ? matching[0] : interventions[0] || null;
}