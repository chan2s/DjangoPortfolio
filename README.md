# Cristian Paul Guillen — Portfolio

A personal portfolio website built with Django, showcasing my projects, skills, and background as a 3rd Year BSIT student at Negros Oriental State University (NORSU-BSC).

**Live Site:** [cristianpaulguillen.pythonanywhere.com](https://cristianpaulguillen.pythonanywhere.com)

---

## Tech Stack

- **Backend:** Django 5.2
- **Frontend:** HTML, CSS, Vanilla JavaScript
<!-- - **Database:** SQLite (development) -->
- **Deployment:** PythonAnywhere
- **Version Control:** Git & GitHub

---

## Features

- Responsive design optimized for all screen sizes
- Animated hero section with typed text effect
- Scrolling tech stack ticker
- Animated skill bars
- GitHub contribution graph integration
- Contact form
- Smooth scroll and reveal animations

---

## Project Structure

```
DjangoPortfolio/
├── Portfolio/              # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── frontEnd/               # Main app
│   ├── static/
│   │   └── frontEnd/
│   │       ├── css/
│   │       │   └── main.css
│   │       └── js/
│   │           └── main.js
│   ├── templates/
│   │   └── frontEnd/
│   │       ├── base.html
│   │       └── index.html
│   ├── views.py
│   └── urls.py
├── staticfiles/          
├── manage.py
├── requirements.txt
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.10+
- pip
- Git
- Virtualenv

---

### 1. Clone the Repository

```bash
git clone https://github.com/chan2s/DjangoPortfolio.git
cd DjangoPortfolio
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it:

- **Windows:**
  ```bash
  venv\Scripts\activate
  ```
- **Mac/Linux:**
  ```bash
  source venv/bin/activate
  ```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Settings

In `Portfolio/settings.py` set:

```python
DEBUG = True
ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
```

### 5. Run Migrations

```bash
python manage.py migrate
```

### 6. Collect Static Files

```bash
python manage.py collectstatic
```

### 7. Run the Development Server

```bash
python manage.py runserver
```

Visit [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

---

## Deployment (PythonAnywhere)

### 1. Clone the repo in PythonAnywhere Bash console

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

### 4. Collect static files

```bash
python manage.py collectstatic
```

### 5. Configure WSGI file

In the PythonAnywhere Web tab, set the WSGI file to:

```python
import os
import sys

path = '/home/CristianPaulGuillen/DjangoPortfolio'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'Portfolio.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### 6. Set Static Files mapping

| URL | Directory |
|-----|-----------|
| `/static/` | `/home/CristianPaulGuillen/DjangoPortfolio/staticfiles` |

### 7. Update settings for production

```python
DEBUG = False
ALLOWED_HOSTS = ['CristianPaulGuillen.pythonanywhere.com']
```

### 8. Reload the web app

Click the green **Reload** button on the PythonAnywhere Web tab.

---

## Updating the Live Site

Whenever you make changes locally:

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
- Location: Bayawan City, Negros Oriental, PH
- University: Negros Oriental State University — BSINT 3rd Year





