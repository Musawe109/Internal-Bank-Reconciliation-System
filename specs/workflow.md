# Workflow Rendering & State Control

**Feature Branch**: `001-frontend-ui-contracts`  
**Created**: 2026-02-19  
**Status**: Draft  
**Parent Spec**: [001-frontend-ui-contracts/spec.md](./001-frontend-ui-contracts/spec.md)

## Purpose

Define how workflow states affect UI rendering, including visual indicators, button availability, and user interaction rules.

## Workflow States

The reconciliation workflow follows a strict state machine with 5 states:

| State | Display Name | Description |
|-------|--------------|-------------|
| `DRAFT` | Draft | Initial state; reconciliation being prepared |
| `PROCESSING` | Processing | System is reconciling transactions |
| `PENDING_APPROVAL` | Pending Approval | Awaiting approver review |
| `APPROVED` | Approved | Final approved state |
| `REJECTED` | Rejected | Returned for corrections |

## UI Behavior Rules

### Draft

**User Permissions**:
- Full edit access to reconciliation data
- CSV upload allowed (can replace existing upload)
- Manual overrides allowed without restrictions

**UI Indicators**:
- Status badge: Gray or neutral color
- Banner: "Draft - Not yet submitted"

**Available Actions**:
| Action | Available | Notes |
|--------|-----------|-------|
| Edit transactions | ✅ Yes | All fields editable |
| Manual override | ✅ Yes | Reason still required |
| Upload new CSV | ✅ Yes | Replaces existing upload |
| Submit for approval | ✅ Yes | Transitions to Processing |
| Delete reconciliation | ✅ Yes | With confirmation |

**Button State**:
- "Submit for Approval" - **Enabled**
- "Approve" - Hidden (not available to current user)
- "Reject" - Hidden (not available to current user)
- "Save Draft" - **Enabled** (auto-save also active)

---

### Processing

**User Permissions**:
- No edits allowed (system is working)
- No manual overrides
- No CSV upload changes

**UI Indicators**:
- Status badge: Blue with animated spinner icon
- Banner: "Processing reconciliation..."
- Loading overlay on transaction table

**Available Actions**:
| Action | Available | Notes |
|--------|-----------|-------|
| Edit transactions | ❌ No | System is processing |
| Manual override | ❌ No | Wait for completion |
| Upload new CSV | ❌ No | Wait for completion |
| Submit for approval | ❌ No | Already in progress |
| Cancel processing | ⚠️ Conditional | Only if processing > 5 minutes |

**Button State**:
- "Submit for Approval" - **Disabled** (processing)
- "Approve" - Hidden
- "Reject" - Hidden
- Loading spinner visible on submit button

**Note**: All UI interactions that modify data are blocked until state transitions to Pending Approval or returns to Draft (on error).

---

### Pending Approval

**User Permissions**:
- No edits allowed (awaiting approval)
- No manual overrides
- No CSV upload changes
- Can view all data

**UI Indicators**:
- Status badge: Amber/Yellow with clock icon
- Banner: "Pending approval - Awaiting reviewer"
- Approver name displayed (if assigned)

**Available Actions**:
| Action | Available | Notes |
|--------|-----------|-------|
| Edit transactions | ❌ No | Locked for approval |
| Manual override | ❌ No | Locked for approval |
| Upload new CSV | ❌ No | Locked for approval |
| Submit for approval | ❌ No | Already submitted |
| Withdraw submission | ✅ Yes | Returns to Draft |

**Button State**:
- "Submit for Approval" - **Disabled** (already submitted)
- "Approve" - **Enabled** (for users with approver role)
- "Reject" - **Enabled** (for users with approver role)
- "Withdraw" - **Enabled** (for submitter, returns to Draft)

---

### Approved

**User Permissions**:
- Fully locked (terminal state)
- Read-only access
- Audit log viewable

**UI Indicators**:
- Status badge: Green with checkmark icon
- Banner: "Approved on [date] by [approver]"
- All input fields disabled

**Available Actions**:
| Action | Available | Notes |
|--------|-----------|-------|
| Edit transactions | ❌ No | Terminal state |
| Manual override | ❌ No | Terminal state |
| Upload new CSV | ❌ No | Terminal state |
| Submit for approval | ❌ No | Already approved |
| Export to PDF | ✅ Yes | Generate approval report |
| View audit log | ✅ Yes | Read-only access |

**Button State**:
- "Submit for Approval" - **Disabled** (approved)
- "Approve" - **Disabled** (already approved)
- "Reject" - **Disabled** (already approved)
- "Export PDF" - **Enabled**
- "View Audit Log" - **Enabled**

---

### Rejected

**User Permissions**:
- Edit access restored (can fix and resubmit)
- Manual overrides allowed
- Cannot upload new CSV (must fix existing data)

**UI Indicators**:
- Status badge: Red with X icon
- Banner: "Rejected on [date] by [rejector]"
- Rejection reason displayed prominently in alert box

