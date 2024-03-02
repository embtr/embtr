import { PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';

/*
 * "Copy Pasta, it's almost as good as a nice slice of 🍕." - TheCaptainCoder - 2024-03-02
 */

export interface RevenueCat {
    configure(): Promise<void>;
    login(): Promise<void>;
    logout(): Promise<void>;
    getAvailableOfferings(): Promise<PurchasesOfferings | undefined>;
    getCurrentOffering(): Promise<PurchasesPackage | undefined>;
    getActiveSubscriptions(): Promise<void>;
    getLoggedInUser(): Promise<void>;
    getUserId(): Promise<string>;
    isPremium(): Promise<boolean>;
    purchasePremium(): Promise<void>;
    executePaywallWorkflow(): Promise<boolean>;
}
