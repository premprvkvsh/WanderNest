document.addEventListener('DOMContentLoaded', function () {
    const chatBox = document.getElementById('chat-box');
    const languageSelect = document.getElementById('language-select');
    const sendButton = document.getElementById('send-btn');
    const userInputField = document.getElementById('user-input');
    let selectedLanguage = 'en'; // Default language is English
    let selectedMode = 'Gita GPT'; // Default mode is Gita GPT

    // Listen for language selection changes
    languageSelect.addEventListener('change', function () {
        selectedLanguage = languageSelect.value;
    });

    // Listen for chat mode changes
    document.querySelectorAll('input[name="chat-mode"]').forEach((input) => {
        input.addEventListener('change', function () {
            selectedMode = this.value;
        });
    });

    // Function to generate the AI greeting based on Bhagavad Gita teachings in the selected language
    function generateGreeting() {
        const prompt = `Generate a one-line greeting message as Lord Krishna from the Bhagavad Gita in ${getLanguageName(selectedLanguage)}.`;
        return fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 27R0L0qxF1HS33MDKuehw75pzcepmY2QFwW4UliW', // Replace with your Cohere API key
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
            let aiPrompt;
            if (selectedMode === 'Talk with Krishna') {
                aiPrompt = `You are to embody the wisdom and divine presence of Lord Krishna. Respond very short responses to questions and situations as Krishna would, drawing on his teachings from the Bhagavad Gita and other scriptures. Your answers should reflect his compassion, insight, and understanding of human nature. Approach each question with the intent to enlighten and guide, emphasizing principles of Dharma, love, and self-realization. Remember, you are not just providing information; you are sharing divine wisdom to help others navigate their lives.\nUser asked in ${getLanguageName(selectedLanguage)}: ${prompt}\nResponse:`;
            } else {
                aiPrompt = `User asked in ${getLanguageName(selectedLanguage)}: ${prompt}\n respond responses in very short according on the Bhagavad Gita's teachings in ${getLanguageName(selectedLanguage)} in very short " Act like bhagvad gita's krishna himself alyways reply start with hey arjuna and the shlok of gita for prefrence":`;
            }

            return fetch('https://api.cohere.ai/v1/generate', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer u90EXvZ2oXdPekBmB7vA9HfwAeEvazDdBuRcSnsB', // Replace with your Cohere API key
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'command-xlarge-nightly',
                    prompt: aiPrompt,
                    max_tokens: 150,
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
                        setTimeout(updateMessage, 20); // Reduced delay between words for faster display
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
            case 'hi':
                return 'Hindi';
            case 'ta':
                return 'Tamil';
            case 'ru':
                return 'Russian';
            case 'sa':
                return 'Sanskrit'; // Added Sanskrit case
            default:
                return 'English';
        }
    }
});
