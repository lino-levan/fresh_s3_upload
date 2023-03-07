import { Head } from "$fresh/runtime.ts";
import Upload from "../islands/Upload.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <p class="my-6">
          Welcome to fresh aws upload demo
        </p>
        <Upload />
      </div>
    </>
  );
}
