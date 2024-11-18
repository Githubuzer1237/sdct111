document.querySelectorAll('.write-button').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        openChatModal();
    });
});

function openChatModal() {
}
