// @ts-nocheck
const firebase = (await import("$/server/utils/firebase/initialize/index.js")).default;
const client = (await import("$/server/database/prisma.ts")).default;

/**
 * @typedef {Object} NotificationContent
 * @property {String} title
 * @property {String} body
 */

/**
 * @typedef {Object} NotificationData
 * @property {String} args
 * @property {String} handler
 */

/**
 * @typedef {Object} SendNotificationOptions
 * @property {Array<Number>} users_ids
 * @property {NotificationContent} notification
 * @property {NotificationData} data
 *
 */

export default {
    /**
     * @param {SendNotificationOptions} params
     */
    async send(params) {
        params.data = { json: JSON.stringify(params.data) || "" };
        console.log(params);
        try {
            const users_tokens = (
                await client.devices.findMany({
                    where: {
                        deleted: false,
                        user: {
                            active: true,
                            deleted: false,
                            archived: false,
                            user_id: !params.users_ids?.length
                                ? undefined
                                : {
                                      in: params.users_ids,
                                  },
                        },
                    },
                })
            ).map((dt) => dt.device_token);

            const notificationBody = {
                notification: params.notification,
                data: params.data,
                tokens: users_tokens,
            };
            console.log(notificationBody);
            if (users_tokens.length > 0) {
                const response = await firebase.messaging().sendMulticast(notificationBody);
                console.log(response);
            }
        } catch (error) {
            console.log("\n\nerror sending notifications, error:\n", error);
        }
    },
};
