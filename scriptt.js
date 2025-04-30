document.addEventListener('DOMContentLoaded', function () {
    const chatBox = document.getElementById('chat-box');
    const languageSelect = document.getElementById('language-select');
    const sendButton = document.getElementById('send-btn');
    const userInputField = document.getElementById('user-input');
    let selectedLanguage = 'en'; // Default language is English

    // Listen for language selection changes
    languageSelect.addEventListener('change', function () {
        selectedLanguage = languageSelect.value;
    });

    // Function to generate the AI greeting as a travel guide
    function generateGreeting() {
        const prompt = `Generate a one-line greeting message as a friendly Indian AI travel guide to welcome the user.`;
        return fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer IlmEUAfBehgx70V1v564OUj37tDHxaztukGOd3LX', // Replace with your Cohere API key
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'command-xlarge-nightly',
                prompt: prompt,
                max_tokens: 60,
                temperature: 0.7,
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => data.generations[0].text.trim())
        .catch(error => {
            console.error('Error:', error);
            return 'Sorry, an error occurred. Please try again.';
        });
    }

    // Display the AI greeting message when the page loads
    generateGreeting().then(greeting => {
        const botGreetingMessage = document.createElement('div');
        botGreetingMessage.classList.add('message', 'bot-message', 'p-3', 'bg-purple-500', 'rounded-lg', 'text-white');
        botGreetingMessage.textContent = greeting;
        chatBox.appendChild(botGreetingMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    // Handle user message and AI response
    sendButton.addEventListener('click', function () {
        const userInput = userInputField.value;
        if (userInput.trim() === '') return;

        // Display user message
        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'user-message', 'p-3', 'bg-gray-700', 'rounded-lg', 'text-white', 'self-end');
        userMessage.textContent = userInput;
        chatBox.appendChild(userMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Function to generate AI response
        function generateResponse(prompt) {
            const aiPrompt = `You are an AI travel guide that helps tourists find and explore places based on their interests, responding in ${getLanguageName(selectedLanguage)}. Act like a friendly, knowledgeable Indian guide who gives short, clear recommendations with just the right details to help users plan memorable trips.\nUser says: ${prompt}`;
            return fetch('https://api.cohere.ai/v1/generate', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer XxxFtipnDhPlvCicRc3cElrbwDhA0100T6zWxGwz', // Replace with your Cohere API key
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'command-xlarge-nightly',
                    prompt: aiPrompt,
                    max_tokens: 80, // Shorter response
                    temperature: 0.7,
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => data.generations[0].text.trim())
            .catch(error => {
                console.error('Error:', error);
                return 'Sorry, an error occurred. Please try again.';
            });
        }

        // Generate response based on user input and display it in parts
        generateResponse(userInput).then(response => {
            const botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot-message', 'p-3', 'bg-purple-500', 'rounded-lg', 'text-white');
            chatBox.appendChild(botMessage);
            chatBox.scrollTop = chatBox.scrollHeight;

            // Function to display response in parts
            function displayResponseInParts(responseText) {
                const words = responseText.split(' ');
                let currentText = '';
                let index = 0;

                // Function to update the bot message with the next word
                function updateMessage() {
                    if (index < words.length) {
                        currentText += words[index] + ' ';
                        botMessage.textContent = currentText.trim();
                        index++;
                        chatBox.scrollTop = chatBox.scrollHeight;
                        setTimeout(updateMessage, 20); // Faster display speed
                    }
                }
                updateMessage();
            }
            displayResponseInParts(response);
        });

        // Clear user input field
        userInputField.value = '';
    });

    // Function to return the full language name based on the code
    function getLanguageName(languageCode) {
        switch (languageCode) {
            case 'hi': return 'Hindi';
            case 'ta': return 'Tamil';
            case 'ru': return 'Russian';
            case 'sa': return 'Sanskrit';
            default: return 'English';
        }
    }
});
