# Troubleshooting Guide

## 🔍 Common Issues and Solutions

### Issue 1: Build Errors

#### Error: "Cannot find module"
**Symptoms:** TypeScript errors about missing modules

**Solution:**
```bash
cd ecommerce-app
npm install
```

#### Error: "Module Federation plugin not found"
**Solution:**
```bash
npm install @angular-architects/module-federation --save-dev
```

### Issue 2: Serve Errors

#### Error: "Port already in use"
**Solution:**
```bash
# Kill process on port 4200
lsof -ti:4200 | xargs kill -9

# Or use a different port
ng serve --port 4201
```

#### Error: "webpack.config.js not found"
**Solution:**
Ensure webpack.config.js exists in the root directory and in projects/b2b-app and projects/admin-app

### Issue 3: Runtime Errors

#### Error: "Cannot read property of undefined"
**Check:**
1. All services are properly injected
2. Data is loaded before accessing properties
3. Use optional chaining: `user?.name`

#### Error: "ExpressionChangedAfterItHasBeenCheckedError"
**Solution:**
Use `ChangeDetectorRef` or move logic to `ngAfterViewInit`

### Issue 4: Module Federation Errors

#### Error: "Remote module not loading"
**Check:**
1. All apps are running
2. Correct ports (4200, 4201, 4202)
3. webpack.config.js remotes URLs are correct

#### Error: "Shared module version mismatch"
**Solution:**
Ensure all apps use the same Angular version:
```bash
npm list @angular/core
```

### Issue 5: Authentication Errors

#### Error: "Token expired"
**Solution:**
The auth service automatically refreshes tokens. If it fails, user is logged out.

#### Error: "Unauthorized access"
**Check:**
1. User is logged in
2. User has correct role
3. Route guards are properly configured

## 🛠️ Debugging Steps

### Step 1: Check Build
```bash
cd ecommerce-app
ng build
```

### Step 2: Check TypeScript
```bash
npx tsc --noEmit
```

### Step 3: Check Linting
```bash
ng lint
```

### Step 4: Clear Cache
```bash
rm -rf node_modules
rm -rf dist
rm package-lock.json
npm install
```

### Step 5: Check Angular Version
```bash
ng version
```

## 📊 Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Angular CLI 19+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] Build successful (`ng build`)
- [ ] No TypeScript errors
- [ ] webpack.config.js files exist
- [ ] angular.json properly configured
- [ ] All ports available (4200, 4201, 4202)

## 🔧 Quick Fixes

### Reset Everything
```bash
cd ecommerce-app
rm -rf node_modules dist .angular
npm install
ng build
```

### Update Dependencies
```bash
npm update
```

### Check for Vulnerabilities
```bash
npm audit
npm audit fix
```

## 📝 Known Issues

### 1. Module Federation with Angular 19
- Some features may require Angular 18 for full compatibility
- Use `@angular-architects/module-federation@18.0.0` if issues persist

### 2. Webpack 5 Compatibility
- Ensure webpack is installed: `npm install webpack --save-dev`

### 3. Material Design
- Ensure Material is properly installed: `ng add @angular/material`

## 🆘 Getting Help

If you encounter errors:

1. **Check the error message** - Read it carefully
2. **Check this guide** - Look for similar issues
3. **Check console** - Browser console for runtime errors
4. **Check terminal** - Build/serve errors
5. **Check documentation** - Review the docs in this project

## 📞 Support Resources

- Angular Docs: https://angular.io/docs
- Module Federation: https://webpack.js.org/concepts/module-federation/
- Angular Material: https://material.angular.io/
- Stack Overflow: Tag with `angular`, `module-federation`

## ✅ Success Indicators

Your app is working correctly if:
- ✅ Build completes without errors
- ✅ Serve starts without errors
- ✅ Browser opens to http://localhost:4200
- ✅ Products page loads
- ✅ Can navigate between pages
- ✅ Can add items to cart
- ✅ Can login/register

## 🎯 Next Steps After Fixing Errors

1. Test all routes
2. Test authentication flows
3. Test cart functionality
4. Implement remaining features
5. Add unit tests
6. Add e2e tests
7. Optimize performance
8. Deploy to production