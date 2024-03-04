import { PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';
import { RevenueCat } from './RevenueCat';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

export class RevenueCatDummy implements RevenueCat {
    public async configure() {}

    public async login() {}

    public async logout() {}

    public async getAvailableOfferings(): Promise<PurchasesOfferings | undefined> {
        return undefined;
    }

    public async getCurrentOffering(): Promise<PurchasesPackage | undefined> {
        return undefined;
    }

    public async getActiveSubscriptions() {}

    public async getLoggedInUser() {}

    public async getUserId() {
        const uid = getCurrentUid();
        return uid;
    }

    public async isPremium() {
        return true;
    }

    public async purchasePremium() {}

    public async executePaywallWorkflow(): Promise<boolean> {
        return true;
    }
}
