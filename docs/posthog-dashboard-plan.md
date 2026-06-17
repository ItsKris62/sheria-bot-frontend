# PostHog Dashboard Plan & Privacy Rules

This document outlines the PostHog analytics tracking structure used in SheriaBot.

## Privacy Statement

> [!WARNING]  
> PostHog is used exclusively for product analytics and feature engagement tracking. Legal content, uploaded document text, AI outputs, citation excerpts, personal identifiers, and confidential organization details **MUST NEVER** be sent to PostHog.

## Event Dictionary

### Compliance Query
- **`compliance_query_opened`**: Fires when the query dialog or page is opened.
- **`compliance_query_started`**: Fires when a query is submitted.
  - Allowed properties: `source` ("manual_input" or suggestion), `framework_count`.
  - Privacy notes: Query text is intentionally omitted.
- **`compliance_query_completed`**: Fires when an AI response finishes streaming.
  - Allowed properties: `citation_count`, `duration_ms`, `status`.
  - Privacy notes: AI answer text and citation contents are strictly omitted.
- **`compliance_query_source_insufficient`**: Fires if the system identifies gaps in the regulatory corpus for the requested query.
- **`compliance_query_citation_expanded`**: Fires when a user clicks to view a source excerpt.
  - Privacy notes: The excerpt text is omitted.

### Gap Analysis
- **`gap_analysis_opened`**: Fires when the analysis tool is opened.
- **`gap_analysis_file_uploaded`**: Fires when a document is uploaded.
  - Allowed properties: `file_type` (extension only).
  - Privacy notes: Raw file names and contents are dropped.
- **`gap_analysis_started`**: Fires when analysis kicks off.
  - Allowed properties: `depth`, `framework_count`.
- **`gap_analysis_completed`**: Fires when analysis finishes successfully.
  - Allowed properties: `framework_count`.
- **`gap_analysis_failed`**: Fires when analysis fails.
  - Allowed properties: `reason` (safe error code/category).
- **`gap_analysis_export_generated`**: Fires when exporting results.
  - Allowed properties: `type` (e.g., 'pdf', 'docx').

### Corpus Gap Reports
- **`corpus_gap_report_opened`**: Fires when a user opens the report dialog.
- **`corpus_gap_report_submitted`**: Fires when a user requests a missing document.
  - Privacy notes: User description is dropped.
- **`admin_corpus_gap_report_status_updated`**: Fires when an admin moves a report along the pipeline.
  - Allowed properties: `new_status`.

### Billing & Feature Gates
- **`billing_page_opened`**: Fires when a user opens the billing settings.
- **`upgrade_clicked`**: Fires when a user clicks a pricing upgrade button.
  - Allowed properties: `target_plan`.
- **`plan_limit_reached`**: Fires when a user hits a paywall or usage limit.
  - Allowed properties: `feature`, `limit_type` ('trial_cap', 'month', 'lifetime').
- **`feature_gate_viewed`**: Fires when a user encounters a locked feature card.
  - Allowed properties: `feature`, `required_plan`.
- **`feature_gate_upgrade_clicked`**: Fires when a user clicks "Upgrade" directly from a feature gate.
  - Allowed properties: `target_plan`.

### Pilot Access
- **`pilot_feature_used`**: Used for tracking experimental feature engagement.
- **`pilot_feedback_submitted`**: Used for tracking user feedback on experimental features.

---

## Recommended PostHog Funnels

### Compliance Query Funnel
1. `compliance_query_opened`
2. `compliance_query_started`
3. `compliance_query_completed`
4. `compliance_query_citation_expanded`
*Purpose: Measure whether users not only ask questions but also inspect the generated legal sources.*

### Gap Analysis Funnel
1. `gap_analysis_opened`
2. `gap_analysis_file_uploaded`
3. `gap_analysis_started`
4. `gap_analysis_completed`
5. `gap_analysis_export_generated`
*Purpose: Measure document analysis completion and export behaviors.*

### Billing Intent Funnel
1. `feature_gate_viewed` OR `billing_page_opened`
2. `feature_gate_upgrade_clicked` OR `upgrade_clicked`
*Purpose: Measure pricing and conversion intent from within the product vs the billing page.*

### Corpus Gap Report Pipeline
1. `corpus_gap_report_opened`
2. `corpus_gap_report_submitted`
3. `admin_corpus_gap_report_status_updated`
*Purpose: Measure how often users report missing legal material and how fast admins process those requests.*

---

## Recommended Dashboard Cards

1. **Daily Active Users**: Total unique users logging in or firing any event.
2. **Weekly Active Organizations**: Total unique organizations engaging with the platform.
3. **Compliance Queries Started vs Completed**: Bar chart tracking drop-off due to AI errors.
4. **Gap Analyses Completed vs Exported**: Pie chart tracking if users take their analysis offline.
5. **Citation Expansion Rate**: Percentage of completed queries where a user expands a citation.
6. **Source Insufficiency Rate**: Trend line of `compliance_query_source_insufficient` over time.
7. **Plan Limit Reached by Feature**: Bar chart to understand which features drive paywall hits.
8. **Upgrade Clicks by Target Plan**: Understand which tier users are intending to upgrade to.
9. **Corpus Gap Reports Submitted**: Breakdown of reports by status (pending vs fulfilled).
10. **Top Analysis Depths**: Distribution of standard vs deep analysis runs.
11. **Export Type Distribution**: PDF vs DOCX preference split.
