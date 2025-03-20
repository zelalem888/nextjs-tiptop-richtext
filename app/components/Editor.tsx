'use client';

import dynamic from 'next/dynamic';
import React, { useCallback, useState } from 'react';

// Dynamically import the editor with SSR disabled
const RcTiptapEditor = dynamic(
  () => import('reactjs-tiptap-editor'),
  { ssr: false }
);

// Import necessary extensions
import {
  BaseKit,
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  Heading,
  BulletList,
  OrderedList,
  Blockquote,
  Code,
  CodeBlock,
  TextAlign,
  History, // Undo/Redo
  FontSize, // Font Size
  HorizontalRule, // Horizontal Line
  ExportPdf, // Export to PDF
} from 'reactjs-tiptap-editor/extension-bundle';

// Import styles
import 'reactjs-tiptap-editor/style.css';

// Default content for the editor
const DEFAULT = `<h1 style="text-align: center">Rich Text Editor</h1>`;

// Configure extensions
const extensions = [
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true,
    },
  }),
  Bold,
  Italic,
  Underline,
  Link,
  Image.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files));
        }, 500);
      });
    },
  }),
  Heading.configure({ levels: [1, 2, 3] }),
  BulletList,
  OrderedList,
  Blockquote,
  Code,
  CodeBlock.configure({ defaultTheme: 'dracula' }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  History, // Undo/Redo
  FontSize, // Font Size
  HorizontalRule, // Horizontal Line
  ExportPdf.configure({ spacer: true }), // Export to PDF
];

// Debounce function to limit frequent updates
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) { // Explicitly annotate `this` as `any`
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Editor component
const Editor = () => {
  const [content, setContent] = useState(DEFAULT);
  const [theme, setTheme] = useState('light');
  const [disable, setDisable] = useState(false);

  // Debounced content change handler
  const onValueChange = useCallback(
    debounce((value: string) => {
      setContent(value);
    }, 300),
    []
  );

  return (
    <main style={{ padding: '0 20px' }}>
      <div style={{ maxWidth: 1024, margin: '88px auto 120px' }}>
        {/* Toolbar buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: 10 }}>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            Toggle {theme === 'dark' ? 'Light' : 'Dark'} Theme
          </button>
          <button onClick={() => setDisable(!disable)}>
            {disable ? 'Enable Editor' : 'Disable Editor'}
          </button>
        </div>

        {/* Editor */}
        <RcTiptapEditor
          output="html"
          content={DEFAULT}
          onChangeContent={onValueChange}
          extensions={extensions}
          dark={theme === 'dark'}
          disabled={disable}
        />

        {/* Display content as HTML */}
        {typeof content === 'string' && (
          <textarea
            readOnly
            style={{
              marginTop: 20,
              height: 200,
              width: '100%',
              borderRadius: 4,
              padding: 10,
              backgroundColor: theme === 'dark' ? '#333' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
            }}
            value={content}
          />
        )}
      </div>
    </main>
  );
};

export default Editor;