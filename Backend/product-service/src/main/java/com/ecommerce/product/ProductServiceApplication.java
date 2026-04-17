package com.ecommerce.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Product Service Application
 * Manages product catalog, categories, and product information
 */
@SpringBootApplication(scanBasePackages = {"com.ecommerce.product", "com.ecommerce.common"})
@EnableDiscoveryClient
@EnableCaching
public class ProductServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductServiceApplication.class, args);
    }
}

// Made with Bob
