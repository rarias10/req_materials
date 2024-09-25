# Material Request Management Application

This application allows users (teachers) to make requests for materials or equipment, and administrators can manage and fulfill those requests.

## Features

- **User Authentication**: Teachers and administrators can log in to manage their requests.
- **Request Management**: Users can create requests for materials or equipment, and administrators can view and approve/deny them.
- **Item Management**: Each request can have multiple items, categorized by type (material or equipment).
- **Session Management**: Persistent login sessions using `express-session` and `passport`.
- **CSRF Protection**: CSRF protection to ensure secure form submissions.

## Prerequisites

Make sure you have the following installed:

- Node.js (version 14.x or higher)
- PostgreSQL (version 12.x or higher)
- npm (version 6.x or higher)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/req_materials.git
cd req_materials
