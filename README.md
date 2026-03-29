# Cristian Paul Guillen — Student Portfolio

A personal portfolio website built with Django, showcasing my projects, skills, and education as a 3rd Year BSIT student at Negros Oriental State University (NORSU-BSC), Bayawan City.

## Live Preview

🌐 [cristianpaulguillen.pythonanywhere.com](https://cristianpaulguillen.pythonanywhere.com)

---

## Features

- Dynamic content powered by Django models and SQLite
- Animated skill bars, typed text effect, stat counters
- GitHub contribution graph
- Contact form that saves messages to the database
- Django admin panel for managing all content
- Scrolling tech stack ticker
- Education timeline

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Django |
| Frontend | HTML, CSS, Vanilla JavaScript |
| Database | SQLite |
| Fonts | Bebas Neue, Instrument Sans, Fira Code |
| Hosting | PythonAnywhere |
| Version Control | Git, GitHub |

---

## Project Structure

```
DjangoPortfolio/
├── Portfolio/                # Project-level settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── frontEnd/                 # Main app
│   ├── migrations/
│   ├── fixtures/
│   │   └── initial_data.json # Seed data for all models
│   ├── static/
│   │   └── frontEnd/
│   │       ├── css/
│   │       │   └── main.css
│   │       ├── js/
│   │       │   └── main.js
│   │       └── resume.pdf
│   ├── templates/
│   │   └── frontEnd/
│   │       ├── base.html
│   │       └── index.html
│   ├── admin.py
│   ├── forms.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
├── db.sqlite3
├── manage.py
└── requirements.txt
```

---

## Local Setup

### Prerequisites
- Python 3.10+
- pip
- Git

### 1. Clone the repository
```bash
git clone https://github.com/chan2s/DjangoPortfolio.git
cd DjangoPortfolio
```

### 2. Create a virtual environment
```bash
python -m venv venv
```

Activate it:
- **Windows:** `venv\Scripts\activate`
- **Mac/Linux:** `source venv/bin/activate`

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run migrations
```bash
python manage.py migrate
```

### 5. Load seed data
```bash
python manage.py loaddata frontEnd/fixtures/initial_data.json
```

### 6. Create admin account
```bash
python manage.py createsuperuser
```

### 7. Run the server
```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000` to view the portfolio.  
Visit `http://127.0.0.1:8000/admin` to manage content.

---

## Django Models

### `Project`
Stores portfolio projects with title, description, technologies, GitHub/live URLs, and case study fields (problem, process, result).

### `Skill`
Stores technical skills (with proficiency percentage), professional skills, and tools. Used for skill bars and the tools list.

### `Education`
Stores the education timeline — institution, degree, year range, and whether it's the current school.

### `ContactMessage`
Saves every contact form submission to the database with name, email, subject, message, and status (New / Read / Replied). Manageable from the admin panel.

---

## Admin Panel

Log in at `/admin` to manage all portfolio content without touching code:

- **Projects** — add, edit, delete projects; mark one as Featured; set display order
- **Skills** — adjust proficiency bars; mark skills as Learning; reorder
- **Education** — add entries; mark current school
- **Contact Messages** — view all submissions; mark as Read or Replied

---

## Deployment (PythonAnywhere)

### 1. Clone the repo
```bash
git clone https://github.com/chan2s/DjangoPortfolio.git
```

### 2. Create a virtual environment
```bash
mkvirtualenv --python=/usr/bin/python3.10 portfolio-env
```

### 3. Install dependencies
```bash
cd DjangoPortfolio
pip install -r requirements.txt
```

### 4. Run migrations and load data
```bash
python manage.py migrate
python manage.py loaddata frontEnd/fixtures/initial_data.json
python manage.py collectstatic
```

### 5. Configure WSGI file
```python
import os
import sys

path = '/home/YOUR_USERNAME/DjangoPortfolio'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'Portfolio.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### 6. Static files mapping on Web tab

| URL | Directory |
|-----|-----------|
| `/static/` | `/home/YOUR_USERNAME/DjangoPortfolio/staticfiles` |

### 7. Update settings for production
```python
DEBUG = False
ALLOWED_HOSTS = ['YOUR_USERNAME.pythonanywhere.com']
```

---

## Updating the Live Site

```bash
# Local machine
git add .
git commit -m "your message"
git push origin master

# PythonAnywhere bash console
cd ~/DjangoPortfolio
git pull
python manage.py collectstatic --noinput
```

Then click **Reload** on the PythonAnywhere Web tab.

---

## Author

**Cristian Paul Guillen**
- GitHub: [@chan2s](https://github.com/chan2s)
- Email: cpguillen@email.com
- Location: Bayawan City, Negros Oriental, Philippines
- University: NORSU-BSC — BSIT 3rd Year

---

## License

This project is for academic and personal portfolio purposes.
