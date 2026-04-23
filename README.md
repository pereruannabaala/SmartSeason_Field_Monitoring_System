# SmartSeason: Field Monitoring System
 SmartSeason is a full-stack field monitoring application designed to bridge the gap between agricultural administrators and field agents. Built with a **Django REST Framework** backend and a **React** frontend, it provides real-time tracking of crop stages, automated status calculations, and streamlined observation logging.

## Known Behavior

You may experience slight delays when loading data or seeing recent updates.

This application is deployed on Vercel, which uses a serverless architecture. Because serverless environments do not support persistent local storage, the project uses an external database hosted on Railway.

As a result, data requests involve network calls between Vercel and Railway, which can introduce minor latency, especially during database synchronization or updates.

Please allow a few moments for changes to reflect.
## Demo credentials
For testing and review purposes, use the following accounts to explore the different role-based interfaces:
| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `pereruan` | `Pn@0757364069` | Full access: Manage fields, assign agents, and view global analytics. |
| **Field Agent** | `Telvin` | `tevo@254` | Restricted access: Update growth stages and log observations for assigned plots. |
| **Field Agent** | `Pauline` | `milan@254` | Restricted access: Update growth stages and log observations for assigned plots. |


 ## Features
- **Role-Based Access Control**: Distinct interfaces and permissions for Admins and Agents.
- **Dynamic Dashboard**: Real-time statistics on field health and growth progress.
- **Observation Logging**: Agents can record field observations that are instantly visible to administrators.
- **Secure Authentication**: JWT-based login with integrated password visibility toggles and protected routes.

## Automated Status Logic
The system eliminates manual status tagging by calculating health metrics on the fly via the Django backend. This ensures the "Source of Truth" is centralized.

| Status | Logic Criteria | Indicator |
| :--- | :--- | :--- |
| **Completed** | Triggered automatically when the crop stage reaches `Harvested`. | 🔵 Blue |
| **At Risk** | Triggered if notes contain keywords like *"pest"*, *"disease"*, or *"wither"*, or if no updates are logged for **30+ days**. | 🟠 Orange |
| **Active** | The default state for healthy, progressing crops (`Planted`, `Growing`, or `Ready`). | 🟢 Green |

## Tech Stack
- **Frontend**: React
- **Backend**: Django, Django REST Framework (DRF), JWT Authentication.
- **Database**: SQLite (Development) 

## Installation & Local Setup

**1.Backend Configuration**

Navigate to the `/backend` folder:

```
# Create and activate environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Sync Database
python manage.py makemigrations
python manage.py migrate

# Start Server
python manage.py runserver
```

**2. Frontend Configuration**
Navigate to the `/frontend` folder:
```
# Install packages
npm install

# Launch Application
npm run dev
```

## Developed By;
- Pereruan Nabaala
- pereruannabaala@gmail.com