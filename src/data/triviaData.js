/*
|--------------------------------------------------------------------------
| Trivia Mock Data
|--------------------------------------------------------------------------
|
| This file contains presentation/demo data for the Trivia section.
|
| IMPORTANT:
| These are MOCK categories and questions.
| They are not intended to represent the exact production Firestore data.
|
| The real backend will eventually provide:
| - Categories
| - Questions
| - Energy
| - Daily usage
| - Category usage
| - Scores
| - Rewards
|
|--------------------------------------------------------------------------
*/

export const TRIVIA_LIMITS = {
    dailyAnswers: 150,
    categoryAnswers: 30,
    energyMax: 10,
    roundEnergyCost: 1,
};

/*
|--------------------------------------------------------------------------
| Trivia Categories
|--------------------------------------------------------------------------
*/

export const triviaCategories = [
    {
        id: "general",
        name: "General Knowledge",
        description:
            "Test yourself with interesting questions from everyday knowledge.",
        icon: "brain",
        questionsAvailable: 120,
    },
    {
        id: "science",
        name: "Science",
        description:
            "Explore questions about nature, technology, space and discovery.",
        icon: "flask",
        questionsAvailable: 95,
    },
    {
        id: "history",
        name: "History",
        description:
            "Challenge yourself with events, people and places from the past.",
        icon: "landmark",
        questionsAvailable: 100,
    },
    {
        id: "technology",
        name: "Technology",
        description:
            "Put your knowledge of computers, technology and innovation to work.",
        icon: "cpu",
        questionsAvailable: 85,
    },
    {
        id: "entertainment",
        name: "Entertainment",
        description:
            "Movies, music, television and popular culture.",
        icon: "clapperboard",
        questionsAvailable: 90,
    },
    {
        id: "sports",
        name: "Sports",
        description:
            "Challenge yourself with questions from the world of sports.",
        icon: "trophy",
        questionsAvailable: 80,
    },
];

/*
|--------------------------------------------------------------------------
| Mock Trivia Questions
|--------------------------------------------------------------------------
|
| The mock UI uses a small question pool.
|
| The production backend may return a completely different number
| of questions per round.
|
|--------------------------------------------------------------------------
*/

