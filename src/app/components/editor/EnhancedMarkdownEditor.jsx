'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  Bold, Italic, List, ListOrdered, Link, Image, Code, AlignLeft, 
  AlignCenter, AlignRight, Underline, Heading1, Heading2, Heading3,
  Quote, AlertCircle, Palette, Hash, Table, FileText, Eye, Edit, Columns
} from 'lucide-react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import rehypeSanitize from 'rehype-sanitize';

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

const extraCommands = [
  {
    name: 'header-1',
    keyCommand: 'header-1',
    buttonProps: { 'aria-label': 'Add heading level 1', title: 'Heading 1' },
    icon: <Heading1 className="w-4 h-4" />,
  },
  {
    name: 'header-2',
    keyCommand: 'header-2',
    buttonProps: { 'aria-label': 'Add heading level 2', title: 'Heading 2' },
    icon: <Heading2 className="w-4 h-4" />,
  },
  {
    name: 'header-3',
    keyCommand: 'header-3',
    buttonProps: { 'aria-label': 'Add heading level 3', title: 'Heading 3' },
    icon: <Heading3 className="w-4 h-4" />,
  },
  {
    name: 'insert-underline',
    keyCommand: 'insert-underline',
    buttonProps: { 'aria-label': 'Add underlined text', title: 'Underline' },
    icon: <Underline className="w-4 h-4" />,
    execute: (state, api) => {
      let modifyText = `<u>${state.selectedText}</u>`;
      if (!state.selectedText) {
        modifyText = '<u>Underlined text</u>';
      }
      api.replaceSelection(modifyText);
    },
  },
  {
    name: 'insert-red-text',
    keyCommand: 'insert-red-text',
    buttonProps: { 'aria-label': 'Add red text', title: 'Red Text' },
    icon: <span className="flex items-center"><Palette className="w-4 h-4 mr-1" /><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>,
    execute: (state, api) => {
      let modifyText = `<span style="color: red">${state.selectedText}</span>`;
      if (!state.selectedText) {
        modifyText = '<span style="color: red">Red text</span>';
      }
      api.replaceSelection(modifyText);
    },
  },
  {
    name: 'insert-blue-text',
    keyCommand: 'insert-blue-text',
    buttonProps: { 'aria-label': 'Add blue text', title: 'Blue Text' },
    icon: <span className="flex items-center"><Palette className="w-4 h-4 mr-1" /><span className="w-2 h-2 bg-blue-500 rounded-full"></span></span>,
    execute: (state, api) => {
      let modifyText = `<span style="color: blue">${state.selectedText}</span>`;
      if (!state.selectedText) {
        modifyText = '<span style="color: blue">Blue text</span>';
      }
      api.replaceSelection(modifyText);
    },
  },
  {
    name: 'insert-green-text',
    keyCommand: 'insert-green-text',
    buttonProps: { 'aria-label': 'Add green text', title: 'Green Text' },
    icon: <span className="flex items-center"><Palette className="w-4 h-4 mr-1" /><span className="w-2 h-2 bg-green-500 rounded-full"></span></span>,
    execute: (state, api) => {
      let modifyText = `<span style="color: green">${state.selectedText}</span>`;
      if (!state.selectedText) {
        modifyText = '<span style="color: green">Green text</span>';
      }
      api.replaceSelection(modifyText);
    },
  },
  {
    name: 'insert-table',
    keyCommand: 'insert-table',
    buttonProps: { 'aria-label': 'Insert table', title: 'Insert Table' },
    icon: <Table className="w-4 h-4" />,
    execute: (state, api) => {
      const table = `
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
      api.replaceSelection(table);
    },
  },
  {
    name: 'insert-columns',
    keyCommand: 'insert-columns',
    buttonProps: { 'aria-label': 'Insert two columns', title: 'Two Columns Layout' },
    icon: <Columns className="w-4 h-4" />,
    execute: (state, api) => {
      const columns = `
<div style="display: flex; gap: 20px;">
<div style="flex: 1;">

### Column 1
Content for column 1

</div>
<div style="flex: 1;">

### Column 2
Content for column 2

</div>
</div>
`;
      api.replaceSelection(columns);
    },
  },
  {
    name: 'insert-alert',
    keyCommand: 'insert-alert',
    buttonProps: { 'aria-label': 'Insert alert/note', title: 'Insert Alert/Note' },
    icon: <AlertCircle className="w-4 h-4" />,
    execute: (state, api) => {
      const alertBox = `
> **Note:** This is an important note or alert that stands out from regular text.
`;
      api.replaceSelection(alertBox);
    },
  },
];

const EnhancedMarkdownEditor = ({ value, onChange, height = 400, placeholder }) => {
  const [mounted, setMounted] = useState(false);
  
  // Handle theme compatibility issues on client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Ensure we add data-color-mode attribute to work properly with light/dark themes
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-color-mode', 'light');
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="enhanced-markdown-editor">
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        preview="edit"
        extraCommands={extraCommands}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
        textareaProps={{
          placeholder: placeholder || 'Write detailed description with rich formatting...'
        }}
        components={{
          toolbar: (command, disabled, executeCommand) => {
            // Enhanced tooltips for better UX
            if (command.name === 'bold') {
              command.buttonProps.title = 'Bold (Ctrl+B)';
            }
            if (command.name === 'italic') {
              command.buttonProps.title = 'Italic (Ctrl+I)';
            }
            if (command.name === 'quote') {
              command.buttonProps.title = 'Quote / Blockquote';
            }
            
            return null; // Use default rendering
          },
        }}
      />

      {/* Quick Help Section */}
      <div className="mt-2 text-xs text-gray-500">
        <p className="mb-1">
          <strong>Tips:</strong> Use Markdown for rich formatting. Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+B</kbd> for bold, <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+I</kbd> for italic, or use the toolbar options.
        </p>
        <p>
          To add links, wrap text in [brackets] followed by URL in (parentheses), like [text](https://example.com).
        </p>
      </div>
    </div>
  );
};

export default EnhancedMarkdownEditor; 