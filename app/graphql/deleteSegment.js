import axios from "axios";

export const deleteSegment = async ({ shopData, accessToken, segmentID }) => {
    try {

        const customerSegmentResponse = await axios({
            url: `https://${shopData.shop}/admin/api/2023-07/graphql.json`,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
            },
            data: {
                query: `mutation {
                    segmentDelete(id: "${segmentID}") {
                      deletedSegmentId
                      userErrors {
                        field
                        message
                      }
                    }
                  }                  
                  `,
            },
        });

        console.log('Full response from Shopify API:', customerSegmentResponse.data);

        return customerSegmentResponse.data;
    } catch (error) {
        console.error("Error creating new segment:", error);
        throw error;
    }
};
