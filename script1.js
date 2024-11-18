// script.js

// Подключение к серверу через WebSocket
const socket = io();

// Получаем элементы DOM
const messageContainer = document.getElementById('messageContainer');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const saveSettingsBtn = document.getElementById('saveSettings');
const groupStatus = document.getElementById('groupStatus');
const groupColor = document.getElementById('groupColor');
const privilege = document.getElementById('privilege');
const profilePicture = document.getElementById('profilePicture');

// Функция для добавления сообщения в чат
function addMessage(text, isSent) {
  const message = document.createElement('div');
  message.classList.add('message', isSent ? 'sent' : 'received');
  message.textContent = text;
  messageContainer.appendChild(message);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Отправка сообщения на сервер
sendMessageBtn.addEventListener('click', () => {
  const text = messageInput.value.trim();
  if (text) {
    addMessage(text, true); // Добавляем сообщение как отправленное
    socket.emit('sendMessage', text); // Отправляем на сервер
    messageInput.value = '';
  }
});

// Отправка сообщения по нажатию Enter
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessageBtn.click();
  }
});

// Получение сообщения с сервера
socket.on('receiveMessage', (message) => {
  addMessage(message, false);
});

// Обработчик для модального окна настроек
settingsButton.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

// Сохранение настроек
saveSettingsBtn.addEventListener('click', () => {
  const settings = {
    status: groupStatus.value,
    color: groupColor.value,
    privilege: privilege.value,
  };

  // Применение цвета темы
  document.body.style.backgroundColor = settings.color;

  // Отправка данных о настройках на сервер
  socket.emit('saveSettings', settings);
  settingsModal.style.display = 'none';

  // Загрузка изображения профиля (только на клиенте)
  const file = profilePicture.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('chatTitle').style.backgroundImage = `url(${e.target.result})`;
    };
    reader.readAsDataURL(file);
  }
});

// Обработка ошибок подключения
socket.on('connect_error', (error) => {
  console.error('Ошибка подключения:', error);
});
