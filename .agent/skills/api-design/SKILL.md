# Skill: REST API Contract Designer

## When to Use

Use this skill when designing new endpoints, reviewing API contracts, or generating OpenAPI schemas.

## Design Constraints

1. Path Naming: Always use plural nouns. No verbs in URLs (e.g., Use POST /books, NOT POST /createBook).
2. Versioning: Enforce path versioning by prefixing paths with `/v1/`.
3. Pagination: Every collection endpoint (returning arrays) must include query parameters for `limit` and `starting_after` (cursor-based).
4. Error Handling: All non-2xx responses must match the RFC 7807 Problem Details schema.

## Verification Checklist

Before providing the output, verify that:

- Every field has an explicit data type and description.
- Path parameters are explicitly mapped to resource identifiers.
- A 429 Too Many Requests status code is included with rate-limiting headers.
