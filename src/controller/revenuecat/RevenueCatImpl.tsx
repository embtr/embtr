import Purchases, { LOG_LEVEL, PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import UserController from '../user/UserController';
import { RevenueCat } from './RevenueCat';

const revenueCatIosApiKey = 'appl_RXSlTRftBMMkEfTIItxDhgJiLwq';
const revenueCatAndroidApiKey = 'goog_ZYVCZlindWJZYXpncseVDmGbyqB';

export class RevenueCatImpl implements RevenueCat {
    public async configure() {
        if (isAndroidDevice()) {
            Purchases.configure({ apiKey: revenueCatAndroidApiKey });
        } else {
            Purchases.configure({ apiKey: revenueCatIosApiKey });
        }

        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    }

    public async login() {
        const userId = await this.getUserId();
        const loggedInUser = await Purchases.logIn(userId);
        loggedInUser.customerInfo;
    }

    public async logout() {
        await Purchases.logOut();
    }

    public async getAvailableOfferings(): Promise<PurchasesOfferings | undefined> {
        const offerings = await Purchases.getOfferings();
        return offerings;
    }

    public async getCurrentOffering(): Promise<PurchasesPackage | undefined> {
        const offerings = await this.getAvailableOfferings();
        if (!offerings) {
            return undefined;
        }

        const monthlyPackage = offerings.current?.monthly;
        if (!monthlyPackage) {
            return undefined;
        }

        return monthlyPackage;
    }

    public async getActiveSubscriptions() {
        const customerInfo = await Purchases.getCustomerInfo();
        customerInfo.activeSubscriptions;
    }

    public async getLoggedInUser() {
        const customerInfo = await Purchases.getCustomerInfo();
        customerInfo.activeSubscriptions;
    }

    public async getUserId() {
        const currentUser = getCurrentUid();
        return currentUser;
    }

    public async isPremium() {
        const customerInfo = await Purchases.getCustomerInfo();
        return customerInfo.activeSubscriptions.length > 0;
    }

    public async purchasePremium() {
        const monthlyPackage = await this.getCurrentOffering();
        if (!monthlyPackage) {
            return;
        }

        const result = await Purchases.purchasePackage(monthlyPackage);
    }

    public async executePaywallWorkflow(): Promise<boolean> {
        const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();
        await UserController.refreshPremiumStatus();

        return (
            paywallResult === PAYWALL_RESULT.PURCHASED || paywallResult === PAYWALL_RESULT.RESTORED
        );
    }
}
