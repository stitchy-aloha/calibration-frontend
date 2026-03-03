---
id: CHG-001
title: Types & Services Layer Refactor
date: 2026-03-03
author: Antigravity
status: completed
---

## Summary

Extracted all domain interfaces and API logic into dedicated `src/types/` and `src/services/` directories to establish a clean separation of concerns.

## Changes

### New Files: `src/types/`

| File                   | Exported Types                                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tool.types.ts`        | `MedicalTool`, `ToolStatus`, `ToolType`                                                                                                            |
| `calibration.types.ts` | `CalibrationRecord`, `EquipmentDetails`, `LocationDetails`, `EnvironmentData`, `StandardEquipment`, `TestRow`, `ApprovalEvent`, `CalibrationEvent` |
| `inspection.types.ts`  | `DeviceInfo`, `InspectionItem`, `InspectionValue`                                                                                                  |
| `auth.types.ts`        | `AuthUser`, `ApiAuthUser`, `LoginPayload`, `LoginResponse`                                                                                         |
| `index.ts`             | Barrel export — `import type { X } from 'src/types'`                                                                                               |

### New Files: `src/services/`

| File                     | Methods                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| `auth.service.ts`        | `login()`, `getProfile()`                                           |
| `tool.service.ts`        | `getAll()`, `getById()`, `create()`, `update()`, `remove()`         |
| `calibration.service.ts` | `getAll()`, `getRecord()`, `saveRecord()`, `saveDraft()`            |
| `approval.service.ts`    | `getAll()`, `approve()`, `reject()`                                 |
| `index.ts`               | Barrel export — `import { CalibrationService } from 'src/services'` |

### Modified: Stores — Removed Duplicate Declarations

| Store                 | Removed                                 | Now Imports From |
| --------------------- | --------------------------------------- | ---------------- |
| `stores/tools.ts`     | `ToolStatus`, `ToolType`, `MedicalTool` | `src/types`      |
| `stores/approvals.ts` | `ApprovalEvent`                         | `src/types`      |
| `stores/schedule.ts`  | `CalibrationEvent`                      | `src/types`      |

## Notes

- Services use mock data / empty stubs until backend endpoints are finalized.
- Stores still contain mock data arrays — these will be replaced by service calls once real APIs are ready.
