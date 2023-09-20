const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const suggestionsContainer = document.getElementById('suggestions-container');

// searchButton.addEventListener('click', () => {
//     const searchTerm = searchInput.value;
//     searchWord(searchTerm);
// });
// Add an event listener for Enter key press
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default Enter key behavior (e.g., submitting a form)
        searchButton.click(); // Trigger the search button click event
    }
});

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    searchWord(searchTerm);
});

const clearIcon = document.getElementById('clear-search');

// Add an event listener for clear icon click
clearIcon.addEventListener('click', () => {
    searchInput.value = ''; 
});


function searchWord(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    // Make the API request
    fetch(apiUrl)
        .then(response => response.json())// Asynchronously parse the response as JSON
        .then(data => {
            // Process the API response and display results and suggestions
            displayResults(data);
            displaySuggestions(data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            resultsContainer.innerHTML = 'Error fetching data.';
        });
}

function displayResults(data) {
    // Clear previous results
    resultsContainer.innerHTML = '';

    if (data.length === 0) {
        resultsContainer.innerHTML = 'Word not found.';
        return;
    }

    // Display word information, including audio, pronunciation, and definitions
    data.forEach(result => {
        const word = result.word;
        const pronunciations = result.phonetics || [];
        const meanings = result.meanings || [];

        const resultElement = document.createElement('div');
        resultElement.classList.add('result');
        resultElement.innerHTML = `
            <h2>${word}</h2>
        `;

        // Display the word's pronunciation (if available)
        if (pronunciations.length > 0) {
            const pronunciation = pronunciations[0].text || 'N/A';
            resultElement.innerHTML += `
                <p><strong>Pronunciation:</strong><br> ${pronunciation}</p>
            `;
        }

        // Display a single audio pronunciation (if available)
        if (pronunciations.length > 0) {
            const audio = pronunciations[0].audio || '';
            if (audio) {
                resultElement.innerHTML += `
                    <audio controls src="${audio}"></audio>
                `;
            }
        }

        // Display definitions for noun, proper noun, and verb as ordered lists
        meanings.forEach(meaning => {
            const partOfSpeech = meaning.partOfSpeech || 'N/A';
            const definitions = meaning.definitions || [];

            resultElement.innerHTML += `
                <p><strong>${partOfSpeech}:</strong></p>
            `;

            if (definitions.length > 0) {
                resultElement.innerHTML += '<ol>';
                definitions.forEach(definition => {
                    const definitionText = definition.definition || 'N/A';
                    resultElement.innerHTML += `
                        <li>${definitionText}</li>
                    `;
                });
                resultElement.innerHTML += '</ol>';
            }
        });

        resultsContainer.appendChild(resultElement);
    });
}

function displaySuggestions(data) {
    // Clear previous suggestions
    suggestionsContainer.innerHTML = '';

    if (data.length === 0) {
        suggestionsContainer.innerHTML = '';
        return;
    }

    // Display similar words (if available)
    const suggestions = data[0].suggestions || [];

    if (suggestions.length > 0) {
        suggestionsContainer.innerHTML = '<h3>Similar Words:</h3>';
        suggestions.forEach(suggestion => {
            suggestionsContainer.innerHTML += `<p>${suggestion}</p>`;
});
}
}