package com.ecommerce.gateway.controller;

import com.ecommerce.common.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Fallback controller for circuit breaker
 * Provides fallback responses when services are unavailable
 */
@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<Void>> productServiceFallback() {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error("Product service is temporarily unavailable. Please try again later."));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Void>> userServiceFallback() {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error("User service is temporarily unavailable. Please try again later."));
    }

    @GetMapping("/cart")
    public ResponseEntity<ApiResponse<Void>> cartServiceFallback() {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error("Cart service is temporarily unavailable. Please try again later."));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Void>> orderServiceFallback() {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error("Order service is temporarily unavailable. Please try again later."));
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<Void>> paymentServiceFallback() {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error("Payment service is temporarily unavailable. Please try again later."));
    }

    @GetMapping("/inventory")
    public ResponseEntity<ApiResponse<Void>> inventoryServiceFallback() {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error("Inventory service is temporarily unavailable. Please try again later."));
    }

    @GetMapping("/cms")
    public ResponseEntity<ApiResponse<Void>> cmsServiceFallback() {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error("CMS service is temporarily unavailable. Please try again later."));
    }
}

// Made with Bob
