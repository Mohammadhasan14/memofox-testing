import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import segmentModel from "../MONGODB/models/segmentSchema";
import { shopModel } from "../db.server";
import { deleteSegment } from "../graphql/deleteSegment";

export const action = async ({ request }) => {
    const data = JSON.parse(await request.text())
    // console.log('data get from delete segment', data)

    try {
        const { admin, session } = await authenticate.admin(request);

        try {
            const shopData = await shopModel.findOne({ shop: session.shop });

            const deleteCustomerSegment = await deleteSegment({
                shopData,
                accessToken: shopData.accessToken,
                segmentID: data.segmentID
            });

            // console.log('deleteCustomerSegment......./........./', deleteCustomerSegment);

            if (deleteCustomerSegment?.data) {
                const deleteData = await segmentModel.findByIdAndDelete({ _id: data.segmentDBID });
                // console.log('deleteData', deleteData);

                // console.log("Segment deleted successfully.");
            }

        } catch (error) {
            console.error("Error occurred while deleting segment:", error);
        }

        return json({
            message: 'Successfully completed operation.',
        });

    } catch (error) {
        console.error("Error parsing JSON:", error);
        return json({ error: 'Failed to parse JSON from the request body.', details: error.message });
    }
};

