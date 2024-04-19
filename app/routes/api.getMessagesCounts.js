import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import messageDraftModel from "../MONGODB/models/messageDraftSchema";
import messageModel from "../MONGODB/models/messageSchema";


export const loader = async ({ params, request }) => {
    const { admin, session } = await authenticate.admin(request);

    // console.log("params session.shop getCounts", params, '  ', session.shop)
    try {

        const messageTableCount = await messageModel.countDocuments({ storeURL: session.shop });

        const draftMessagesTableCount = await messageDraftModel.countDocuments({ storeURL: session.shop });

        const allMessagesCount = messageTableCount + draftMessagesTableCount;

        return json({
            messageTableCount, draftMessagesTableCount, allMessagesCount
        }, { status: 200 });

    } catch (error) {
        console.log("error", error);
        return json({
            error: `Something went wrong..., ${error}`,
        }, { status: 200 });
    }
};



