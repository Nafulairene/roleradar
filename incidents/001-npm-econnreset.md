# 001: ECONNRESET while scaffolding the project

**Date:** 2026-10-22
**Impact:** Project could not be created. No code affected.

## Symptom
`npm create vite@latest` failed immediately with `npm error code ECONNRESET`.

## Evidence
- npm reported `Invalid response body while trying to fetch https://registry.npmjs.org/create-vite`.
- Node, npm and Git all reported versions, so the toolchain was installed correctly.
- The failure happened during download, before any project files were written.

## Root cause
The network connection to the npm registry dropped mid-download. A transient connectivity issue, not a configuration or code problem.

## Fix
Retried the command. It succeeded.

## Prevention
- On unstable connections, raise npm's retry tolerance: `npm config set fetch-retries 5` and `npm config set fetch-retry-maxtimeout 120000`.
- If it recurs, check `npm config get proxy` and disable any VPN before investigating further.