/**
 * Pilot Tester Configuration
 *
 * Add each invited tester here before running provision-pilot-testers.ts.
 * The script is idempotent -- testers whose email already exists in the DB
 * are skipped without error.
 *
 * Fields:
 *   email         -  work email address (invite sent here)
 *   name          -  full name (used for the User.fullName DB field)
 *   organization  -  company name (used to create their isolated Organization)
 *   role          -  their job title (informational only, stored in metadata)
 *   cohort        -  cohort identifier written to User.pilotCohort
 *                  e.g. "PILOT_COHORT_001"
 */
export interface PilotTester {
    email: string;
    name: string;
    organization: string;
    role: string;
    cohort: string;
}
export declare const PILOT_TESTERS: PilotTester[];
//# sourceMappingURL=pilot-testers.config.d.ts.map