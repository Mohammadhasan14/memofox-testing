import {
  json, unstable_composeUploadHandlers, unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler, unstable_parseMultipartFormData
} from "@remix-run/node";

import { authenticate } from "../shopify.server";

export const action = async ({ request, params }) => {

  try {
    const { admin, session } = await authenticate.admin(request);

    const uploadHandler = unstable_composeUploadHandlers(
      unstable_createFileUploadHandler({
        directory: `./public/uploads/${session.shop}`,
        maxPartSize: 5_000_000,
        file: ({ filename }) => {
          const fileName = filename;

          return `${new Date().getTime()}.${fileName}`
        },
      }),

      unstable_createMemoryUploadHandler()
    );
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler
    );

    const gotData = formData.get("file");
    // console.log('gotData.........', gotData?.name);
    const imageName = gotData?.name

    return json({
      success: "Image uploaded successfully.",
      imageName
    }, { status: 200 });

  } catch (error) {
    console.log("error while uploading image", error)
    return json({
      error: error
    }, { status: 400 });
  }
}