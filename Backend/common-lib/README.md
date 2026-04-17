# Common Library Module

## Overview
Shared library containing common DTOs, utilities, and exception handling for all microservices.

## Contents

### DTOs
- **ApiResponse**: Standard response wrapper for all API endpoints
- **ErrorDetails**: Detailed error information structure
- **PageResponse**: Paginated response wrapper

### Exception Handling
- **GlobalExceptionHandler**: Centralized exception handling
- **ResourceNotFoundException**: For 404 scenarios
- **BusinessException**: For business logic violations

### Logging
- **logback-spring.xml**: Centralized logging configuration
  - Console logging with colored output
  - File-based logging with rotation
  - Separate error log file
  - Async appenders for performance

## Usage

### Add Dependency
```xml
<dependency>
    <groupId>com.ecommerce</groupId>
    <artifactId>common-lib</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

### Using ApiResponse
```java
// Success response
return ResponseEntity.ok(ApiResponse.success(data));

// Success with message
return ResponseEntity.ok(ApiResponse.success(data, "Operation successful"));

// Error response
return ResponseEntity.badRequest()
    .body(ApiResponse.error("Error message"));
```

### Using Exceptions
```java
// Resource not found
throw new ResourceNotFoundException("Product", "id", productId);

// Business exception
throw new BusinessException("INSUFFICIENT_STOCK", "Not enough items in stock");
```

### Pagination
```java
Page<Product> page = productRepository.findAll(pageable);
return ResponseEntity.ok(
    ApiResponse.success(PageResponse.of(page))
);
```

## Features
- Standardized API responses across all services
- Comprehensive exception handling
- Validation error mapping
- Structured logging configuration
- Lombok and MapStruct integration