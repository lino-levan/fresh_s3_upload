import { Handlers } from "$fresh/server.ts";
import { S3 } from "S3";
import { BytesList } from "std/bytes/bytes_list.ts";
import ContentTypes from "std/media_types/vendor/mime-db.v1.52.0.ts";

const s3 = new S3({
  accessKeyID: Deno.env.get("AWS_ACCESS_KEY_ID")!,
  secretKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  region: Deno.env.get("AWS_REGION")!,
});

const bucket = s3.getBucket(Deno.env.get("AWS_BUCKET")!);

export const handler: Handlers = {
  async PUT(req) {
    const contentType = req.headers.get("Content-Type");

    const id = crypto.randomUUID();

    if (req.body && contentType) {
      // @ts-ignore We're doing some funky stuff but I promise this works
      const extension = ContentTypes[contentType.split(";")[0]].extensions[0];
      const fileName = `./${id}.${extension}`;

      const bytesList = new BytesList();

      for await (const chunk of req.body) {
        bytesList.add(chunk);
      }

      await bucket.putObject(fileName, bytesList.concat(), {
        contentType,
      });
    }

    return new Response(id);
  },
};
