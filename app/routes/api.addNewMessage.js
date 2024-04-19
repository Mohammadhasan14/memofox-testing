import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { shopModel } from "../db.server";
import messageModel from "../MONGODB/models/messageSchema";
import messageDraftModel from "../MONGODB/models/messageDraftSchema";

export const action = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    const data = JSON.parse(await request.text())
    // console.log('data of api addNewMessage.............', data);
    const shopData = await shopModel.findOne({ shop: session.shop });
    try {

        const newMessageData = new messageModel({ ...data, storeURL: shopData.shop, createdAt: new Date() });

        await newMessageData.save();

        if (data.messageID) {
            const deleteData = await messageDraftModel.findByIdAndDelete({ _id: data.messageID })
            // console.log('deleteData', deleteData);

        }
        return json({
            success: "saved message successfully.",
        }, { status: 200 });
    } catch (error) {
        console.error("Error saving new message:", error);
        return json({ error: 'Failed to save message.', details: error.message });
    }

};
