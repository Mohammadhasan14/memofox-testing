import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import messageDraftModel from "../MONGODB/models/messageDraftSchema";

export const action = async ({ request }) => {
    const data = JSON.parse(await request.text())
    // console.log('data get from delete draft segment', data)

    try {
        const { admin, session } = await authenticate.admin(request);

        try {
            const deleteData = await messageDraftModel.findByIdAndDelete({ _id: data.messageID });
            // console.log('updateData', deleteData);

            // console.log("Segment delete draft successfully.");
        } catch (error) {
            console.error("Error occurred while deleting draft message:", error);
        }


        return json({
            message: 'Successfully completed operation.',
        });

    } catch (error) {
        console.error("Error parsing JSON:", error);
        return json({ error: 'Failed to parse JSON from the request body.', details: error.message });
    }
};

