import { ref } from "vue";

const isShown = ref(false);

export function useRightMenuState() {
  function show() {
    isShown.value = true;
  }

  function hide() {
    isShown.value = false;
  }

  function toggle() {
    isShown.value = !isShown.value;
  }

  return {
    isShown,
    show,
    hide,
    toggle
  };
}