export const triviaQuestions = {
    general: [
        {
            id: "general-001",
            question:
                "Which planet is known as the Red Planet?",
            answers: [
                {
                    id: "a",
                    text: "Mars",
                },
                {
                    id: "b",
                    text: "Venus",
                },
                {
                    id: "c",
                    text: "Jupiter",
                },
                {
                    id: "d",
                    text: "Mercury",
                },
            ],
            correctAnswer: "a",
            explanation:
                "Mars is commonly called the Red Planet because iron minerals on its surface give it a reddish appearance.",
        },
        {
            id: "general-002",
            question:
                "How many days are there in a leap year?",
            answers: [
                {
                    id: "a",
                    text: "364",
                },
                {
                    id: "b",
                    text: "365",
                },
                {
                    id: "c",
                    text: "366",
                },
                {
                    id: "d",
                    text: "367",
                },
            ],
            correctAnswer: "c",
            explanation:
                "A leap year has 366 days because February contains 29 days instead of 28.",
        },
        {
            id: "general-003",
            question:
                "Which ocean is the largest on Earth?",
            answers: [
                {
                    id: "a",
                    text: "Atlantic Ocean",
                },
                {
                    id: "b",
                    text: "Indian Ocean",
                },
                {
                    id: "c",
                    text: "Arctic Ocean",
                },
                {
                    id: "d",
                    text: "Pacific Ocean",
                },
            ],
            correctAnswer: "d",
            explanation:
                "The Pacific Ocean is the largest and deepest ocean on Earth.",
        },
        {
            id: "general-004",
            question:
                "Which language has the largest number of native speakers?",
            answers: [
                {
                    id: "a",
                    text: "English",
                },
                {
                    id: "b",
                    text: "Mandarin Chinese",
                },
                {
                    id: "c",
                    text: "Spanish",
                },
                {
                    id: "d",
                    text: "French",
                },
            ],
            correctAnswer: "b",
            explanation:
                "Mandarin Chinese has the largest number of native speakers.",
        },
        {
            id: "general-005",
            question:
                "What is the capital city of Japan?",
            answers: [
                {
                    id: "a",
                    text: "Kyoto",
                },
                {
                    id: "b",
                    text: "Osaka",
                },
                {
                    id: "c",
                    text: "Tokyo",
                },
                {
                    id: "d",
                    text: "Hiroshima",
                },
            ],
            correctAnswer: "c",
            explanation:
                "Tokyo is the capital and largest city of Japan.",
        },
    ],

    science: [
        {
            id: "science-001",
            question:
                "What gas do plants primarily absorb from the atmosphere during photosynthesis?",
            answers: [
                {
                    id: "a",
                    text: "Oxygen",
                },
                {
                    id: "b",
                    text: "Nitrogen",
                },
                {
                    id: "c",
                    text: "Carbon dioxide",
                },
                {
                    id: "d",
                    text: "Hydrogen",
                },
            ],
            correctAnswer: "c",
            explanation:
                "Plants absorb carbon dioxide and use it during photosynthesis to produce food.",
        },
        {
            id: "science-002",
            question:
                "What is the basic unit of life?",
            answers: [
                {
                    id: "a",
                    text: "Atom",
                },
                {
                    id: "b",
                    text: "Cell",
                },
                {
                    id: "c",
                    text: "Tissue",
                },
                {
                    id: "d",
                    text: "Organ",
                },
            ],
            correctAnswer: "b",
            explanation:
                "The cell is considered the basic structural and functional unit of life.",
        },
        {
            id: "science-003",
            question:
                "Which force keeps planets in orbit around the Sun?",
            answers: [
                {
                    id: "a",
                    text: "Magnetism",
                },
                {
                    id: "b",
                    text: "Friction",
                },
                {
                    id: "c",
                    text: "Gravity",
                },
                {
                    id: "d",
                    text: "Electricity",
                },
            ],
            correctAnswer: "c",
            explanation:
                "The Sun's gravitational force keeps the planets in orbit.",
        },
    ],

    history: [
        {
            id: "history-001",
            question:
                "Which ancient civilization built the pyramids at Giza?",
            answers: [
                {
                    id: "a",
                    text: "Romans",
                },
                {
                    id: "b",
                    text: "Egyptians",
                },
                {
                    id: "c",
                    text: "Greeks",
                },
                {
                    id: "d",
                    text: "Persians",
                },
            ],
            correctAnswer: "b",
            explanation:
                "The pyramids at Giza were constructed by ancient Egyptians.",
        },
        {
            id: "history-002",
            question:
                "The ancient city of Rome was the center of which empire?",
            answers: [
                {
                    id: "a",
                    text: "Roman Empire",
                },
                {
                    id: "b",
                    text: "Ottoman Empire",
                },
                {
                    id: "c",
                    text: "Mali Empire",
                },
                {
                    id: "d",
                    text: "Mongol Empire",
                },
            ],
            correctAnswer: "a",
            explanation:
                "Rome was the center of the Roman Empire.",
        },
        {
            id: "history-003",
            question:
                "Which famous wall divided Berlin during the Cold War?",
            answers: [
                {
                    id: "a",
                    text: "The Great Wall",
                },
                {
                    id: "b",
                    text: "Berlin Wall",
                },
                {
                    id: "c",
                    text: "Western Wall",
                },
                {
                    id: "d",
                    text: "Hadrian's Wall",
                },
            ],
            correctAnswer: "b",
            explanation:
                "The Berlin Wall divided East and West Berlin during the Cold War.",
        },
    ],

    technology: [
        {
            id: "technology-001",
            question:
                "What does CPU stand for?",
            answers: [
                {
                    id: "a",
                    text: "Central Processing Unit",
                },
                {
                    id: "b",
                    text: "Computer Personal Unit",
                },
                {
                    id: "c",
                    text: "Central Program Utility",
                },
                {
                    id: "d",
                    text: "Core Processing Utility",
                },
            ],
            correctAnswer: "a",
            explanation:
                "CPU stands for Central Processing Unit.",
        },
        {
            id: "technology-002",
            question:
                "Which technology is commonly used to style web pages?",
            answers: [
                {
                    id: "a",
                    text: "HTML",
                },
                {
                    id: "b",
                    text: "CSS",
                },
                {
                    id: "c",
                    text: "SQL",
                },
                {
                    id: "d",
                    text: "JSON",
                },
            ],
            correctAnswer: "b",
            explanation:
                "CSS, or Cascading Style Sheets, is used to style and present web pages.",
        },
        {
            id: "technology-003",
            question:
                "Which of these is primarily a JavaScript library for building user interfaces?",
            answers: [
                {
                    id: "a",
                    text: "React",
                },
                {
                    id: "b",
                    text: "MySQL",
                },
                {
                    id: "c",
                    text: "Apache",
                },
                {
                    id: "d",
                    text: "Nginx",
                },
            ],
            correctAnswer: "a",
            explanation:
                "React is a JavaScript library commonly used to build user interfaces.",
        },
    ],

    entertainment: [
        {
            id: "entertainment-001",
            question:
                "Which instrument commonly has 88 keys?",
            answers: [
                {
                    id: "a",
                    text: "Violin",
                },
                {
                    id: "b",
                    text: "Piano",
                },
                {
                    id: "c",
                    text: "Trumpet",
                },
                {
                    id: "d",
                    text: "Guitar",
                },
            ],
            correctAnswer: "b",
            explanation:
                "A standard modern piano typically has 88 keys.",
        },
        {
            id: "entertainment-002",
            question:
                "Which art form is primarily associated with moving images?",
            answers: [
                {
                    id: "a",
                    text: "Cinema",
                },
                {
                    id: "b",
                    text: "Sculpture",
                },
                {
                    id: "c",
                    text: "Painting",
                },
                {
                    id: "d",
                    text: "Pottery",
                },
            ],
            correctAnswer: "a",
            explanation:
                "Cinema is the art of creating and presenting moving images.",
        },
        {
            id: "entertainment-003",
            question:
                "How many strings does a standard guitar usually have?",
            answers: [
                {
                    id: "a",
                    text: "4",
                },
                {
                    id: "b",
                    text: "5",
                },
                {
                    id: "c",
                    text: "6",
                },
                {
                    id: "d",
                    text: "7",
                },
            ],
            correctAnswer: "c",
            explanation:
                "A standard guitar normally has six strings.",
        },
    ],

    sports: [
        {
            id: "sports-001",
            question:
                "How many players from one team are normally on the court in basketball?",
            answers: [
                {
                    id: "a",
                    text: "4",
                },
                {
                    id: "b",
                    text: "5",
                },
                {
                    id: "c",
                    text: "6",
                },
                {
                    id: "d",
                    text: "7",
                },
            ],
            correctAnswer: "b",
            explanation:
                "A basketball team has five players on the court at a time.",
        },
        {
            id: "sports-002",
            question:
                "How many players are on the field for one soccer team during normal play?",
            answers: [
                {
                    id: "a",
                    text: "9",
                },
                {
                    id: "b",
                    text: "10",
                },
                {
                    id: "c",
                    text: "11",
                },
                {
                    id: "d",
                    text: "12",
                },
            ],
            correctAnswer: "c",
            explanation:
                "A soccer team normally has 11 players on the field.",
        },
        {
            id: "sports-003",
            question:
                "Which sport uses a shuttlecock?",
            answers: [
                {
                    id: "a",
                    text: "Tennis",
                },
                {
                    id: "b",
                    text: "Badminton",
                },
                {
                    id: "c",
                    text: "Squash",
                },
                {
                    id: "d",
                    text: "Volleyball",
                },
            ],
            correctAnswer: "b",
            explanation:
                "Badminton is played using a shuttlecock.",
        },
    ],
};

/*
|--------------------------------------------------------------------------
| Mock Trivia Usage
|--------------------------------------------------------------------------
|
| These values imitate the sort of usage information the real backend
| will eventually provide.
|--------------------------------------------------------------------------
*/

export const mockTriviaUsage = {
    energy: 9,

    dailyAnswers: 18,

    categoryAnswers: {
        general: 7,
        science: 4,
        history: 2,
        technology: 3,
        entertainment: 1,
        sports: 1,
    },

    lastRound: {
        categoryId: "general",
        score: 4,
        totalQuestions: 5,
        reward: 80,
    },
};