import { Handlers } from "$fresh/server.ts";
import ContentTypes from "std/media_types/vendor/mime-db.v1.52.0.ts";

import { ApiFactory } from "aws_api/client/mod.ts";
import { S3 } from "aws_api/services/s3/mod.ts";
import { managedUpload } from "aws_api/extras/s3-upload.ts";

const s3 = new ApiFactory({
  credentials: {
    awsAccessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
    awsSecretKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  },
  region: Deno.env.get("AWS_REGION")!,
}).makeNew(S3);

export const handler: Handlers = {
  async PUT(req) {
    const contentType = req.headers.get("Content-Type");

    const id = crypto.randomUUID();

    if (req.body && contentType) {
      // @ts-ignore We're doing some funky stuff but I promise this works
      const extension = ContentTypes[contentType.split(";")[0]].extensions[0];
      const fileName = `./${id}.${extension}`;

      await managedUpload(s3, {
        Bucket: Deno.env.get("AWS_BUCKET")!,
        Key: fileName,
        Body: req.body,
      });
    }

    return new Response(id);
  },
};
