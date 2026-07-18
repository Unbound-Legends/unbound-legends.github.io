# Weblate integration

This directory describes the intended self-hosted Weblate configuration. It contains no credentials and is not a native Weblate configuration import.

- [`components.json`](components.json) is the reviewed component inventory used during setup and audits.
- [`SETUP.md`](SETUP.md) covers deployment, GitHub, access, review, context synchronization, and the pilot.

The translation bridge remains provider-neutral. Weblate-specific API code and credentials stay in the private RPGSessions repository or on the trusted Weblate host.
