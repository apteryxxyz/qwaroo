import { Trash2Icon, UploadCloudIcon } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { DropzoneOptions, FileError, FileRejection, useDropzone } from 'react-dropzone';
import { ControllerRenderProps } from 'react-hook-form';
import { Form } from './Form';
import { Input } from './Input';

interface DropzoneProps extends DropzoneOptions {
    field: ControllerRenderProps<any, any>;
    onFileError(error: FileError): void;
    restrictionText?: string;
}

export function Dropzone({ field, restrictionText, onFileError, ...options }: DropzoneProps) {
    const [file, setFile] = useState<(File & { url: string }) | undefined>(undefined);

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

            console.log('binary');
            reader.readAsBinaryString(selectedFile);
        },
        [field.onChange]
    );

    const dropzone = useDropzone({ onDrop, ...options });
    const input = dropzone.getInputProps();

    return <>
        {!file && <div
            {...dropzone.getRootProps({
                className:
                    'flex flex-col items-center justify-center rounded-md border border-input bg-transparent pt-5 pb-6 cursor-pointer text-sm text-muted-foreground',
            })}
        >
            <UploadCloudIcon />

            <p>Drag and drop a file here, or click to select a file</p>
            {restrictionText && <p>{restrictionText}</p>}
        </div>}

        {file && <div className="relative w-full h-48">
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
                className="absolute top-0 right-0 p-2 text-white bg-black rounded-full"
                onClick={() => {
                    field.onChange(undefined);
                    setFile(undefined);
                }}
            >
                <Trash2Icon />
            </button>
        </div>}

        <Form.Control>
            <Input
                {...input}
                value={undefined}
                ref={node => {
                    field.ref(node);
                    // @ts-expect-error current is readonly
                    input.ref!.current = node;
                }}
                type="file"
            />
        </Form.Control>
        <Form.Message />
    </>;
}
