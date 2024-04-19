import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import messageModel from "../MONGODB/models/messageSchema";
import messageDraftModel from "../MONGODB/models/messageDraftSchema";

export const loader = async ({ params, request }) => {
    const { admin, session } = await authenticate.admin(request);

    // console.log("params session.shop getMessages", params, '  ', session.shop)
    const limit = params.limit
    const page = params.page


    try {

        let messageData
        if (params.type === 'messageDraft') {
            // messageData = await messageDraftModel.find().sort({ _id: -1 });
            const totalItems = await messageDraftModel.countDocuments({ storeURL: session.shop });
            // console.log('totalItems', totalItems);
            const totalPages = Math.ceil(totalItems / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;

            messageData = await messageDraftModel.aggregate([
                {
                    $match: {
                        storeURL: session.shop
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                {
                    $skip: (Number(page) - 1) * Number(limit)
                },
                {
                    $limit: Number(limit)
                },
                {
                    $addFields: {
                        type: "draftMessage"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        type: 1,
                        storeURL: 1,
                        selectedImage: 1,
                        campaignName: 1,
                        previewSubject: 1,
                        selectedTags: 1,
                        previewText: 1,
                        ctaType: 1,
                        ctaLabel: 1,
                        externalURL: 1,
                        assignedSegments: 1,
                        startDate: 1,
                        startTime: 1,
                        startAMorPM: 1,
                        endDate: 1,
                        endTime: 1,
                        endAMorPM: 1,
                        createdAt: 1
                    }
                }
            ]);

            // console.log('messageData................', messageData)

            return json({
                messageData, hasNextPage, hasPrevPage, totalItems, limit
            }, { status: 200 });
        } else {
            // messageData = await messageModel.find().sort({ _id: -1 });
            const totalItems = await messageModel.countDocuments({ storeURL: session.shop });
            // console.log('totalItems', totalItems);
            const totalPages = Math.ceil(totalItems / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;

            messageData = await messageModel.aggregate([
                {
                    $match: {
                        storeURL: session.shop
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                {
                    $skip: (Number(page) - 1) * Number(limit)
                },
                {
                    $limit: Number(limit)
                },
                {
                    $addFields: {
                        type: "message"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        type: 1,
                        storeURL: 1,
                        selectedImage: 1,
                        campaignName: 1,
                        previewSubject: 1,
                        selectedTags: 1,
                        previewText: 1,
                        ctaType: 1,
                        ctaLabel: 1,
                        externalURL: 1,
                        assignedSegments: 1,
                        startDate: 1,
                        startTime: 1,
                        startAMorPM: 1,
                        endDate: 1,
                        endTime: 1,
                        endAMorPM: 1,
                        createdAt: 1
                    }
                }
            ]);


            return json({
                messageData, hasNextPage, hasPrevPage, totalItems, limit
            }, { status: 200 });
        }



    } catch (error) {
        console.log("error while getting messages", error);
        return json({
            error: `Something went wrong..., ${error}`,
        }, { status: 200 });
    }
};



