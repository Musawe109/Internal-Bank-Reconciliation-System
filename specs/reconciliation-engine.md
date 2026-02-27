# Reconciliation Rendering & Classification Spec

**Feature Branch**: `001-frontend-ui-contracts`  
**Created**: 2026-02-19  
**Status**: Draft  
**Parent Spec**: [001-frontend-ui-contracts/spec.md](./001-frontend-ui-contracts/spec.md)

## Purpose

Define how reconciliation results are displayed in the UI, including classification types, visual treatment, filtering, and table behavior.

## Classification Types

The system MUST classify all reconciliation results into exactly one of four categories:

| Classification | Description | Example Scenario |
|----------------|-------------|------------------|
| **Matched** | Bank transaction successfully matched with internal record | Bank: $1,000.00, Internal: $1,000.00 (same reference) |
| **Unmatched (Bank Only)** | Transaction exists in bank CSV but no matching internal record | Bank deposit with no corresponding Oracle entry |
| **Unmatched (Internal Only)** | Transaction exists in internal system but no matching bank record | Oracle entry awaiting bank clearance |
| **Variance Detected** | Bank and internal records found but amounts differ beyond tolerance | Bank: $1,000.00, Internal: $995.00 (difference: $5.00) |

## UI Rules

### Color-Coded Classification Badges

Each classification MUST have a distinct visual indicator:

| Classification | Badge Color | Icon |
|----------------|-------------|------|
| **Matched** | Green (`#22c55e`) | ✓ Checkmark |
| **Unmatched (Bank Only)** | Amber (`#f59e0b`) | ⚠ Warning |
| **Unmatched (Internal Only)** | Blue (`#3b82f6`) | ℹ Info |
| **Variance Detected** | Red (`#ef4444`) | ✕ Error |

**Badge Placement**:
- Displayed in the "Status" column of reconciliation tables
- Shown in summary counts at top of dashboard
- Visible in reconciliation detail header

### Table Filters by Classification

Filter controls MUST be provided to allow users to view transactions by classification:

- **Default State**: All classifications selected (show all results)
- **Single Select Mode**: User can view only one classification type at a time
- **Multi-Select Mode**: User can combine multiple classification types
- **Filter Persistence**: Selected filters persist during session (cleared on page navigation)

**Filter UI**:
- Checkbox group or pill buttons for each classification
- Count badges showing number of items per classification (e.g., "Matched (1,234)")
- Clear all filters button

### Date Tolerance Display

The UI settings panel MUST display the date tolerance used for matching:

- **Label**: "Date Tolerance" or "Matching Window"
- **Format**: Human-readable (e.g., "±3 business days")
- **Source**: Read from reconciliation configuration (not editable in this view)
- **Placement**: Settings panel or filter section header

## Table Requirements

### Pagination

Pagination MUST be enabled for all reconciliation result tables:

| Property | Requirement |
|----------|-------------|
| **Default Page Size** | 50 rows per page |
| **Page Size Options** | 25, 50, 100, 250 rows |
| **Navigation** | Previous, Next, and direct page number buttons |
| **Total Count Display** | "Showing X–Y of Z results" |
| **Large Dataset Handling** | For 10,000+ rows, use server-side pagination (not client-side) |

### Sorting

Table MUST support sorting by the following columns:

| Column | Sort Type | Default |
|--------|-----------|---------|
| **Amount** | Numeric (ascending/descending) | Descending |
| **Date** | Date (oldest/newest first) | Newest first |
| **Reference Number** | Alphanumeric (A–Z/Z–A) | Ascending |
| **Classification** | By classification order (Matched → Variance → Unmatched Bank → Unmatched Internal) | N/A |

**Sort UI**:
- Clickable column headers with sort direction indicator (↑/↓)
- Multi-column sort: Shift+click to add secondary sort
- Current sort state visible in URL query params (for bookmarking)

### Search by Reference Number

Search functionality MUST be provided to locate specific transactions:

- **Search Field**: Prominent text input above table
- **Search Scope**: Reference number field only (not full-text search)
- **Match Type**: Partial match (contains), case-insensitive
- **Debouncing**: Search triggers after 300ms of inactivity
- **Clear Button**: X button to clear search and reset table
- **Results Count**: Display number of matching results (e.g., "5 results found")

## Empty State Handling

### No Records Found

When no reconciliation records exist or filters return no results:

**Visual Treatment**:
- Centered illustration or icon (empty box, magnifying glass)
- Primary message: "No reconciliation records found" or "No results match your filters"
- Secondary message: Contextual guidance based on scenario

**Scenarios**:

| Scenario | Primary Message | Secondary Message | Call-to-Action |
|----------|-----------------|-------------------|----------------|
| First upload | "No reconciliation records yet" | "Upload a bank CSV file to begin reconciliation" | "Upload CSV" button |
| Filters applied | "No results match your filters" | "Try adjusting your classification or date filters" | "Clear all filters" button |
| Search returned no results | "No results for '[search term]'" | "Check the spelling or try a different reference number" | "Clear search" button |
| Processing complete, no matches | "Reconciliation complete" | "All transactions processed. No matches found." | "Review unmatched" button |

### Loading State

During data fetching or reconciliation processing:

**Visual Treatment**:
- Skeleton loader for table structure (preferred) OR
- Centered spinner with loading message
- Message: "Loading reconciliation results..." or "Processing reconciliation..."

**Performance Target**:
- Initial skeleton appears within 100ms
- Actual data loads within 2 seconds for first page (50 rows)
- Subsequent page loads within 1 second

**Loading States**:

| Trigger | Loading Message |
|---------|-----------------|
| Initial page load | "Loading reconciliation results..." |
| Filter change | "Updating results..." |
| Sort change | "Sorting results..." |
| Search | "Searching..." |
| Pagination | "Loading page X..." |

## Acceptance Criteria

- [x] **Classification Visually Distinct**: Each of the 4 classification types has unique color badge and icon
- [x] **Filters Functional**: Classification filters work independently and in combination, with count badges
- [x] **Table Handles Large Datasets Efficiently**: Pagination and server-side loading support 100,000+ transactions without performance degradation
- [x] **Sorting Works**: All specified columns are sortable with clear direction indicators
- [x] **Search Functional**: Reference number search returns correct results with debouncing
- [x] **Empty States Clear**: Appropriate messages and CTAs for all empty/no-results scenarios
- [x] **Loading States Visible**: Users see loading indicators during all async operations

## Related Documents

- [Feature Specification](./001-frontend-ui-contracts/spec.md) - User stories and functional requirements
- [Architecture](./001-frontend-ui-contracts/architecture.md) - Component structure and folder layout
- [Constitution](../../.specify/memory/constitution.md) - Principle II: Financial Data Integrity (classification standards)
