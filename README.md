# Modern Laravel + React Application

<p align="center">
  <img src="public/images/logo.png" width="400" alt="Application Logo">
</p>

## 🚀 Tech Stack

### Backend
- **Framework**: Laravel 12.x
- **PHP Version**: ^8.2
- **Key Packages**:
  - Laravel Sanctum for API Authentication
  - Laravel Breeze for Authentication Scaffolding
  - Inertia.js for Server-Side Rendering
  - Spatie Sitemap for SEO
  - Laravel Pail for Log Management

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3
- **Key Libraries**:
  - Radix UI for Accessible Components
  - React Query for Data Fetching
  - React Hook Form for Form Management
  - Zod for Schema Validation
  - Framer Motion for Animations
  - Recharts for Data Visualization

## 📋 Prerequisites

- PHP 8.2 or higher
- Node.js 18 or higher
- Composer
- MySQL/PostgreSQL/SQLite
- Redis (optional, for caching)

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AbdelazizS/union.git
   cd union
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install JavaScript dependencies:
   ```bash
   npm install
   ```

4. Set up environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. Configure your database in `.env`

6. Run migrations:
   ```bash
   php artisan migrate
   ```

7. Start the development servers:
   ```bash
   composer dev
   ```

## 🏗️ Project Structure

```
├── app/                 # Backend application code
│   ├── Http/           # Controllers, Middleware, Requests
│   ├── Models/         # Eloquent models
│   └── Services/       # Business logic services
├── resources/          # Frontend resources
│   ├── js/            # React components and logic
│   └── css/           # Styles
├── routes/            # Application routes
├── tests/             # Test suites
└── database/          # Migrations and seeders
```

## 🚀 Development

### Running the Development Server

```bash
composer dev
```

This command runs:
- Laravel development server
- Vite development server
- Queue worker
- Log watcher

### Running Tests

```bash
composer test
```

## 🔧 Available Scripts

- `composer dev` - Start all development servers
- `composer test` - Run the test suite
- `npm run build` - Build frontend assets
- `php artisan migrate` - Run database migrations
- `php artisan queue:listen` - Start queue worker

## 📚 Documentation

### API Documentation

API endpoints are documented in `routes/api.php`. The application uses Laravel Sanctum for API authentication.

### Frontend Components

The application uses a component-based architecture with Radix UI primitives. Key components are located in `resources/js/Components`.

## 🔐 Security

- All forms are protected against CSRF attacks
- API endpoints are secured with Sanctum
- Input validation using Laravel's validation system
- SQL injection protection through Eloquent ORM

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Laravel Team
- React Team
- All contributors and maintainers
