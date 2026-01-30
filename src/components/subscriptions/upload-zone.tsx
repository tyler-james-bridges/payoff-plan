'use client';

import { useCallback, useRef, useState, type DragEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  onFileRead: (text: string) => void;
}

export function UploadZone({ onFileRead }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback(
    (file: File) => {
      setError(null);
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.tsv') && !file.name.endsWith('.txt')) {
        setError('Please upload a CSV file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onFileRead(reader.result);
        }
      };
      reader.onerror = () => setError('Failed to read file.');
      reader.readAsText(file);
    },
    [onFileRead],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) readFile(file);
    },
    [readFile],
  );

  return (
    <Card
      className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed p-10 text-center transition-colors ${
        dragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-300 dark:border-gray-600'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
        Drop your bank statement CSV here
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Works with Chase, Apple Card, and most bank exports.
        <br />
        Your data stays in your browser — nothing is uploaded.
      </p>
      <Button variant="secondary" onClick={() => inputRef.current?.click()}>
        Choose file
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.tsv,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) readFile(file);
        }}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </Card>
  );
}
