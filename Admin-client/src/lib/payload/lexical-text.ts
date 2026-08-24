// Payload's richText fields store Lexical's editor-state JSON, not plain
// strings. Building a full rich text editor UI is out of scope here — these
// helpers convert plain text (one Textarea) to/from the minimal valid
// Lexical structure so the custom dashboard can read/write richText fields
// without needing the Lexical editor itself. A document edited this way
// loses formatting if it already had any (bold, links, etc.) — acceptable
// for the simple/structured content model this dashboard targets.

type LexicalTextNode = { type: 'text'; text: string; version: 1 }
type LexicalParagraphNode = {
  type: 'paragraph'
  children: LexicalTextNode[]
  version: 1
}
type LexicalRoot = {
  root: {
    type: 'root'
    children: LexicalParagraphNode[]
    direction: 'ltr' | null
    format: ''
    indent: 0
    version: 1
  }
}

export function textToLexical(text: string): LexicalRoot {
  const paragraphs = text.split('\n')
  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs.map((line) => ({
        type: 'paragraph',
        version: 1,
        children: line ? [{ type: 'text', text: line, version: 1 }] : [],
      })),
    },
  }
}

export function lexicalToText(value: unknown): string {
  if (!value || typeof value !== 'object' || !('root' in value)) {
    return ''
  }
  const root = (value as LexicalRoot).root
  if (!root?.children) {
    return ''
  }
  return root.children
    .map((paragraph) =>
      (paragraph.children ?? []).map((node) => node.text ?? '').join(''),
    )
    .join('\n')
}
