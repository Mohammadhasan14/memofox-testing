import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import segmentDraftModel from "../MONGODB/models/segmentDraftSchema";
import segmentModel from "../MONGODB/models/segmentSchema";

export const loader = async ({ params, request }) => {
    // console.log("params getCounts", params)
    const { admin, session } = await authenticate.admin(request);

    try {

        const segmentTableCount = await segmentModel.countDocuments({ storeURL: session.shop });

        const draftSegmentsTableCount = await segmentDraftModel.countDocuments({ storeURL: session.shop });

        const allSegmentsCount = segmentTableCount + draftSegmentsTableCount;

        return json({
            segmentTableCount, draftSegmentsTableCount, allSegmentsCount
        }, { status: 200 });

    } catch (error) {
        console.log("error", error);
        return json({
            error: `Something went wrong..., ${error}`,
        }, { status: 200 });
    }
};



