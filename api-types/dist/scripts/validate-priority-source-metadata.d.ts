import { PrioritySourceMetadataIntake } from '../lib/source-grounding/intake-schema';
interface Options {
    inputFile: string;
}
export type ValidationResult = {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    notes: string[];
    row: PrioritySourceMetadataIntake;
};
export declare function validatePrioritySourceMetadata(options: Options): Promise<{
    results: ValidationResult[];
    summary: {
        total: number;
        valid: number;
        errors: number;
        warnings: number;
    };
}>;
export {};
//# sourceMappingURL=validate-priority-source-metadata.d.ts.map