# Architecture Overview

## Microfrontend Architecture

This e-commerce platform implements a **true microfrontend architecture** using Angular 17+ with Native Federation. Each feature is an independent, deployable application that can be developed, tested, and deployed separately.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (localhost:4200)                 │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Shell Application                      │    │
│  │  - App orchestrator                                 │    │
│  │  - Route management                                 │    │
│  │  - Dynamic MFE loading                             │    │
│  │  - Auth guards                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           │ loadRemoteModule()              │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Native Federation Runtime                   │  │
│  │  - Loads remoteEntry.json from each MFE             │  │
│  │  - Manages shared dependencies                       │  │
│  │  - Handles module resolution                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Product MFE  │  │  Cart MFE    │  │ Checkout MFE │
│ Port: 4201   │  │ Port: 4202   │  │ Port: 4203   │
└──────────────┘  └──────────────┘  └──────────────┘
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Order MFE   │  │  Auth MFE    │  │  User MFE    │
│ Port: 4204   │  │ Port: 4205   │  │ Port: 4206   │
└──────────────┘  └──────────────┘  └──────────────┘
                           │
                           ▼
                  ┌──────────────┐
                  │ Shared Lib   │
                  │ - Services   │
                  │ - Models     │
                  │ - Utils      │
                  └──────────────┘
```

## Components

### 1. Shell Application (Port 4200)

**Purpose**: Main orchestrator that loads and coordinates all microfrontends.

**Responsibilities**:
- Route management and navigation
- Dynamic MFE loading via Native Federation
- Authentication guards
- Global layout (if any)

**Key Files**:
- `src/app/app.routes.ts` - Dynamic route configuration
- `src/main.ts` - Native Federation initialization
- `public/federation.manifest.json` - MFE registry

### 2. Microfrontends

Each MFE is an independent Angular application:

#### Product MFE (Port 4201)
- Product listing
- Product details
- Product search/filter

#### Cart MFE (Port 4202)
- Shopping cart management
- Add/remove items
- Update quantities

#### Checkout MFE (Port 4203)
- Checkout process
- Address management
- Payment processing

#### Order MFE (Port 4204)
- Order history
- Order details
- Order tracking

#### Auth MFE (Port 4205)
- Email/password login
- User registration
- OTP-based login
- Password reset

#### User MFE (Port 4206)
- User profile
- Account settings
- Preferences

### 3. Shared Library

**Purpose**: Common code shared across all MFEs.

**Contents**:
- **Services**: AuthService, CartService, MockDataService
- **Models**: User, Product, Order interfaces
- **Utilities**: Common helper functions

**Location**: `projects/shared/`

## Native Federation

### How It Works

1. **Build Time**:
   - Each MFE builds independently
   - Generates `remoteEntry.json` with exposed modules
   - Defines shared dependencies

2. **Runtime**:
   - Shell app loads `federation.manifest.json`
   - When user navigates, shell calls `loadRemoteModule()`
   - Native Federation fetches MFE's `remoteEntry.json`
   - Loads required modules dynamically
   - Shares common dependencies (Angular, RxJS, etc.)

### Configuration

Each MFE has a `federation.config.js`:

```javascript
module.exports = withNativeFederation({
  name: 'product-mfe',
  exposes: {
    './Routes': './projects/product-mfe/src/lib/product.routes.ts'
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true })
  }
});
```

### Federation Manifest

`public/federation.manifest.json` maps MFE names to URLs:

```json
{
  "productMfe": "http://localhost:4201/remoteEntry.json",
  "cartMfe": "http://localhost:4202/remoteEntry.json",
  ...
}
```

## Data Flow

### Authentication Flow

```
User Login
    │
    ▼
Auth MFE (4205)
    │
    ▼
AuthService (Shared)
    │
    ├─► Set user state
    ├─► Store token
    └─► Emit currentUser$
         │
         ▼
    All MFEs subscribe
    to auth state changes
```

### Cart Flow

```
Add to Cart
    │
    ▼
Product MFE (4201)
    │
    ▼
CartService (Shared)
    │
    ├─► Update cart state
    └─► Emit cart$
         │
         ▼
    Cart MFE (4202)
    displays updated cart
```

## Communication Between MFEs

### 1. Shared Services (Recommended)

MFEs communicate via shared services with RxJS observables:

```typescript
// AuthService in shared library
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  login(email: string, password: string) {
    // Login logic
    this.currentUserSubject.next(user);
  }
}
```

### 2. Route Parameters

Pass data via URL parameters:

```typescript
// Navigate with data
this.router.navigate(['/products', productId]);

// Receive in target MFE
this.route.params.subscribe(params => {
  const id = params['id'];
});
```

### 3. Local Storage

For persistent data across page reloads:

```typescript
localStorage.setItem('currentUser', JSON.stringify(user));
```

## Deployment Strategy

### Development

All MFEs run locally on different ports:
```bash
npm run start:all-mfe-full
```

### Production

Each MFE can be deployed independently:

1. **Build each MFE**:
   ```bash
   ng build product-mfe --configuration production
   ng build cart-mfe --configuration production
   # ... etc
   ```

2. **Deploy to separate servers/CDNs**:
   - product-mfe → https://product.example.com
   - cart-mfe → https://cart.example.com
   - etc.

3. **Update federation.manifest.json**:
   ```json
   {
     "productMfe": "https://product.example.com/remoteEntry.json",
     "cartMfe": "https://cart.example.com/remoteEntry.json"
   }
   ```

4. **Deploy shell app** with updated manifest

## Benefits

### 1. Independent Deployment
- Deploy MFEs without affecting others
- Faster release cycles
- Reduced deployment risk

### 2. Team Autonomy
- Teams own entire MFE lifecycle
- Independent technology choices
- Parallel development

### 3. Scalability
- Scale individual MFEs based on load
- Optimize resources per feature
- Better performance

### 4. Maintainability
- Smaller, focused codebases
- Easier to understand and modify
- Isolated testing

### 5. Technology Flexibility
- Different Angular versions per MFE (if needed)
- Gradual upgrades
- Experiment with new features

## Trade-offs

### Complexity
- More infrastructure to manage
- Coordination between teams needed
- Shared dependency management

### Performance
- Initial load may be slower (multiple HTTP requests)
- Mitigated by caching and CDN

### Testing
- Integration testing more complex
- Need to test MFE interactions
- E2E tests span multiple apps

## Best Practices

1. **Keep MFEs focused** - Single responsibility per MFE
2. **Minimize shared state** - Use observables for communication
3. **Version shared library carefully** - Breaking changes affect all MFEs
4. **Monitor performance** - Track bundle sizes and load times
5. **Document APIs** - Clear contracts between MFEs
6. **Automate deployment** - CI/CD for each MFE
7. **Test integration** - Verify MFE interactions work correctly

## Future Enhancements

- Add B2B and Admin MFEs (already configured in manifest)
- Implement server-side rendering (SSR)
- Add micro-caching strategies
- Implement feature flags per MFE
- Add monitoring and analytics per MFE

---

**This architecture provides a scalable, maintainable foundation for building large-scale e-commerce applications.**