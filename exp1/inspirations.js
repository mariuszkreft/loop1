const inspirations = {
    quotes: [
        // Overwhelmed/Busy
        {
            id: 'q1',
            text: "Simplicity is the ultimate sophistication.",
            author: "Leonardo da Vinci",
            type: "quote",
            targetStates: ["overwhelmed", "busy"],
            traits: ["visual", "creative", "minimalist"],
            effect: "calming, clarifying"
        },
        {
            id: 'q2',
            text: "The master has failed more times than the beginner has even tried.",
            author: "Stephen McCranie",
            type: "quote",
            targetStates: ["overwhelmed", "disempowered"],
            traits: ["growth-oriented", "resilient"],
            effect: "perspective, encouragement"
        },
        {
            id: 'q3',
            text: "Action is the foundational key to all success.",
            author: "Pablo Picasso",
            type: "quote",
            targetStates: ["overwhelmed", "stuck"],
            traits: ["action-oriented", "achievement"],
            effect: "motivating, directional"
        },

        // Anxious/Worried
        {
            id: 'q4',
            text: "You must learn to let go. Release the stress. You were never in control anyway.",
            author: "Steve Maraboli",
            type: "quote",
            targetStates: ["anxious", "stressed"],
            traits: ["acceptance", "spiritual"],
            effect: "releasing, surrendering"
        },
        {
            id: 'q5',
            text: "Worrying is like a rocking chair, it gives you something to do but never gets you anywhere.",
            author: "Erma Bombeck",
            type: "quote",
            targetStates: ["anxious", "worried"],
            traits: ["humor", "practical"],
            effect: "perspective, lightening"
        },
        {
            id: 'q6',
            text: "If you want to conquer the anxiety of life, live in the moment, live in the breath.",
            author: "Amit Ray",
            type: "quote",
            targetStates: ["anxious", "stressed"],
            traits: ["mindfulness", "breath-work"],
            effect: "grounding, centering"
        },

        // Sad/Heartbroken
        {
            id: 'q7',
            text: "The wound is the place where the Light enters you.",
            author: "Rumi",
            type: "quote",
            targetStates: ["sad", "heartbroken"],
            traits: ["spiritual", "poetic", "depth"],
            effect: "transformative, hopeful"
        },
        {
            id: 'q8',
            text: "What a wonderful thought it is that some of the best days of our lives haven't happened yet.",
            author: "Anne Frank",
            type: "quote",
            targetStates: ["sad", "hopeless"],
            traits: ["optimistic", "future-focused"],
            effect: "uplifting, perspective"
        },

        // Lonely
        {
            id: 'q9',
            text: "Knowing how to be solitary is central to the art of loving. When we can be alone, we can be with others without using them as a means of escape.",
            author: "Bell Hooks",
            type: "quote",
            targetStates: ["lonely", "isolated"],
            traits: ["introspective", "growth", "relationship-focused"],
            effect: "empowering, reframing"
        },
        {
            id: 'q10',
            text: "I restore myself when I'm alone.",
            author: "Marilyn Monroe",
            type: "quote",
            targetStates: ["lonely", "depleted"],
            traits: ["self-care", "introverted"],
            effect: "validating, restorative"
        },

        // Happy/Inspired
        {
            id: 'q11',
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs",
            type: "quote",
            targetStates: ["happy", "inspired"],
            traits: ["achievement", "passion", "career-focused"],
            effect: "amplifying, directional"
        },
        {
            id: 'q12',
            text: "Happiness is not something ready made. It comes from your own actions.",
            author: "Dalai Lama",
            type: "quote",
            targetStates: ["happy", "empowered"],
            traits: ["action-oriented", "wisdom", "spiritual"],
            effect: "empowering, sustaining"
        },
        {
            id: 'q13',
            text: "The future belongs to those who believe in the beauty of their dreams.",
            author: "Eleanor Roosevelt",
            type: "quote",
            targetStates: ["inspired", "hopeful"],
            traits: ["visionary", "creative", "ambitious"],
            effect: "expansive, encouraging"
        },

        // Disempowered
        {
            id: 'q14',
            text: "The best revenge is massive success.",
            author: "Frank Sinatra",
            type: "quote",
            targetStates: ["disempowered", "angry"],
            traits: ["competitive", "achievement"],
            effect: "channeling, motivating"
        },
        {
            id: 'q15',
            text: "Believe you can and you're halfway there.",
            author: "Theodore Roosevelt",
            type: "quote",
            targetStates: ["disempowered", "doubtful"],
            traits: ["self-efficacy", "action"],
            effect: "confidence-building"
        },
        {
            id: 'q16',
            text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.",
            author: "Thomas Edison",
            type: "quote",
            targetStates: ["disempowered", "defeated"],
            traits: ["perseverance", "resilient"],
            effect: "encouraging, persistent"
        }
    ],

    songs: [
        {
            id: 's1',
            text: "Listen to 'Breathe Me' by Sia - A song about vulnerability and asking for help",
            title: "Breathe Me",
            artist: "Sia",
            type: "song",
            targetStates: ["overwhelmed", "anxious", "sad"],
            traits: ["emotional", "vulnerable", "introspective"],
            effect: "cathartic, connecting"
        },
        {
            id: 's2',
            text: "Play 'Three Little Birds' by Bob Marley - Everything's gonna be alright",
            title: "Three Little Birds",
            artist: "Bob Marley",
            type: "song",
            targetStates: ["anxious", "worried", "stressed"],
            traits: ["optimistic", "simple", "comforting"],
            effect: "soothing, reassuring"
        },
        {
            id: 's3',
            text: "Listen to 'Unwritten' by Natasha Bedingfield - Today is where your book begins",
            title: "Unwritten",
            artist: "Natasha Bedingfield",
            type: "song",
            targetStates: ["stuck", "uninspired", "disempowered"],
            traits: ["empowering", "future-focused", "energetic"],
            effect: "motivating, liberating"
        },
        {
            id: 's4',
            text: "Play 'Brave' by Sara Bareilles - Say what you wanna say and let the words fall out",
            title: "Brave",
            artist: "Sara Bareilles",
            type: "song",
            targetStates: ["anxious", "disempowered", "fearful"],
            traits: ["courageous", "authentic", "action-oriented"],
            effect: "empowering, courage-building"
        },
        {
            id: 's5',
            text: "Listen to 'The Middle' by Jimmy Eat World - It just takes some time",
            title: "The Middle",
            artist: "Jimmy Eat World",
            type: "song",
            targetStates: ["overwhelmed", "stressed", "impatient"],
            traits: ["patient", "encouraging", "perspective"],
            effect: "calming, reassuring"
        },
        {
            id: 's6',
            text: "Play 'Stronger' by Kelly Clarkson - What doesn't kill you makes you stronger",
            title: "Stronger",
            artist: "Kelly Clarkson",
            type: "song",
            targetStates: ["sad", "defeated", "disempowered"],
            traits: ["resilient", "empowering", "energetic"],
            effect: "uplifting, strengthening"
        },
        {
            id: 's7',
            text: "Listen to 'Good Life' by OneRepublic - Celebrate the moment you're in",
            title: "Good Life",
            artist: "OneRepublic",
            type: "song",
            targetStates: ["happy", "grateful", "inspired"],
            traits: ["appreciative", "present-focused", "celebratory"],
            effect: "amplifying joy, gratitude"
        },
        {
            id: 's8',
            text: "Play 'Rise Up' by Andra Day - I'll rise up, in spite of the ache",
            title: "Rise Up",
            artist: "Andra Day",
            type: "song",
            targetStates: ["sad", "defeated", "tired"],
            traits: ["perseverant", "soulful", "inspiring"],
            effect: "strengthening, hope-building"
        }
    ]
};