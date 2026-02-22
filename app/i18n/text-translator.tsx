'use client';
import { useEffect, useRef } from 'react';
import { useI18n } from './provider';

/**
 * TextTranslator — invisible component mounted in the root layout.
 * On every locale change it walks the live DOM, finds text nodes whose
 * trimmed content matches a key in the current locale JSON, and swaps
 * them in-place.  This means existing hardcoded JSX text gets translated
 * without touching any source file.
 */
export function TextTranslator() {
  const { translations, locale } = useI18n();
  const originalTexts = useRef<Map<Text, string>>(new Map());

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // On first run (locale = 'en', empty translations) restore original values.
    if (Object.keys(translations).length === 0) {
      originalTexts.current.forEach((orig, node) => {
        if (document.body.contains(node)) node.textContent = orig;
      });
      return;
    }

    // Walk every text node in <body>
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const updates: Array<[Text, string]> = [];

    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      const raw = node.textContent ?? '';
      const trimmed = raw.trim();
      if (!trimmed) continue;

      // Save original text the first time we see this node
      if (!originalTexts.current.has(node)) {
        originalTexts.current.set(node, raw);
      }

      const original = originalTexts.current.get(node)!.trim();
      const translated = translations[original];
      if (translated && translated !== original) {
        updates.push([node, raw.replace(original, translated)]);
      }
    }

    updates.forEach(([node, text]) => { node.textContent = text; });
  }, [translations, locale]);

  return null;
}
