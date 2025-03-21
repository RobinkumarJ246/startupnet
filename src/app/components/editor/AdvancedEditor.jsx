'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { 
  Bold, Italic, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, 
  Link2, Image, Code, Terminal, 
  Heading1, Heading2, Heading3, 
  Table, Quote, Undo, Redo, 
  HelpCircle, Info, AlertTriangle, 
  CheckCircle, ExternalLink, Underline,
  Palette, Eye
} from 'lucide-react';
import rehypeSanitize from 'rehype-sanitize';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

const AdvancedEditor = ({ 
  value, 
  onChange, 
  placeholder = "Write a detailed description...",
  height = 400,
  showExamples = true
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const examplesRef = useRef(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check if we're in a dark mode context
    const isDarkMode = document.documentElement.classList.contains('dark');
    setTheme(isDarkMode ? 'dark' : 'light');

    // Optional: Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark');
          setTheme(isDarkMode ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  const toggleExamples = () => {
    if (examplesRef.current) {
      examplesRef.current.classList.toggle('hidden');
    }
  };

  const extraCommands = [
    // Headers
    {
      name: 'header1',
      keyCommand: 'header1',
      buttonProps: { 'aria-label': 'Insert header 1', title: 'Header 1' },
      icon: <Heading1 className="h-4 w-4" />,
      execute: (state, api) => {
        let modifyText = `# ${state.selectedText}`;
        if (!state.selectedText) {
          modifyText = `# Heading 1`;
        }
        api.replaceSelection(modifyText);
      },
    },
    {
      name: 'header2',
      keyCommand: 'header2',
      buttonProps: { 'aria-label': 'Insert header 2', title: 'Header 2' },
      icon: <Heading2 className="h-4 w-4" />,
      execute: (state, api) => {
        let modifyText = `## ${state.selectedText}`;
        if (!state.selectedText) {
          modifyText = `## Heading 2`;
        }
        api.replaceSelection(modifyText);
      },
    },
    {
      name: 'header3',
      keyCommand: 'header3',
      buttonProps: { 'aria-label': 'Insert header 3', title: 'Header 3' },
      icon: <Heading3 className="h-4 w-4" />,
      execute: (state, api) => {
        let modifyText = `### ${state.selectedText}`;
        if (!state.selectedText) {
          modifyText = `### Heading 3`;
        }
        api.replaceSelection(modifyText);
      },
    },
    // Text styling
    {
      name: 'underline',
      keyCommand: 'underline',
      buttonProps: { 'aria-label': 'Add underline text', title: 'Underline' },
      icon: <Underline className="h-4 w-4" />,
      execute: (state, api) => {
        let modifyText = `<u>${state.selectedText}</u>`;
        if (!state.selectedText) {
          modifyText = '<u>underlined text</u>';
        }
        api.replaceSelection(modifyText);
      },
    },
    // Colored text
    {
      name: 'redText',
      keyCommand: 'redText',
      buttonProps: { 'aria-label': 'Add red text', title: 'Red Text' },
      icon: <div className="h-4 w-4 flex items-center justify-center"><Palette className="h-3 w-3 text-red-500" /></div>,
      execute: (state, api) => {
        let modifyText = `<span style="color: red">${state.selectedText}</span>`;
        if (!state.selectedText) {
          modifyText = '<span style="color: red">red text</span>';
        }
        api.replaceSelection(modifyText);
      },
    },
    {
      name: 'blueText',
      keyCommand: 'blueText',
      buttonProps: { 'aria-label': 'Add blue text', title: 'Blue Text' },
      icon: <div className="h-4 w-4 flex items-center justify-center"><Palette className="h-3 w-3 text-blue-500" /></div>,
      execute: (state, api) => {
        let modifyText = `<span style="color: blue">${state.selectedText}</span>`;
        if (!state.selectedText) {
          modifyText = '<span style="color: blue">blue text</span>';
        }
        api.replaceSelection(modifyText);
      },
    },
    {
      name: 'greenText',
      keyCommand: 'greenText',
      buttonProps: { 'aria-label': 'Add green text', title: 'Green Text' },
      icon: <div className="h-4 w-4 flex items-center justify-center"><Palette className="h-3 w-3 text-green-500" /></div>,
      execute: (state, api) => {
        let modifyText = `<span style="color: green">${state.selectedText}</span>`;
        if (!state.selectedText) {
          modifyText = '<span style="color: green">green text</span>';
        }
        api.replaceSelection(modifyText);
      },
    },
    // Alignment
    {
      name: 'alignCenter',
      keyCommand: 'alignCenter',
      buttonProps: { 'aria-label': 'Center text', title: 'Center Align' },
      icon: <AlignCenter className="h-4 w-4" />,
      execute: (state, api) => {
        let modifyText = `<div style="text-align: center">${state.selectedText}</div>`;
        if (!state.selectedText) {
          modifyText = '<div style="text-align: center">centered text</div>';
        }
        api.replaceSelection(modifyText);
      },
    },
    {
      name: 'alignRight',
      keyCommand: 'alignRight',
      buttonProps: { 'aria-label': 'Right align text', title: 'Right Align' },
      icon: <AlignRight className="h-4 w-4" />,
      execute: (state, api) => {
        let modifyText = `<div style="text-align: right">${state.selectedText}</div>`;
        if (!state.selectedText) {
          modifyText = '<div style="text-align: right">right aligned text</div>';
        }
        api.replaceSelection(modifyText);
      },
    },
    // Table
    {
      name: 'table',
      keyCommand: 'table',
      buttonProps: { 'aria-label': 'Insert table', title: 'Table' },
      icon: <Table className="h-4 w-4" />,
      execute: (state, api) => {
        const table = `| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Row 1-1  | Row 1-2  | Row 1-3  |
| Row 2-1  | Row 2-2  | Row 2-3  |
`;
        api.replaceSelection(table);
      },
    },
    // Callouts
    {
      name: 'infoCallout',
      keyCommand: 'infoCallout',
      buttonProps: { 'aria-label': 'Add info callout', title: 'Info Callout' },
      icon: <Info className="h-4 w-4 text-blue-500" />,
      execute: (state, api) => {
        const content = state.selectedText || 'This is an informational note';
        const callout = `:::info
${content}
:::`;
        api.replaceSelection(callout);
      },
    },
    {
      name: 'warningCallout',
      keyCommand: 'warningCallout',
      buttonProps: { 'aria-label': 'Add warning callout', title: 'Warning Callout' },
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      execute: (state, api) => {
        const content = state.selectedText || 'This is a warning note';
        const callout = `:::warning
${content}
:::`;
        api.replaceSelection(callout);
      },
    },
    {
      name: 'successCallout',
      keyCommand: 'successCallout',
      buttonProps: { 'aria-label': 'Add success callout', title: 'Success Callout' },
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      execute: (state, api) => {
        const content = state.selectedText || 'This is a success note';
        const callout = `:::success
${content}
:::`;
        api.replaceSelection(callout);
      },
    },
    // Toggle preview mode
    {
      name: 'togglePreview',
      keyCommand: 'togglePreview',
      buttonProps: { 
        'aria-label': 'Toggle preview mode', 
        title: 'Toggle Preview',
        style: { marginLeft: 'auto' } // Push to right of toolbar
      },
      icon: <Eye className="h-4 w-4" />,
      execute: () => {
        setPreviewOpen(!previewOpen);
      },
    },
  ];

  return (
    <div className="advanced-editor">
      {showExamples && (
        <div className="mb-2">
          <button 
            type="button"
            onClick={toggleExamples}
            className="text-sm text-indigo-600 hover:text-indigo-800 inline-flex items-center"
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Show me examples of good descriptions
          </button>
          
          <div ref={examplesRef} className="hidden mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            <h4 className="font-medium text-gray-900 mb-2">Examples of Good Hackathon Descriptions:</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li><strong>Be specific about the problem statement</strong> - Clearly define what participants will be building and why it matters.</li>
              <li><strong>Include detailed rules and guidelines</strong> - Explain team formation, submission process, and judging criteria.</li>
              <li><strong>List available resources</strong> - Mention available APIs, tools, mentors, or workshops that will help participants.</li>
              <li><strong>Highlight unique aspects</strong> - What makes your hackathon special? Special guests, unique prizes, or networking opportunities?</li>
              <li><strong>Provide a timeline</strong> - Break down the schedule for the entire event including breaks, submissions, and presentations.</li>
            </ul>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800">
              <p className="font-medium">Pro Tip:</p>
              <p>Use formatting options to organize your content with headings, lists, and callouts for better readability!</p>
            </div>
          </div>
        </div>
      )}
        
      <div data-color-mode={theme}>
        <MDEditor
          value={value}
          onChange={onChange}
          preview={previewOpen ? "preview" : "edit"}
          height={height}
          placeholder={placeholder}
          commands={[
            'bold', 'italic', 'quote', 'link', 'image', 'divider',
            'unordered-list', 'ordered-list', 'code', 'codeblock',
            ...extraCommands
          ]}
          extraCommands={extraCommands}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
          highlightEnable={true}
          className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Markdown and HTML supported</span>
        <span>Drag images or click the image button to upload</span>
      </div>
    </div>
  );
};

export default AdvancedEditor; 