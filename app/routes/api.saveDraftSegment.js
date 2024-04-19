import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { shopModel } from "../db.server";
import segmentDraftModel from "../MONGODB/models/segmentDraftSchema";

export const action = async ({ request }) => {
    const data = JSON.parse(await request.text())
    // console.log('data get from save to draft segment', data)

    try {
        const { admin, session } = await authenticate.admin(request);
        const shopData = await shopModel.findOne({ shop: session.shop });

        try {

            if (data.segmentID) {
                const updateData = await segmentDraftModel.findByIdAndUpdate(data.segmentID, { segmentDraft: data.data });
                // console.log('updateData', updateData);
            } else {
                const newSegmentData = new segmentDraftModel({
                    segmentDraft: data.data, storeURL: session.shop, createdAt: new Date() 
                });

                await newSegmentData.save();
            }

            // console.log("Segment saved draft successfully.");
        } catch (error) {
            console.error("Error occurred while saving segment:", error);
        }

        return json({
            message: 'Successfully completed operation.',
        });

    } catch (error) {
        console.error("Error parsing JSON:", error);
        return json({ error: 'Failed to parse JSON from the request body.', details: error.message });
    }
};

