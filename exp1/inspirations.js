// Load inspirations from JSON file
let inspirations = { quotes: [], songs: [] };

// Fetch data from JSON file - returns a promise
async function loadInspirations() {
    try {
        console.log('Fetching extended_inspirations.json...');
        const response = await fetch('./extended_inspirations.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw data received:', data);

        if (!data.inspirations) {
            throw new Error('No inspirations field in JSON data');
        }

        inspirations = data.inspirations;
        console.log('Loaded inspirations:', inspirations.quotes.length + ' quotes, ' + inspirations.songs.length + ' songs');

        // Verify data is actually loaded
        if (inspirations.quotes.length === 0 && inspirations.songs.length === 0) {
            console.warn('Warning: No inspirations loaded from file!');
        }

        return inspirations;
    } catch (error) {
        console.error('Error loading inspirations:', error);
        console.error('Error details:', error.message);
        // Fallback to empty structure
        inspirations = { quotes: [], songs: [] };
        return inspirations;
    }
}