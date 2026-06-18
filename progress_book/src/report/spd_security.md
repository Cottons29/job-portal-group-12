# 7.1. Security Architecture

Security was treated as a first-class requirement rather than an afterthought.

### Authentication
- **Session-based login** for the standard flow.
- **Passkey (WebAuthn)** login, allowing passwordless authentication backed by
  device credentials.

### Payload encryption
Sensitive authentication traffic is **encrypted (RSA/AES)** at the application
layer, so credentials are protected in transit independently of TLS. Achieving
correct interoperability between the frontend encryption and backend decryption
was one of the project's notable engineering challenges.

### Account recovery
Forgotten passwords are recovered through a **secure email OTP** flow: a
time-limited one-time code is emailed to the user and must be verified before a
reset can complete.

### Authorization
Routes are guarded by **role authorization**, ensuring students cannot reach
employer-only resources and vice versa. This was explicitly validated during QA.

### Transport & CORS
Production traffic is served over **HTTPS**, with **CORS** configured for the
production domains. Resolving SSL certificate mismatches and secure HTTPS routing
was part of hardening the deployment.
