#  Finance Dashboard API

A role-based **Finance Management Backend** built using **Spring Boot 3**, **JWT Authentication**, and REST APIs.  
This project allows users to manage financial transactions with secure role-based access control.

---

##  Tech Stack

| Layer        | Technology                          |
|-------------|------------------------------------|
| Framework    | Spring Boot 3.2.5                  |
| Security     | Spring Security + JWT              |
| Database     | H2 (Development)                   |
| API Docs     | Swagger UI                         |
| Build Tool   | Maven                             |
| Language     | Java                              |

---

##  Features

-  JWT-based Authentication & Authorization  
-  Role-based access control (ADMIN, ANALYST, VIEWER)  
-  Transaction management (CRUD operations)  
-  Dashboard analytics (summary & trends)  
-  Interactive API documentation using Swagger  
-  In-memory H2 database for easy testing  

---

##  Quick Start

### Clone the repository
```bash
git clone https://github.com/sivam134/finance-dashboard-backend.git
cd finance-dashboard-backend/dashboard



## Run the application

./mvnw spring-boot:run


##Access URLs (Codespaces)
Service	URL

Swagger UI	https://refactored-train-x5qg95xw7phvjr4-8080.app.github.dev/swagger-ui.html

API Docs	https://refactored-train-x5qg95xw7phvjr4-8080.app.github.dev/v3/api-docs

H2 Console	https://refactored-train-x5qg95xw7phvjr4-8080.app.github.dev/h2-console

Frontend	https://refactored-train-x5qg95xw7phvjr4-8080.app.github.dev/index.html


## Transactions

Method	  Endpoint	            Role
GET	/api/transactions/ALL
POST	/api/transactions 	     ADMIN
PUT	/api/transactions/{id}	   ADMIN
DELETE	/api/transactions/{id}	ADMIN

## Dashboard

Method  	Endpoint	           Role
GET	/api/dashboard/summary	ADMIN, ANALYST
GET	/api/dashboard/trends	ADMIN, ANALYST

## User Management

Method   	Endpoint	                 Role
GET   	/api/users	                ADMIN
PATCH	  /api/users/{id}/role	      ADMIN
PATCH	/api/users/{id}/toggle-status	ADMIN


## File Structure 
src/
 ├── main/
 │   ├── java/com/finance/dashboard/
 │   │   ├── config/
 │   │   ├── controller/
 │   │   ├── service/
 │   │   ├── repository/
 │   │   ├── security/
 │   │   └── model/
 │   └── resources/
 │       ├── static/
 │       └── application.properties
