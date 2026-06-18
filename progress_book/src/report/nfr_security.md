# 3.2.3. Security

- **Strong authentication.** Both session-based and passkey (WebAuthn)
  authentication are supported, reducing reliance on passwords.
- **Encrypted payloads.** Sensitive authentication traffic is encrypted (RSA/AES)
  so credentials are not exposed in transit even before TLS terminates at the
  application layer.
- **Secure recovery.** Password recovery requires a time-limited email OTP.
- **Role authorization.** Routes are guarded so students and employers can only
  access resources appropriate to their role.
- **Transport security.** Production traffic is served over HTTPS with correctly
  configured CORS for the production domains.

Security is treated in depth in [Section 7.1](./spd_security.md).
