import { useCallback, useState } from 'react';
import Image from 'next/image';
import { TrashIcon, UploadIcon } from '@radix-ui/react-icons';
import type { DropzoneOptions, FileError, FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import type { ControllerRenderProps } from 'react-hook-form';
import { Form } from './form';
import { Input } from './input';

interface DropzoneProps extends DropzoneOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  onFileError(error: FileError): void;
  restrictionText?: string;
}

export function Dropzone({
  field,
  restrictionText,
  onFileError,
  ...options
}: DropzoneProps) {
  type TFile = (File & { url: string }) | undefined;
  const [file, setFile] = useState<TFile>(undefined);

  const onDrop = useCallback(
    (files: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length) return onFileError(rejectedFiles[0].errors[0]);
      const selectedFile = files[0];
      if (!selectedFile) return;

      const url = URL.createObjectURL(selectedFile);
      const reader = new FileReader();

      reader.onload = function onload(event) {
        const result = event.target?.result;
        if (typeof result !== 'string') return;
        field.onChange(result);
        setFile(Object.assign(selectedFile, { url }));
      };

      reader.readAsBinaryString(selectedFile);
    },
    [field, onFileError],
  );

  const dropzone = useDropzone({ onDrop, ...options });
  const input = dropzone.getInputProps();

  return (
    <>
      {!file && (
        <div
          {...dropzone.getRootProps({
            className:
              'flex flex-col items-center justify-center rounded-md border border-input bg-transparent pt-5 pb-6 cursor-pointer text-sm text-muted-foreground',
          })}
        >
          <UploadIcon />

          <p>Drag and drop a file here, or click to select a file</p>
          {restrictionText && <p>{restrictionText}</p>}
        </div>
      )}

      {file && (
        <div className="relative h-48 w-full">
          <Image
            src={file.url}
            alt={file.name}
            width={300}
            height={300}
            className="h-full object-contain"
            onLoad={() => URL.revokeObjectURL(file.url)}
          />

          <button
            type="button"
            className="absolute right-0 top-0 rounded-full bg-black p-2 text-white"
            onClick={() => {
              field.onChange(undefined);
              setFile(undefined);
            }}
          >
            {/* Improve */}
            <TrashIcon />
          </button>
        </div>
      )}

      <Form.Control>
        <Input
          {...input}
          value={undefined}
          ref={(node) => {
            field.ref(node);
            // @ts-expect-error - "current" is readonly
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            input.ref!.current = node;
          }}
          type="file"
        />
      </Form.Control>
      <Form.Message />
    </>
  );
}
