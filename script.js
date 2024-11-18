document.addEventListener("DOMContentLoaded", () => {
    function showSection(id) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(id).classList.add('active');
    }

    document.getElementById('chatForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const messageInput = document.getElementById('messageInput');
        const messageText = messageInput.value.trim();

        if (messageText) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = messageText;
            document.getElementById('chatMessages').appendChild(messageDiv);
            messageInput.value = '';
        }
    });

    // Показать главную страницу по умолчанию
    showSection('home');
});

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
}