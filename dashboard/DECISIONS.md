# Design Decisions

## Why JWT over Sessions?
JWT is stateless — no server memory needed. Better for REST APIs
and future mobile/frontend clients.

## Why Soft Delete?
Financial records must be auditable. Hard delete loses history.
The 'deleted' flag keeps records in DB but hides from queries.

## Why BigDecimal for amounts?
double/float have precision errors. 0.1 + 0.2 = 0.30000000000000004.
BigDecimal gives exact decimal arithmetic required for money.

## Why H2 for dev?
Zero setup — any developer clones and runs immediately.
PostgreSQL used in prod for ACID guarantees and concurrency.

## Why ROLE-based not permission-based?
Fixed tiers (VIEWER/ANALYST/ADMIN) match the use case exactly.
Simpler to audit and Spring Security supports it natively.

## What I would add with more time
- Pagination on transaction listing
- Refresh token support
- Unit tests with JUnit 5 + Mockito
- Rate limiting on auth endpoints
- CSV export for financial reports
