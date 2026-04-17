# E-Commerce Microfrontend Platform

A modern e-commerce platform built with **Angular 17+** using **Native Federation** for true microfrontend architecture.

## 🏗️ Architecture

This application uses **Microfrontend Architecture** with Native Federation, where each feature is an independent, deployable application.

### Applications

| Application | Port | Description |
|------------|------|-------------|
| **Shell** | 4200 | Main orchestrator app that loads all MFEs |
| **Product MFE** | 4201 | Product listing and details |
| **Cart MFE** | 4202 | Shopping cart management |
| **Checkout MFE** | 4203 | Checkout process |
| **Order MFE** | 4204 | Order history and management |
| **Auth MFE** | 4205 | Authentication (login, register, OTP, password reset) |
| **User MFE** | 4206 | User profile management |

### Technology Stack

- **Angular 17+** - Modern Angular with standalone components
- **Native Federation** - Runtime module federation (esbuild-based)
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming
- **Angular Material** - UI components
- **SCSS** - Styling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+

### Installation

```bash
npm install
```

### Running the Application

**Start all microfrontends:**
```bash
npm run start:all-mfe-full
```

This starts all 7 applications concurrently:
- Shell: http://localhost:4200
- Product MFE: http://localhost:4201
- Cart MFE: http://localhost:4202
- Checkout MFE: http://localhost:4203
- Order MFE: http://localhost:4204
- Auth MFE: http://localhost:4205
- User MFE: http://localhost:4206

**Start individual applications:**
```bash
npm run start:shell          # Shell app only
npm run start:product-mfe    # Product MFE only
npm run start:cart-mfe       # Cart MFE only
npm run start:checkout-mfe   # Checkout MFE only
npm run start:order-mfe      # Order MFE only
npm run start:auth-mfe       # Auth MFE only
npm run start:user-mfe       # User MFE only
```

## 📁 Project Structure

```
ecommerce-app/
├── src/                          # Shell application
│   ├── app/
│   │   ├── app.routes.ts        # Dynamic MFE loading
│   │   └── guards/              # Auth guards
│   └── main.ts                  # Native Federation init
├── projects/
│   ├── product-mfe/             # Product microfrontend
│   ├── cart-mfe/                # Cart microfrontend
│   ├── checkout-mfe/            # Checkout microfrontend
│   ├── order-mfe/               # Order microfrontend
│   ├── auth-mfe/                # Auth microfrontend
│   ├── user-mfe/                # User microfrontend
│   └── shared/                  # Shared library
├── public/
│   └── federation.manifest.json # MFE registry
└── angular.json                 # Workspace configuration
```

### Each MFE Structure

```
projects/{mfe-name}/
├── src/
│   ├── main.ts                  # Federation initialization
│   ├── bootstrap.ts             # App bootstrap
│   ├── index.html               # HTML template
│   ├── styles.scss              # Styles
│   └── lib/
│       ├── {feature}.routes.ts  # Exposed routes
│       └── components/          # Feature components
├── federation.config.js         # Federation configuration
└── tsconfig.app.json           # TypeScript config
```

## 🔧 Key Features

### Native Federation

Each MFE exposes its routes via Native Federation:

```typescript
// Shell app dynamically loads MFEs
loadRemoteModule('productMfe', './Routes').then(m => m.PRODUCT_ROUTES)
```

### Shared Services

Common services are shared across all MFEs:
- **AuthService** - Authentication and user management
- **CartService** - Shopping cart state
- **MockDataService** - Mock data for development

### Route Guards

- **authGuard** - Protects authenticated routes
- **guestGuard** - Restricts routes for logged-in users

## 🧪 Development

### Adding a New MFE

1. Create MFE structure in `projects/`
2. Add federation config
3. Update `angular.json`
4. Register in `federation.manifest.json`
5. Add routes in shell app

### Building for Production

```bash
ng build --configuration production
```

Each MFE builds independently and can be deployed separately.

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE_OVERVIEW.md)
- [Module Federation Guide](./MODULE_FEDERATION_COMPLETE_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

## 🎯 Benefits of This Architecture

1. **Independent Deployment** - Deploy MFEs separately
2. **Team Autonomy** - Teams work on isolated codebases
3. **Technology Flexibility** - Different versions/frameworks per MFE
4. **Scalability** - Scale individual MFEs based on load
5. **Faster Builds** - Build only changed MFEs
6. **Runtime Loading** - Load MFEs on-demand

## 🔐 Authentication

Mock authentication is implemented with the following test credentials:

- **Email**: test@example.com
- **Password**: password123
- **OTP**: 123456 (for phone login)

## 📝 License

MIT

---

**Built with ❤️ using Angular Native Federation**