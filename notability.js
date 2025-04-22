var objc = JSON.parse($response.body);

    objc = 

{
  "data": {
    "processAppleReceipt": {
      "__typename": "SubscriptionResult",
      "error": 0,
      "subscription": {
        "__typename": "AppStoreSubscription",
        "status": "canceled",
        "originalPurchaseDate": "2023-04-19T03:11:16.000Z",
        "originalTransactionId": "570001184068302",
        "expirationDate": "9999-05-19T03:11:15.000Z",
        "productId": "com.gingerlabs.Notability.premium_subscription",
        "tier": "premium",
        "refundedDate": null,
        "refundedReason": null,
        "isInBillingRetryPeriod": false,
        "gracePeriodExpiresAt": null,
        "expirationIntent": "CUSTOMER_CANCELLED",
        "overDeviceLimit": false,
        "user": null
      },
      "isClassic": false
    }
  }
}

$done({body : JSON.stringify(objc)});