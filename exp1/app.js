// App state
let selectedPersona = 'elara';
let selectedState = null;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updatePersonaDisplay();

    // Persona selector
    document.getElementById('personaSelect').addEventListener('change', (e) => {
        selectedPersona = e.target.value;
        updatePersonaDisplay();
        resetResults();
    });

    // State buttons
    document.querySelectorAll('.state-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.state-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedState = btn.dataset.state;
            document.getElementById('matchBtn').disabled = false;
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
    document.getElementById('resultsSection').style.display = 'none';
}

async function findMatch() {
    if (!selectedState) return;

    const persona = personas[selectedPersona];
    const allInspirations = [...inspirations.quotes, ...inspirations.songs];

    // Simulate LLM reasoning (in production, this would be an API call)
    const match = await simulateLLMMatching(persona, selectedState, allInspirations);

    displayResults(match, allInspirations);
}

async function simulateLLMMatching(persona, state, allInspirations) {
    // This simulates what an LLM would do
    // In production, you'd send this to OpenAI/Claude API

    // Step 1: Filter by state
    const stateMatches = allInspirations.filter(i =>
        i.targetStates.includes(state)
    );

    // Step 2: Score by trait alignment
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
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';

    // Display selected inspiration
    const selectedDiv = document.getElementById('selectedInspiration');
    if (match.selected.type === 'quote') {
        selectedDiv.innerHTML = `"${match.selected.text}"<br><small>— ${match.selected.author}</small>`;
    } else {
        selectedDiv.innerHTML = `🎵 ${match.selected.text}`;
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

    // Display all inspirations with highlighting
    const gridDiv = document.getElementById('inspirationGrid');
    gridDiv.innerHTML = '';

    allInspirations.forEach(inspiration => {
        const div = document.createElement('div');
        div.className = 'inspiration-item';

        // Highlight if it matches state
        if (inspiration.targetStates.includes(selectedState)) {
            div.classList.add('highlighted');
        }

        // Mark as selected if it's the chosen one
        if (inspiration.id === match.selected.id) {
            div.classList.add('selected');
            div.innerHTML += '<span class="match-score">SELECTED</span>';
        }

        // Add content
        const text = inspiration.type === 'quote'
            ? `"${inspiration.text}" — ${inspiration.author}`
            : `🎵 ${inspiration.title} by ${inspiration.artist}`;

        div.innerHTML += `
            <div class="inspiration-text">${text}</div>
            <div class="inspiration-meta">
                <span>States: ${inspiration.targetStates.join(', ')}</span>
                <span>Type: ${inspiration.type}</span>
            </div>
        `;

        gridDiv.appendChild(div);
    });

    // Smooth scroll to results
    document.getElementById('resultsSection').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}