import React from 'react';
import Purchases, { LOG_LEVEL, PurchasesOfferings } from 'react-native-purchases';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

const revenueCatIosApiKey = 'appl_RXSlTRftBMMkEfTIItxDhgJiLwq';
const revenueCatAndroidApiKey = 'goog_ZYVCZlindWJZYXpncseVDmGbyqB';

export namespace RevenueCat {
    export function useConfigure() {
        React.useEffect(() => {
            try {
                configure();
            } catch (error) {
                console.error('Error configuring RevenueCat', error);
            }
        }, []);
    }

    export async function configure() {
        if (isAndroidDevice()) {
            Purchases.configure({ apiKey: revenueCatAndroidApiKey });
        } else {
            Purchases.configure({ apiKey: revenueCatIosApiKey });
        }

        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    }

    export async function login() {
        const userId = await getUserId();
        const loggedInUser = await Purchases.logIn(userId);
        loggedInUser.customerInfo;
    }

    export async function logout() {
        await Purchases.logOut();
    }

    export async function getAvailableOfferings() {
        const offerings = await Purchases.getOfferings();
        return offerings;
    }

    export async function getActiveSubscriptions() {
        const customerInfo = await Purchases.getCustomerInfo();
        customerInfo.activeSubscriptions;
    }

    export async function getLoggedInUser() {
        const customerInfo = await Purchases.getCustomerInfo();
        customerInfo.activeSubscriptions;
    }

    export async function getUserId() {
        const currentUser = getCurrentUid();
        return currentUser;
    }

    export async function isPremium() {
        const customerInfo = await Purchases.getCustomerInfo();
        return customerInfo.activeSubscriptions.length > 0;
    }

    export async function purchasePremium() {
        const offerings: PurchasesOfferings = await RevenueCat.getAvailableOfferings();
        const monthlyPackage = offerings.current?.monthly;
        if (!monthlyPackage) {
            return;
        }

        const result = await Purchases.purchasePackage(monthlyPackage);
    }
}
