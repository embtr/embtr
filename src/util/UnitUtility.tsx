import { Unit } from 'resources/schema';

export class UnitUtility {
    public static getReadableUnit(unit?: Unit, quantity?: number) {
        if (!unit?.unit) {
            return '';
        }

        if (unit.unit === 'DEFAULT') {
            return '';
        }

        let unitValue = unit.unit.toString().toLowerCase();
        unitValue = unitValue.charAt(0).toUpperCase() + unitValue.slice(1);

        if (quantity !== 1) {
            unitValue += 's';
        }

        return unitValue;
    }
}
