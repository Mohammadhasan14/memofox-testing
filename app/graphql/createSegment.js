import axios from "axios";

export const createSegment = async ({ shopData, accessToken, name, query }) => {
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
                    segmentCreate(name: "${name}", query: "${query}") {
                      segment {
                        id
                        name
                        query
                      }
                      userErrors {
                        message
                        field
                      }
                    }
                  }
                  `,
            },
        });

        console.log('Full response from Shopify API:', customerSegmentResponse.data.data.segmentCreate.userErrors);

        return customerSegmentResponse.data;
    } catch (error) {
        console.error("Error creating new segment:", error);
        throw error;
    }
};
