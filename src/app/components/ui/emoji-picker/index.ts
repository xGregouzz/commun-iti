import { ref, computed } from "vue";

const emojiPickerSize = 350;
const isShown = ref(false);
const isRootRendered = ref(false);
const position = ref<{ x?: number; y?: number }>({});
const rootSetup = {
  isSetuped: false
};
const registeredListeners = new Map<HTMLElement, (emoji: string) => void>();
let currentElement: HTMLElement | null = null;

export function useEmojiPicker() {
  function show(element: HTMLElement, location?: { x?: number; y?: number }) {
    if (!isRootRendered.value) {
      isRootRendered.value = true;
    }

    position.value.x = location?.x;
    position.value.y = location?.y;

    isShown.value = true;
    currentElement = element;
  }

  function hide() {
    isShown.value = false;
    currentElement = null;
  }

  function onEmojiPicked(element: HTMLElement, listener: (emoji: string) => void) {
    registeredListeners.set(element, listener);
  }

  function offEmojiPicked(element: HTMLElement) {
    registeredListeners.delete(element);
  }

  function fireEmojiPicked(emoji: string) {
    if (currentElement) {
      const listener = registeredListeners.get(currentElement);

      if (listener) {
        setTimeout(() => listener(emoji));
      }
    }
  }

  return {
    emojiPickerSize,
    isShown,
    isRootRendered,
    rootSetup,
    position,
    show,
    hide,
    onEmojiPicked,
    offEmojiPicked,
    fireEmojiPicked
  };
}
