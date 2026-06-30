"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function LessonContent({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none
      prose-headings:font-bold prose-headings:tracking-tight
      prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
      prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
      prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground/80
      prose-strong:text-foreground prose-strong:font-semibold
      prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-muted prose-pre:rounded-xl prose-pre:border prose-pre:text-xs
      prose-table:text-sm prose-table:w-full
      prose-th:bg-muted/60 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-xs prose-th:uppercase prose-th:tracking-wide
      prose-td:px-4 prose-td:py-2 prose-td:border-b prose-td:text-sm
      prose-li:text-sm prose-li:leading-relaxed
      prose-ul:my-3 prose-ol:my-3
      prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-lg prose-blockquote:py-1
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Wide tables (common in SAP content) shouldn't push the whole page
          // sideways on mobile — let them scroll horizontally on their own.
          table(props) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { node, ...rest } = props as any;
            void node;
            return (
              <div className="overflow-x-auto -mx-1 my-4">
                <table {...rest} />
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
