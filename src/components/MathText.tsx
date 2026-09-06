import katex from "katex";

interface MathTextProps {
  value: string;
  block?: boolean;
  className?: string;
}

export function MathText({ value, block = false, className }: MathTextProps) {
  const html = katex.renderToString(value, {
    displayMode: block,
    throwOnError: false,
    strict: false,
  });
  return (
    <span
      className={className}
      aria-label={value}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
