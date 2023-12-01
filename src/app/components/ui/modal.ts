import { ref, type Ref, type UnwrapRef } from "vue";
import type { FormInstance } from "element-plus";

export function useFormModal<T>(defaultValue: T, form: Ref<FormInstance | null>, initialValue?: T) {
  const isVisible = ref(false);
  const formModel = ref(initialValue ?? defaultValue);

  function show(model?: T) {
    reset();

    if (model) {
      formModel.value = model as UnwrapRef<T>;
    }

    isVisible.value = true;
  }

  function hide() {
    isVisible.value = false;
  }

  function reset() {
    formModel.value = defaultValue as UnwrapRef<T>;

    if (form.value) {
      form.value.resetFields();
    }
  }

  return {
    isVisible,
    formModel,
    show,
    hide,
    reset
  };
}
