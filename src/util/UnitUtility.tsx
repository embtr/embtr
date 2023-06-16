import { Unit } from 'resources/schema';

export class UnitUtility {
    public static getReadableUnit(unit: Unit) {
        if (!unit.unit) {
            return '';
        }

        if (unit.unit === 'DEFAULT') {
            return '';
        }

        const unitValue = unit.unit.toString().toLowerCase();
        return unitValue.charAt(0).toUpperCase() + unitValue.slice(1) + 's';
    }
}
