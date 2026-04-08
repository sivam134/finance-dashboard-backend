package com.finance.dashboard.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Finance Dashboard API")
                        .description("""
                                Role-based finance management backend.

                                **Default users (seeded on startup):**
                                | Username | Password   | Role    |
                                |----------|------------|---------|
                                | admin    | admin123   | ADMIN   |
                                | analyst  | analyst123 | ANALYST |
                                | viewer   | viewer123  | VIEWER  |

                                **How to authenticate:**
                                1. Call POST /api/auth/login with credentials below
                                2. Copy the `token` from the response
                                3. Click the **Authorize** button above
                                4. Enter: `Bearer {your_token}`
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Finance Dashboard")
                                .email("admin@demo.com")))
                // Add both localhost and any server
                .servers(List.of(
                        new Server().url("/").description("Current Server (auto-detected)"),
                        new Server().url("http://localhost:8080").description("Local Development")
                ))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Paste your JWT token here")));
    }
}
