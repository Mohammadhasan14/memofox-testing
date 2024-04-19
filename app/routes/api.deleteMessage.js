import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import messageModel from "../MONGODB/models/messageSchema";

export const action = async ({ request }) => {
    const data = JSON.parse(await request.text())
    // console.log('data get from delete message', data)

    try {
        const { admin, session } = await authenticate.admin(request);

        const deleteData = await messageModel.findByIdAndDelete({ _id: data.messageID });
        // console.log('deleteData', deleteData);

        // console.log("Message deleted successfully.");

        return json({
            message: 'Successfully completed operation.',
        });

    } catch (error) {
        console.error("Error:", error);
        return json({ error: 'Failed operation.', details: error.message });
    }
};