**Rejection Reason Display**:
```
┌─────────────────────────────────────────────────┐
│ ⚠️  This reconciliation was rejected            │
│                                                 │
│ Reason: [Rejection reason text displayed here] │
│                                                 │
│ Rejected by: [Approver name]                   │
│ Date: [Rejection date]                         │
│                                                 │
│ [Edit and Resubmit] [View Audit Log]           │
└─────────────────────────────────────────────────┘
```

**Available Actions**:
| Action | Available | Notes |
|--------|-----------|-------|
| Edit transactions | ✅ Yes | Fix identified issues |
| Manual override | ✅ Yes | Reason required |
| Upload new CSV | ❌ No | Must fix existing data |
| Submit for approval | ✅ Yes | After fixes complete |
| View audit log | ✅ Yes | See rejection history |

**Button State**:
- "Submit for Approval" - **Enabled** (can resubmit after fixes)
- "Approve" - **Disabled** (not available to current user)
- "Reject" - **Disabled** (already rejected)
- "Save Draft" - **Enabled**

---

## Button Actions

### Submit for Approval

**Visibility**: Shown in Draft state, hidden in Processing, disabled in Pending Approval

**Action Flow**:
1. User clicks "Submit for Approval"
2. Confirmation dialog: "Submit for approval? This will lock the reconciliation."
3. On confirm: API call `POST /api/reconciliation/{id}/submit`
4. State transitions: Draft → Processing
5. On success: Show processing indicator
6. On error: Show error message, remain in Draft

**Preconditions**:
- At least one transaction exists
- No validation errors present

---

### Approve

**Visibility**: Shown only in Pending Approval state for users with approver role

**Action Flow**:
1. User clicks "Approve"
2. Optional: Approver comments dialog
3. API call: `POST /api/reconciliation/{id}/approve`
4. State transitions: Pending Approval → Approved
5. On success: Show success toast, update UI to Approved state
6. On error: Show error message, remain in Pending Approval

**Preconditions**:
- User has approver role
- Reconciliation is in Pending Approval state

---

### Reject

**Visibility**: Shown only in Pending Approval state for users with approver role

**Action Flow**:
1. User clicks "Reject"
2. Rejection reason dialog (required field, min 10 characters)
3. API call: `POST /api/reconciliation/{id}/reject` with reason
4. State transitions: Pending Approval → Rejected
5. On success: Show success toast, update UI to Rejected state
6. On error: Show error message, remain in Pending Approval

**Preconditions**:
- User has approver role
- Reconciliation is in Pending Approval state
- Rejection reason provided (min 10 characters)

---

## State Transition Diagram

```
┌─────────┐
│  DRAFT  │ ◄──────────────────────┐
└────┬────┘                        │
     │ Submit                      │ Withdraw / Reject
     ▼                             │
┌────────────┐                     │
│ PROCESSING │                     │
└────┬───────┘                     │
     │ Complete                    │
     ▼                             │
┌──────────────────┐               │
│ PENDING_APPROVAL │───────────────┘
└────┬─────────────┘
     │
     ├─────────────┬─────────────┐
     │ Approve     │ Reject      │
     ▼             ▼             │
┌──────────┐  ┌──────────┐       │
│ APPROVED │  │ REJECTED │───────┘
└──────────┘  └──────────┘
 (terminal)    (can resubmit)
```

## Acceptance Criteria

- [x] **UI Reflects State Correctly**: Each of the 5 workflow states has distinct visual indicators (badge color, icon, banner message)
- [x] **Buttons Enabled/Disabled Based on State**: Submit, Approve, Reject buttons follow state transition rules exactly
- [x] **No Local-Only State Transitions**: All state changes require backend API calls; optimistic updates prohibited
- [x] **Rejection Reason Displayed**: Rejected state prominently shows rejection reason, rejector, and date
- [x] **Processing State Blocks Interaction**: Loading indicator shown, all edit actions disabled during Processing
- [x] **Approved State Fully Locked**: No edit, override, or upload actions available in Approved state
- [x] **Rejected State Allows Resubmission**: Edit and manual override enabled, can resubmit after fixes

## Role-Based Visibility

| Action | Operator | Approver | Admin | Auditor |
|--------|----------|----------|-------|---------|
| Submit for Approval | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Approve | ❌ No | ✅ Yes | ✅ Yes | ❌ No |
| Reject | ❌ No | ✅ Yes | ✅ Yes | ❌ No |
| Edit Transactions | ✅ Yes | ❌ No | ✅ Yes | ❌ No |
| Manual Override | ✅ Yes | ❌ No | ✅ Yes | ❌ No |
| View Audit Log | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Export PDF | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

**Note**: Role-based UI rendering is future-ready (per spec success criteria). Current implementation may show all actions to all users, but architecture MUST support role-based visibility.

## Related Documents

- [Feature Specification](./001-frontend-ui-contracts/spec.md) - User Story 4 (Approval Workflow)
- [Data Contracts](./database-schema.md) - WorkflowState enum, state transition rules
- [Constitution](../../.specify/memory/constitution.md) - Principle IV (Security-by-Design), Principle VIII (Full Traceability)
