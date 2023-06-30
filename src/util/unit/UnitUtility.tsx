import { Unit } from 'resources/schema';

export class UnitUtility {
    public static getPrettyUnit(unit: Unit, remaining?: number): string {
        if (!unit.unit) {
            return '';
        }

        const unitName = unit.unit.charAt(0).toUpperCase() + unit.unit.slice(1).toLowerCase();
        if (remaining === 1) {
            return unitName;
        }

        return unitName + 's';
    }
}
