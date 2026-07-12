# Artifact Signing Contract (Issue #66)

This document defines the first-party artifact signing contract consumed by DevHolm runtime verification.

Important scope note:
- this repository is still scaffold/docs-only
- runtime installation from this repository is still disabled in current catalog entries
- no production private keys are stored in this repository

## Purpose

When a plugin entry is promoted from `catalog-contract-ready` to `production-eligible`, its immutable artifact metadata and signature envelope must satisfy the DevHolm Issue #66 trust model.

## Canonical signed payload

The signed payload schema version is `v1` and includes:

- plugin ID
- plugin version
- publisher ID
- artifact format
- artifact SHA-256
- artifact compressed size when declared
- immutable artifact identity (artifact URL or source/ref identity)
- compatibility metadata from catalog contract fields
- key ID used for signing
- payload issue timestamp

Payload canonicalization requirements:

- stable key ordering
- normalized Unicode handling
- deterministic JSON bytes
- no reliance on ambient serializer ordering

## Signature envelope

Runtime-ready artifacts must provide:

- `status: provided`
- `algorithm: Ed25519`
- `keyId`
- `signedPayloadVersion: v1`
- `signature` (base64)
- `signedAt` ISO timestamp

Optional forward-compatible metadata:

- `transparencyLogRef`
- `certificateChain`

## Trusted key registry contract

DevHolm runtime uses an explicit trusted-key registry supplied by application configuration.

Each key record requires:

- unique `keyId`
- `algorithm: Ed25519`
- valid public key material
- key status: `pending | active | retired | revoked`
- permitted first-party publisher IDs
- intended usage `marketplace-artifact-signing`
- metadata version `1`

Invalid registry records are rejected fail-closed.

## Key lifecycle policy

- `pending`: never verifies runtime artifacts
- `active`: may verify signatures within validity window
- `retired`: may verify historical signatures signed before retirement
- `revoked`: blocked for runtime verification

## Publisher binding

Signature trust requires both:

- signed payload publisher ID matches catalog publisher
- signing key permits that publisher ID

This prevents cross-publisher signature reuse.

## Unsigned artifact policy

Runtime-ready entries cannot be unsigned.

Scaffold entries may remain:

- `installReadiness: catalog-contract-ready`
- `artifact.readiness: planned`
- `artifact.signature.status: not-provided`

## Publishing boundary and private-key safety

This repository intentionally does not contain:

- production private keys
- signing automation with private key material
- fabricated production signatures

Release signing must happen in a secure release workflow outside this repository.
