# Finance Tracker

Fullstack-приложение для учёта личных финансов. Позволяет отслеживать доходы и расходы, управлять счетами и категориями, а также анализировать финансовую активность через дашборд с графиками.

---

## Стек технологий

**Frontend**
- React
- Redux (actions / reducers / thunks / selectors)
- React Router
- Tailwind CSS
- Vite

**Backend**
- Node.js
- Express
- MongoDB + Mongoose
- JWT-аутентификация (cookie-based)
- express-validator

---

## Функциональность

- Регистрация и авторизация пользователя (JWT + cookies)
- Управление счетами (создание, редактирование, удаление)
- Управление категориями доходов и расходов
- Добавление и фильтрация транзакций
- Дашборд с аналитикой: графики (линейный, круговой), статистика по периодам
- Пагинация списков

---

## Структура проекта
```
finance-tracker1/
├── Backend/
│   └── src/
│       ├── controllers/   # Бизнес-логика (счета, категории, транзакции, аналитика)
│       ├── models/        # Mongoose-схемы
│       ├── routes/        # API-маршруты
│       ├── middlewares/   # Аутентификация, валидация
│       ├── mappers/       # Форматирование данных
│       └── utils/         # Вспомогательные функции
└── Frontend/
    └── src/
        ├── api/           # Запросы к серверу
        ├── components/    # UI-компоненты (таблицы, формы, иконки)
        ├── pages/         # Страницы приложения
        ├── store/         # Redux: actions, reducers, thunks, selectors
        └── routes/        # Роутинг
```
---

## Запуск проекта

### Требования
- Node.js v18+
- MongoDB (локально или MongoDB Atlas)

### Backend

```bash
cd Backend
npm install
```

Создать файл `.env` в папке `Backend`:

```env
PORT=3005
DB_CONNECTION_STRING=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your_secret_key
```

```bash
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`

---

## API-эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| POST | /api/auth/register | Регистрация |
| POST | /api/auth/login | Авторизация |
| GET | /api/accounts | Список счетов |
| POST | /api/accounts | Создать счёт |
| GET | /api/categories | Список категорий |
| POST | /api/transactions | Добавить транзакцию |
| GET | /api/transactions | Список транзакций с фильтрацией |
| GET | /api/transactions/analytics | Аналитика по транзакциям |

---

## Автор

Дарья Лобанова — [GitHub](https://github.com/Sawd1edd9013)

> Дипломный проект курса Frontend-разработки, Result University, 2026
