'use client';
import { useEffect, useRef } from 'react';
import { useI18n } from './provider';

/** Normalise whitespace for consistent key lookup (handles multiline JSX strings). */
function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * TextTranslator — invisible component, mounted in root layout.
 * On every locale change it: (1) restores all text nodes to their original
 * English values, then (2) replaces nodes whose normalised text matches a
 * translation key.  Always restoring first makes direct switching (FR→JA)
 * work correctly without going through English.
 */
export function TextTranslator() {
  const { translations, locale } = useI18n();
  const originalTexts = useRef<Map<Text, string>>(new Map());

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Step 1 — always restore every known text node to its original English value.
    // This is what makes FR→JA work: we start from English, not from French.
    originalTexts.current.forEach((orig, node) => {
      if (document.body.contains(node)) node.textContent = orig;
    });

    // Step 2 — if switching back to English (empty translations) we are done.
    if (Object.keys(translations).length === 0) return;

    // Step 3 — walk DOM text nodes and record any we haven't seen yet.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const updates: Array<[Text, string]> = [];

    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      const raw = node.textContent ?? '';
      if (!raw.trim()) continue;

      // Snapshot original the first time we encounter this node.
      if (!originalTexts.current.has(node)) {
        originalTexts.current.set(node, raw);
      }

      // Normalise whitespace so multiline JSX strings match DOM collapsed text.
      const key = normalize(originalTexts.current.get(node)!);
      const translated = translations[key];
      if (translated && translated !== key) {
        updates.push([node, translated]);
      }
    }

    updates.forEach(([node, text]) => { node.textContent = text; });
  }, [translations, locale]);

  return null;
}
