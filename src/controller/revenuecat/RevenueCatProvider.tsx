import { RevenueCat } from './RevenueCat';
import { RevenueCatDummy } from './RevenueCatDummy';
//import { RevenueCatImpl } from './RevenueCatImpl';

export class RevenueCatProvider {
    public static get(): RevenueCat {
        //return new RevenueCatImpl();
        return new RevenueCatDummy();
    }
}
