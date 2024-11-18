const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http'); // Подключаем http для сервера
const { Server } = require('socket.io'); // Подключаем socket.io

const app = express();
const server = http.createServer(app); // Создаем http сервер
const io = new Server(server); // Передаем http сервер в socket.io

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Подключение к базе данных MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'sdtc_api_test',
    password: 'qwertyuiop123456789',
    database: 'stdc'
});

// Middleware для проверки токена
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.redirect('/login');
        req.user = user;
        next();
    });
}

// Middleware для проверки роли
function authorizeRole(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }
        next();
    };
}

// Регистрация пользователя
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', 
             [username, hashedPassword, email], (err) => {
        if (err) return res.status(500).json({ error: 'Ошибка регистрации' });
        res.redirect('/login');
    });
});

// Вход пользователя
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        // Условие с ошибками - исправляем
        if (err || !results.length || !(await bcrypt.compare(password, results[0].password))) {
            return res.status(400).json({ error: 'Неверные данные' });
        }

        const user = { id: results[0].id, role: results[0].role };
        const token = jwt.sign(user, 'your_jwt_secret');
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/profile');
    });
});

// Просмотр профиля
app.get('/profile', authenticateToken, (req, res) => {
    const { id, role } = req.user;

    db.query('SELECT username, email, birth_year, birth_year_private, country, country_private, role FROM users WHERE id = ?', [id], (err, result) => {
        if (err) return res.sendStatus(500);

        const userProfile = result[0];
        const profileData = {
            username: userProfile.username,
            email: userProfile.email,
            role: userProfile.role,
            birth_year: (userProfile.birth_year_private && role !== 'creator') ? 'Скрыто' : userProfile.birth_year,
            country: (userProfile.country_private && role !== 'creator') ? 'Скрыто' : userProfile.country
        };

        res.render('profile', { profile: profileData });
    });
});

// Обновление профиля
app.post('/profile/update', authenticateToken, (req, res) => {
    const { id } = req.user;
    const { birth_year, birth_year_private, country, country_private, email } = req.body;

    db.query(
        `UPDATE users SET birth_year = ?, birth_year_private = ?, 
         country = ?, country_private = ?, email = ? WHERE id = ?`,
        [birth_year, birth_year_private, country, country_private, email, id],
        (err) => {
            if (err) return res.sendStatus(500);
            res.redirect('/profile');
        }
    );
});

// Маршруты для регистрации и входа
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));


// Подключение socket.io
io.on('connection', (socket) => {
    console.log('Новый пользователь подключился');
  
    socket.on('sendMessage', (message) => {
      console.log(message);
      io.emit('receiveMessage', message);
    });
  
    socket.on('disconnect', () => {
      console.log('Пользователь отключился');
    });
  });
  
  // Запуск сервера
  const HOST = '0.0.0.0'; // Изменено на 0.0.0.0 для прослушивания на всех интерфейсах
  const PORT = 3000;
  server.listen(PORT, HOST, () => console.log(`Сервер запущен на http://${HOST}:${PORT}`));
  