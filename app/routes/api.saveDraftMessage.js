import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { shopModel } from "../db.server";
import messageDraftModel from "../MONGODB/models/messageDraftSchema";

export const action = async ({ request }) => {
    const data = JSON.parse(await request.text())
    // console.log('data get from save to draft message', data)

    try {
        const { admin, session } = await authenticate.admin(request);
        const shopData = await shopModel.findOne({ shop: session.shop });
        // console.log('shopModel..........', shopData);
        try {

            if (data.messageID) {
                const updateData = await messageDraftModel.findByIdAndUpdate(data.messageID, { ...data });
                // console.log('updateData', updateData);
            } else {
                const newMessageData = new messageDraftModel({
                    ...data, storeURL: shopData.shop, createdAt: new Date() 
                });

                await newMessageData.save();
            }

            // console.log("Message saved draft successfully.");
        } catch (error) {
            console.error("Error occurred while saving message Draft:", error);
        }


        return json({
            message: 'Successfully completed operation.',
        });

    } catch (error) {
        console.error("Error :", error);
        return json({ error: 'Failed operation.', details: error.message });
    }
};

