import React from 'react';

/**
 * Lightweight editorial markdown renderer to format headers, blockquotes,
 * bold text, code, lists, and clean paragraphs without bulky external dependencies.
 */
export const EditorialMarkdown: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];

  const formatInline = (text: string): React.ReactNode => {
    // Bold: **text**
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-stone-900 dark:text-stone-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800/80 font-mono text-[0.88em] text-editorial-accent"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code block
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${i}`}
            className="my-6 p-4 rounded-xl bg-stone-900 text-stone-100 dark:bg-[#0E0D0B] font-mono text-xs sm:text-sm overflow-x-auto border border-stone-800"
          >
            <code>{codeBlockContent.join('\n')}</code>
          </pre>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={`empty-${i}`} className="h-4" />);
      continue;
    }

    // H1: # Title
    if (line.startsWith('# ')) {
      elements.push(
        <h1
          key={`h1-${i}`}
          className="font-serif text-3xl sm:text-4xl font-bold mt-8 mb-4 text-editorial-lightText dark:text-editorial-darkText"
        >
          {line.replace('# ', '')}
        </h1>
      );
      continue;
    }

    // H2: ## Subtitle
    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="font-serif text-2xl sm:text-3xl font-bold mt-7 mb-3 text-editorial-lightText dark:text-editorial-darkText"
        >
          {line.replace('## ', '')}
        </h2>
      );
      continue;
    }

    // H3: ### Section
    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="font-serif text-xl sm:text-2xl font-bold mt-6 mb-2 text-editorial-lightText dark:text-editorial-darkText"
        >
          {line.replace('### ', '')}
        </h3>
      );
      continue;
    }

    // Blockquote: > Quote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-6 pl-5 py-2 border-l-4 border-editorial-accent font-serif italic text-lg text-stone-700 dark:text-stone-300 bg-stone-50/50 dark:bg-stone-900/30 rounded-r-lg"
        >
          {formatInline(line.replace('> ', ''))}
        </blockquote>
      );
      continue;
    }

    // Unordered List: - item or * item
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      elements.push(
        <li
          key={`li-${i}`}
          className="ml-6 list-disc my-1 text-stone-700 dark:text-stone-300 leading-relaxed"
        >
          {formatInline(line.trim().substring(2))}
        </li>
      );
      continue;
    }

    // Regular Paragraph
    elements.push(
      <p
        key={`p-${i}`}
        className="my-3 text-stone-700 dark:text-stone-300 leading-editorial text-base sm:text-lg font-normal"
      >
        {formatInline(line)}
      </p>
    );
  }

  return <div className="editorial-prose select-text">{elements}</div>;
};

export default EditorialMarkdown;
