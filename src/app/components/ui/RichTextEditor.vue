<script lang="ts" setup>
import * as Quill from "quill";
import { ref, onMounted } from "vue";
import type { DeltaOperation } from "quill";
import type { RichText, RichTextToken } from "@/modules/message/models/domain";

const ENTER_KEY_CODE = 13;

/**
 * Emit "input" event every time the user press "Enter"
 */
const emit = defineEmits<{
  input: [text: RichText];
}>();

const httpRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
const mentionRegex = /@(\w+)/gi;

const editorElement = ref<HTMLDivElement | null>(null);

function parseQuillMessage(delta: { ops: DeltaOperation[] }): RichText | null {
  const richText = {
    tokens: delta.ops
      .map((op) => {
        const result = parseText(httpRegex, op.insert, "link");
        if (result.length > 0) {
          return result;
        }

        return {
          type: "rich" as const,
          value: op.insert as string
        };
      })
      .flat()
      .map((tk) => {
        const result = parseText(mentionRegex, tk.value, "mention");
        if (result.length > 0) {
          return result;
        }

        return tk;
      })
      .flat()
  };

  trim(richText);

  if (richText.tokens.every((t) => !t.value)) {
    return null;
  }

  return richText;
}

function trim(text: RichText) {
  if (text.tokens.length === 0) {
    return;
  }

  const firstToken = text.tokens[0];
  if (firstToken) {
    text.tokens[0] = {
      type: firstToken.type,
      value: firstToken.value.trimStart()
    };
  }

  const lastToken = text.tokens[text.tokens.length - 1];
  if (lastToken) {
    text.tokens[text.tokens.length - 1] = {
      type: lastToken.type,
      value: lastToken.value.trimEnd()
    };
  }
}

function parseText<T extends "link" | "mention">(regexp: RegExp, text: string, type: T) {
  let match: RegExpExecArray | null = regexp.exec(text);
  let prevMatch: RegExpExecArray | null = null;
  const result: RichTextToken[] = [];

  while (match) {
    const startIdx = prevMatch ? prevMatch.index + prevMatch[0].length : 0;
    const beforeText = text.substring(startIdx, match.index);

    const value = match[0];

    result.push(
      {
        type: "rich" as const,
        value: beforeText
      },
      {
        type,
        value
      }
    );

    prevMatch = match;
    match = regexp.exec(text);

    if (!match) {
      const afterText = text.substring(prevMatch.index + value.length);

      result.push({
        type: "rich" as const,
        value: afterText
      });
    }
  }

  return result;
}

function onEnterKeyPressed(delta: any) {
  const richText = parseQuillMessage(delta);
  if (richText) {
    emit("input", richText);
  }
}

onMounted(() => {
  /**
   * Setup Quill editor
   */
  const quillEditor = new Quill(editorElement.value!);

  quillEditor.keyboard.bindings[ENTER_KEY_CODE].unshift({
    key: ENTER_KEY_CODE,
    ctrlKey: false,

    handler: () => {
      onEnterKeyPressed(quillEditor.getContents());
      quillEditor.setContents([]);
      return false;
    }
  });

  quillEditor.keyboard.bindings[ENTER_KEY_CODE].unshift({
    key: ENTER_KEY_CODE,
    ctrlKey: true,

    handler: () => {
      quillEditor.insertText(quillEditor.getText().length, "\n");
      quillEditor.setSelection(quillEditor.getText().length);
      return true;
    }
  });
});
</script>

<template>
  <div ref="editorElement" class="rich-text-editor"></div>
</template>

<style lang="scss" scoped>
.rich-text-editor {
  max-height: calc(60vh - 80px);
  height: unset;
}
</style>
