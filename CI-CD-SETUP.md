# CI/CD Setup Instructions

Это руководство поможет вам настроить CI/CD для автоматического деплоя приложения.

## 📋 Содержание

1. [Настройка GitHub Secrets](#1-настройка-github-secrets)
2. [Настройка Docker Hub](#2-настройка-docker-hub)
3. [Настройка сервера](#3-настройка-сервера)
4. [Проверка работы](#4-проверка-работы)
5. [Устранение неполадок](#5-устранение-неполадок)

---

## 1. Настройка GitHub Secrets

Перейдите в настройки вашего репозитория: `Settings` → `Secrets and variables` → `Actions`

Нажмите `New repository secret` и добавьте следующие секреты:

### Обязательные секреты:

#### Docker Hub
- **DOCKERHUB_USERNAME**: Ваш логин на Docker Hub
- **DOCKERHUB_TOKEN**: Access Token из Docker Hub (см. раздел 2)

#### SSH подключение к серверу
- **SSH_HOST**: IP-адрес или домен вашего сервера (например, `123.45.67.89` или `server.example.com`)
- **SSH_USERNAME**: Имя пользователя для SSH (обычно `root` или `ubuntu`)
- **SSH_PRIVATE_KEY**: Приватный SSH ключ (см. инструкцию ниже)
- **SSH_PORT**: (опционально) Порт SSH, по умолчанию 22
- **DEPLOY_PATH**: (опционально) Путь к директории проекта на сервере, по умолчанию `/opt/hostel-app`

---

## 2. Настройка Docker Hub

### Создание репозитория:

1. Войдите на [Docker Hub](https://hub.docker.com/)
2. Нажмите `Create Repository`
3. Укажите имя: `hostel-app` (или другое)
4. Выберите видимость (Public/Private)
5. Нажмите `Create`

### Создание Access Token:

1. Перейдите в `Account Settings` → `Security`
2. Нажмите `New Access Token`
3. Укажите название: `github-actions`
4. Выберите права: `Read, Write, Delete`
5. Скопируйте токен и добавьте в GitHub Secrets как `DOCKERHUB_TOKEN`

---

## 3. Настройка сервера

### 3.1. Создание SSH ключа (если его нет)

На вашем локальном компьютере выполните:

```bash
# Создать новый SSH ключ
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key

# Скопировать публичный ключ на сервер
ssh-copy-id -i ~/.ssh/github_actions_key.pub user@your-server-ip

# Скопировать приватный ключ для GitHub Secrets
cat ~/.ssh/github_actions_key
```

Скопируйте весь вывод (включая `-----BEGIN OPENSSH PRIVATE KEY-----` и `-----END OPENSSH PRIVATE KEY-----`) и добавьте в GitHub Secrets как `SSH_PRIVATE_KEY`.

### 3.2. Установка Docker и Docker Compose на сервер

Подключитесь к серверу:

```bash
ssh user@your-server-ip
```

Установите Docker:

```bash
# Обновить пакеты
sudo apt update

# Установить зависимости
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Добавить GPG ключ Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавить репозиторий Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установить Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Добавить пользователя в группу docker
sudo usermod -aG docker $USER

# Перезайти для применения изменений
exit
ssh user@your-server-ip

# Проверить установку
docker --version
docker compose version
```

### 3.3. Создание директории проекта

```bash
# Создать директорию
sudo mkdir -p /opt/hostel-app
sudo chown $USER:$USER /opt/hostel-app
cd /opt/hostel-app

# Создать файл с переменными окружения
nano .env.production
```

Добавьте необходимые переменные окружения в `.env.production`:

```env
NODE_ENV=production
# Добавьте другие переменные из вашего .env.local
```

### 3.4. (Опционально) Настройка Nginx как reverse proxy

Если хотите использовать домен и SSL:

```bash
# Установить Nginx
sudo apt install -y nginx

# Создать конфиг
sudo nano /etc/nginx/sites-available/hostel-app
```

Содержимое конфига:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активировать конфиг:

```bash
sudo ln -s /etc/nginx/sites-available/hostel-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Установить SSL с Let's Encrypt:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 4. Проверка работы

### 4.1. Локальная проверка Docker сборки

Перед пушем можно проверить локально:

```bash
# Собрать образ
docker build -t hostel-app:test .

# Запустить контейнер
docker run -p 3000:3000 --env-file .env.production hostel-app:test

# Проверить в браузере
# Открыть http://localhost:3000
```

### 4.2. Первый деплой

1. Сделайте коммит и пуш в ветку `main`:

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

2. Перейдите во вкладку `Actions` в вашем GitHub репозитории
3. Вы увидите запущенный workflow "CI/CD Pipeline"
4. Дождитесь завершения всех этапов (Lint, Build, Deploy)

### 4.3. Проверка на сервере

Подключитесь к серверу и проверьте:

```bash
# Проверить запущенные контейнеры
docker ps

# Посмотреть логи
cd /opt/hostel-app
docker compose logs -f

# Проверить работу
curl http://localhost:3000
```

---

## 5. Устранение неполадок

### Проблема: Workflow не запускается

**Решение:**
- Проверьте, что файл `.github/workflows/ci-cd.yml` закоммичен
- Убедитесь, что ветка называется `main` (не `master`)

### Проблема: Ошибка при деплое на сервер

**Решение:**
- Проверьте SSH подключение вручную: `ssh -i ~/.ssh/github_actions_key user@server-ip`
- Убедитесь, что приватный ключ скопирован полностью (с заголовками)
- Проверьте права на директорию: `ls -la /opt/hostel-app`

### Проблема: Docker образ не собирается

**Решение:**
- Проверьте логи в GitHub Actions
- Убедитесь, что в проекте есть `yarn.lock` или `package-lock.json`
- Проверьте локальную сборку: `docker build -t test .`

### Проблема: Приложение не доступно

**Решение:**
- Проверьте логи контейнера: `docker compose logs`
- Убедитесь, что порт 3000 открыт: `sudo ufw allow 3000`
- Проверьте переменные окружения в `.env.production`

### Проблема: "Permission denied" при сборке

**Решение:**
- Убедитесь, что пользователь в группе docker: `groups`
- Переподключитесь к серверу после добавления в группу

---

## 🎉 Готово!

Теперь при каждом пуше в ветку `main`:
1. ✅ Проверяется код линтером
2. 🐳 Собирается Docker образ
3. 📦 Образ публикуется в Docker Hub
4. 🚀 Автоматически деплоится на сервер

---

## 📚 Дополнительные команды

### Локальная разработка с Docker

```bash
# Собрать и запустить
docker compose up --build

# Остановить
docker compose down

# Просмотр логов
docker compose logs -f
```

### Управление на сервере

```bash
# Обновить вручную
cd /opt/hostel-app
docker compose pull
docker compose up -d

# Перезапустить
docker compose restart

# Остановить
docker compose down

# Очистить старые образы
docker image prune -a
```

### Откат к предыдущей версии

```bash
# На сервере
cd /opt/hostel-app

# Посмотреть доступные версии
docker images your-dockerhub-username/hostel-app

# Обновить docker-compose.yml на нужную версию
# Например: image: your-dockerhub-username/hostel-app:main-abc1234

# Перезапустить
docker compose up -d
```

---

## 🔒 Безопасность

- ✅ Никогда не коммитьте `.env.production` в Git
- ✅ Используйте сильные пароли для Docker Hub
- ✅ Регулярно обновляйте SSH ключи
- ✅ Используйте приватные Docker репозитории для production
- ✅ Настройте файрвол на сервере (UFW или iptables)

---

## 📝 Примечания

- Workflow запускается только при пуше в ветки `main` или `develop`
- Pull requests только проверяются линтером, но не деплоятся
- Docker образы кешируются для ускорения сборки
- Используется multi-stage build для уменьшения размера образа

Если у вас возникли вопросы, проверьте логи в GitHub Actions или на сервере.
