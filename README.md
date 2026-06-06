# NetCourse Forum

Форум образовательной платформы NetCourse на Nuxt/Vue. Терминал-стилизованное сообщество для обсуждения компьютерных сетей, программирования и смежных тем. Приложение предоставляет создание и обсуждение постов, привязку к курсам, профили пользователей с бейджами и сертификатами.

## Технологии

- Nuxt 4
- Vue 3
- TypeScript
- Tailwind CSS
- Lucide Icons
- Cloudflare Turnstile

## Требования

- Node.js 18+
- npm 9+

## Быстрый старт

```bash
npm install
npm run dev
```

По умолчанию dev-сервер запускается на `http://localhost:3000`.

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
NUXT_PUBLIC_API_BASE=https://your-backend-url/api
NUXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

Если переменные не заданы, используются значения из `nuxt.config.ts`.

## Основные скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Режим разработки |
| `npm run build` | Production-сборка |
| `npm run preview` | Локальный запуск production-сборки |
| `npm run generate` | Статическая генерация |

## Структура проекта

```
app/
├── pages/          # Страницы приложения
│   ├── index.vue         # Лента постов
│   ├── login.vue         # Вход
│   ├── register.vue      # Регистрация
│   ├── forum/
│   │   └── [id].vue      # Просмотр поста
│   └── profile/
│       ├── index.vue     # Свой профиль
│       └── [id].vue      # Профиль пользователя
├── components/     # UI-компоненты
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── PostModal.vue      # Создание/редактирование поста
│   ├── ForumPostCard.vue  # Карточка поста в ленте
│   ├── UserTooltip.vue    # Тултип профиля
│   ├── ConfirmModal.vue   # Модалка подтверждения
│   └── ToastContainer.vue # Уведомления
├── composables/    # Бизнес-логика и API-слой
├── layouts/        # Шаблоны страниц
├── locales/        # Локализация (RU, KZ)
├── middleware/     # Роут-мидлвары (auth)
└── plugins/        # Плагины
```

## Функциональность

- **Аутентификация** — регистрация и вход с Cloudflare Turnstile
- **Лента постов** — пагинация, фильтр по курсам, поиск по тегам
- **Создание и редактирование постов** — заголовок, тело, теги, привязка к курсу, рейтинг курса, вложения
- **Обсуждения** — ответы с вложениями, лайки постов и ответов
- **Профили** — аватар, био, соц. ссылки, бейджи, сертификаты, список постов
- **Интеграция с курсами** — привязка постов к курсам, отображение прогресса и рейтинга
- **Локализация** — русский и казахский языки
- **Терминальный UI** — тёмная тема, emerald-акценты, моноширинный шрифт

## API

Приложение использует REST API backend-сервиса через `NUXT_PUBLIC_API_BASE`. Основные эндпоинты:

- `POST /auth/register` — регистрация
- `POST /auth/login` — вход
- `GET /forum/posts` — лента постов
- `POST /forum/posts` — создание поста
- `GET /forum/posts/:id` — просмотр поста
- `POST /forum/posts/:id/replies` — создание ответа
- `GET /profiles/:id` — публичный профиль
- `GET /certifications/me` — сертификаты
- `GET /badges/me` — бейджи
