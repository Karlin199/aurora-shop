import CNCFileCard from "./CNCFileCard";

export type CNCFile = {
    id: string;
    part: string;
    file: string;
    modified: string;
    downloadUrl: string;
};

type Props = {
  files: CNCFile[];
};

export default function CNCFileList({
  files,
}: Props) {
  return (
    <div className="space-y-4">

      {files.map((file) => (

        <CNCFileCard
          key={file.id}
          part={file.part}
          file={file.file}
          modified={file.modified}
          onDownload={() => {
           if (!file.downloadUrl) {
             alert("No download link has been configured for this part.");
             return;
            }

            window.open(file.downloadUrl, "_blank");
          }}
        />

      ))}

    </div>
  );
}