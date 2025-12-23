import { createId } from '@/lib/utils.ts';

const KEY_MAP: Record<string, string> = {
    // ComparisonState
    internet: 'i',
    mobilePeople: 'm',

    // Internet
    current: 'c',
    new: 'n',

    // MobilePerson
    currentPlan: 'cp',
    newPlan: 'np',

    // Subscription properties
    name: 'N',
    basePrice: 'bp',
    contractDuration: 'cd',
    promotions: 'p',
    deviceDetails: 'dd',

    // Promotion properties
    durationMonths: 'dm',
    discountedPrice: 'dp',

    // Device properties
    upfrontCost: 'uc',
    monthlyCredit: 'mc',
};

const REVERSE_MAP: Record<string, string> = Object.entries(KEY_MAP).reduce(
    (acc, [key, value]) => {
        acc[value] = key;
        return acc;
    },
    {} as Record<string, string>,
);

/**
 * Minifies the data by:
 * 1. Aliasing keys to short keys
 * 2. Stripping IDs
 * 3. Removing empty/undefined values and empty arrays
 */
export const minify = (data: unknown): unknown => {
    if (Array.isArray(data)) {
        return data.map(minify);
    }

    if (data !== null && typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        const minified: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(obj)) {
            if (shouldSkipKey(key, value)) continue;

            const newKey = KEY_MAP[key] || key;
            minified[newKey] = minify(value);
        }

        return minified;
    }

    return data;
};

/**
 * Restores the data by:
 * 1. Un-aliasing keys back to full names
 * 2. Regenerating IDs for objects that typically have them
 * 3. Restoring default values like empty arrays
 */
export const unminify = (data: unknown): unknown => {
    if (Array.isArray(data)) {
        return data.map(unminify);
    }

    if (data !== null && typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        const unminified: Record<string, unknown> = {};

        // Reconstruct the object with full keys
        for (const [key, value] of Object.entries(obj)) {
            const newKey = REVERSE_MAP[key] || key;
            unminified[newKey] = unminify(value);
        }

        // Restore missing values
        restoreObject(unminified);

        return unminified;
    }

    return data;
};

const shouldSkipKey = (key: string, value: unknown): boolean => {
    // Strip IDs, will be regenerated on unminify
    if (key === 'id') return true;

    // Ignore undefined or null
    if (value === undefined || value === null) return true;

    // Ignore empty arrays (like promotions)
    if (Array.isArray(value) && value.length === 0) return true;

    return false;
};

const restoreObject = (obj: Record<string, unknown>) => {
    const isPlan = 'basePrice' in obj || 'contractDuration' in obj;
    const isPerson = 'name' in obj && ('currentPlan' in obj || 'newPlan' in obj);
    const isPromo = 'discountedPrice' in obj;

    // Restore IDs
    if ((isPlan || isPerson || isPromo) && !obj.id) {
        obj.id = createId();
    }

    // Restore default empty arrays for Plans
    if (isPlan && !obj.promotions) {
        obj.promotions = [];
    }
};
