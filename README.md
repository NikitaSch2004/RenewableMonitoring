# Renewable Energy Monitoring Platform

Web platform for monitoring renewable-energy facilities: facility map, forecast data, planned maintenance, file management and an admin panel.
Built by a team of three during the Erasmus summer practice at **Proton Energy Solutions** (Republic of Moldova), summer 2025.

**Stack:** Django + Django REST Framework (JWT auth) · React

> This is a public copy of the team's private repository `Afonia27/RenewableMonitoring`.
> The full commit history is kept, so every commit is still credited to its author.
> The development database, cached files and all credentials were removed from the history.

## Team

| Member | Main areas |
|---|---|
| [@Alickrool](https://github.com/Alickrool) | React frontend, backend |
| [@Afonia27](https://github.com/Afonia27) | Repository owner, frontend, backend |
| [@NikitaSch2004](https://github.com/NikitaSch2004) | Backend (details below) |

## My part (Nikita Schimbătoru)

- **Planned maintenance:** backend models and REST endpoints (`maintenance_views.py`).
- **Files section:** file storage model and file-list API (`filelist_views.py`).
- **Admin panel:** API for the admin panel (`admin_views.py`), superuser handling and the `/me/` endpoint for the current user.
- Changes to authentication helpers (`auth_utils.py`).

## Project layout

```
backend/   Django project "Proton" + app "ProtonApi"
frontend/  React app (proton-app)
```

To run the backend locally, create your own database with `python manage.py migrate` and set your own `SECRET_KEY`, mailbox and portal credentials (they are `REDACTED` in this copy).
