package com.finance.dashboard.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()

                // Apply JWT globally
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))

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

                                **Authentication flow:**
                                1. POST /api/auth/login
                                2. Copy token
                                3. Click Authorize
                                4. Use: Bearer {token}
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Your Name")
                                .email("your@email.com")))

                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT Authorization header using Bearer scheme")));
    }
}