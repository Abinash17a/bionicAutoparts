# Security

The API validates JSON content type, session ID format, message length, request size, CORS origins, and configuration. Responses include request IDs and basic security headers. Error responses use stable codes and do not expose stack traces, prompts, credentials, or database details.

`AUTH_REQUIRED=false` is development mode. When enabled, the current hook requires an Authorization header; production website authentication must validate that credential at the application boundary. Rate limiting is process-local and must be shared for multi-instance deployments. No Supabase or external inventory integration is included.
