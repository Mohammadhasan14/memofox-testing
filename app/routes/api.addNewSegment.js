import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { shopModel } from "../db.server";
import { createSegment } from "../graphql/createSegment";
import segmentModel from "../MONGODB/models/segmentSchema";
import segmentDraftModel from "../MONGODB/models/segmentDraftSchema";
import convertSegmentQuery from "../components/convertSegmentQuery";

export const action = async ({ request }) => {
    const data = JSON.parse(await request.text())
    // console.log('data get from addNewSegment', data)
    // console.log('segmentCriteria', data.segmentCriteria)

    try {
        const { admin, session } = await authenticate.admin(request);

        const shopData = await shopModel.findOne({ shop: session.shop });

        const queryData = convertSegmentQuery(data.segmentCriteria)

        // console.log('queryData....', queryData);

        const customerSegmentData = await createSegment({
            shopData,
            accessToken: shopData.accessToken,
            name: data.segmentName,
            query: queryData,
        });

        // console.log('customerSegmentData........./.......', customerSegmentData);
        // console.log('Data........./.......', customerSegmentData.data.segmentCreate.segment);

        const segmentData = customerSegmentData?.data?.segmentCreate?.segment;

        if (segmentData) {
            try {

                if (data.segmentID) {
                    const deleteData = await segmentDraftModel.findByIdAndDelete({ _id: data.segmentID })
                    // console.log('deleteData', deleteData);

                }

                const newSegmentData = new segmentModel({
                    id: segmentData.id,
                    name: segmentData.name,
                    query: segmentData.query,
                    storeURL: shopData.shop,
                    createdAt: new Date() 
                });

                await newSegmentData.save();

                // console.log("Segment saved successfully.");
            } catch (error) {
                console.error("Error occurred while saving segment:", error);
            }
        }


        return json({
            message: 'Successfully completed operation.',
            segmentData
        });

    } catch (error) {
        console.error("Error parsing JSON:", error);
        return json({ error: 'Failed to parse JSON from the request body.', details: error.message });
    }
};

