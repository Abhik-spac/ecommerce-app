# 🚀 How to Run the Microfrontend eCommerce Platform

## Quick Start - Single Command

### Run B2C Storefront (Recommended for Development)
```bash
npm start
# OR
npm run start:b2c:full
```

This single command will start:
- ✅ B2C Shell App (http://localhost:4200)
- ✅ Product MFE (http://localhost:4201)
- ✅ Cart MFE (http://localhost:4202)
- ✅ Checkout MFE (http://localhost:4203)
- ✅ Order MFE (http://localhost:4204)
- ✅ Auth MFE (http://localhost:4205)
- ✅ User MFE (http://localhost:4206)

**Wait for all 7 servers to start (takes ~30-60 seconds), then open http://localhost:4200**

---

## Run Other Applications

### B2B Storefront
```bash
npm run start:b2b:full
```
Opens at: http://localhost:4300

Starts B2B shell + all required MFEs

### Admin Panel
```bash
npm run start:admin:full
```
Opens at: http://localhost:4400

Starts Admin shell + Product, Order, and User MFEs

### All Applications at Once
```bash
npm run start:all
```
Starts all 3 shell apps + all 6 MFEs (10 servers total)

---

## Understanding the Architecture

### Why Multiple Servers?

This is a **true microfrontend architecture** using Module Federation:

1. **Shell Apps** (B2C, B2B, Admin) - Main applications that load features dynamically
2. **MFEs** (Product, Cart, etc.) - Independent feature modules that run on separate ports

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  B2C Shell (localhost:4200)                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Loads features dynamically from MFEs:               │  │
│  │  • /products → Product MFE (4201)                    │  │
│  │  • /cart → Cart MFE (4202)                           │  │
│  │  • /checkout → Checkout MFE (4203)                   │  │
│  │  • /orders → Order MFE (4204)                        │  │
│  │  • /login → Auth MFE (4205)                          │  │
│  │  • /profile → User MFE (4206)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Benefits:**
- ✅ Independent deployment of features
- ✅ Team autonomy (different teams can work on different MFEs)
- ✅ Technology flexibility (each MFE can use different versions)
- ✅ Scalability (load only what you need)

---

## Run Individual Components (Advanced)

### Shell Apps Only
```bash
npm run start:b2c      # B2C at 4200
npm run start:b2b      # B2B at 4300
npm run start:admin    # Admin at 4400
```

### Individual MFEs
```bash
npm run start:product   # Product MFE at 4201
npm run start:cart      # Cart MFE at 4202
npm run start:checkout  # Checkout MFE at 4203
npm run start:order     # Order MFE at 4204
npm run start:auth      # Auth MFE at 4205
npm run start:user      # User MFE at 4206
```

**Note:** Shell apps won't work properly without their required MFEs running!

---

## Production Build

### Build All Projects
```bash
npm run build:all
```

Builds:
- B2C Shell App
- B2B Shell App
- Admin Shell App

### Build Individual Apps
```bash
npm run build:b2c      # Build B2C
npm run build:b2b      # Build B2B
npm run build:admin    # Build Admin
```

### Build MFEs
```bash
npm run build:mfe      # Build shared library + all MFEs + B2C shell
```

---

## Troubleshooting

### Issue: "Cannot GET /products" or blank page

**Solution:** Make sure all required MFEs are running!

For B2C, you need:
```bash
npm run start:b2c:full
```

### Issue: Port already in use

**Solution:** Kill the process using that port:
```bash
# macOS/Linux
lsof -ti:4200 | xargs kill -9

# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Issue: Slow startup

**Solution:** This is normal! Starting 7+ Angular dev servers takes time.
- First startup: ~60 seconds
- Subsequent startups: ~30 seconds

### Issue: Module Federation errors

**Solution:** Ensure all MFEs are running before navigating to their routes.

---

## Development Workflow

### Recommended Setup

**Terminal 1:** Run the full B2C app
```bash
npm run start:b2c:full
```

**Terminal 2:** Make changes to code
- Changes auto-reload via hot module replacement
- Each MFE reloads independently

### Working on Specific Features

If you're only working on the Product feature:

**Terminal 1:** Run B2C shell
```bash
npm run start:b2c
```

**Terminal 2:** Run Product MFE
```bash
npm run start:product
```

**Terminal 3:** Run other required MFEs
```bash
npm run start:cart
npm run start:auth
# etc.
```

---

## Port Reference

| Application | Port | URL |
|------------|------|-----|
| B2C Shell | 4200 | http://localhost:4200 |
| Product MFE | 4201 | http://localhost:4201 |
| Cart MFE | 4202 | http://localhost:4202 |
| Checkout MFE | 4203 | http://localhost:4203 |
| Order MFE | 4204 | http://localhost:4204 |
| Auth MFE | 4205 | http://localhost:4205 |
| User MFE | 4206 | http://localhost:4206 |
| B2B Shell | 4300 | http://localhost:4300 |
| Admin Shell | 4400 | http://localhost:4400 |

---

## Testing the Application

### Test User Credentials

**Email/Password Login:**
- Email: `test@example.com`
- Password: `password123`

**OTP Login:**
- Mobile: `9876543210`
- OTP: `123456`

**Social Login:**
- Click "Login with Google" (mock implementation)

### Test Features

1. **Browse Products:** Navigate to http://localhost:4200/products
2. **Add to Cart:** Click "Add to Cart" on any product
3. **Checkout:** Go to cart and click "Proceed to Checkout"
4. **View Orders:** After placing order, go to "My Orders"
5. **Profile:** Update your profile and addresses

---

## Next Steps

1. **Start Development:** `npm start`
2. **Open Browser:** http://localhost:4200
3. **Login:** Use test credentials above
4. **Explore:** Browse products, add to cart, checkout!

---

## Need Help?

- Check `IMPLEMENTATION_SUMMARY.md` for architecture details
- Check `QUICK_START.md` for feature overview
- Check `MICROFRONTEND_CONVERSION_GUIDE.md` for MFE architecture

**Happy Coding! 🚀**