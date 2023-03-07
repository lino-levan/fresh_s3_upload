import { useState } from "preact/hooks";

export default function Upload() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  return (
    <div class="flex flex-col items-center gap-2 w-full">
      <input id="file" type="file" />
      <button
        class="px-4 py-2 bg-gray-100 rounded"
        onClick={async () => {
          setSuccess(false);
          setError("");

          const files =
            (document.getElementById("file") as HTMLInputElement).files;

          if (!files) {
            setError("No files selected!");
            return;
          }

          for (let i = 0, numFiles = files.length; i < numFiles; i++) {
            const file = files[i];
            // Upload file
            try {
              const req = await fetch("/assets", {
                method: "PUT",
                headers: {
                  "Content-Type": file.type,
                },
                body: file,
              });
              setSuccess(true);
              console.log("Successfully uploaded", await req.text());
            } catch (err) {
              setError(err);
              return;
            }
          }
        }}
      >
        Upload
      </button>
      <p>{success ? "Successfully uploaded file!" : ""}</p>
      <p>{error}</p>
    </div>
  );
}
