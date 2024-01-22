<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useFormModal } from "@/app/components/ui/modal";
import type { FormInstance, FormRules } from "element-plus";
import { useProvider } from "@/app/platform";
import { RoomAPI } from "@/modules/room/services/RoomAPI";
import { RoomService } from "@/modules/room/services/RoomService";
import type { Room } from "@/modules/room/models/domain/Room";

const [roomApi, roomService] = useProvider([RoomAPI, RoomService]);
const form = ref<FormInstance | null>(null);
const loading = ref(false);
const router = useRouter();
const foundRooms = ref<Room[]>([]);

const formRules = reactive<FormRules>({
  roomId: [
    {
      required: true,
      message: "Veuillez sélectionner un salon"
    }
  ]
});

const { isVisible, hide, show, formModel } = useFormModal(
  {
    roomId: ""
  },
  form
);

async function onSubmit(form?: FormInstance) {
  if (!form) {
    return;
  }

  try {
    loading.value = true;
    await form.validate();
    const roomId = formModel.value.roomId
    roomApi.join(roomId)
    hide();
    location.reload()
  } catch (e) {
    return;
  } finally {
    loading.value = false;
  }
}

/**
 * Search rooms that contains the given text.
 * Store the result into foundRooms.
 * @param text 
 */
async function searchRooms(text: string) {
  foundRooms.value = await roomApi.search(text)
}

defineExpose({
  show,
  hide
});
</script>

<template>
  <el-dialog v-model="isVisible" title="Rejoindre un salon" width="30%">
    <el-form ref="form" :model="formModel" :rules="formRules" label-position="top" @submit.prevent="onSubmit(form!)">
      <el-form-item label="Rechercher un salon" prop="roomId">
        <el-select class="search-input" v-model="formModel.roomId" filterable remote reserve-keyword
          placeholder="Tapez le nom du salon" :remote-method="searchRooms" :loading="loading">
          <el-option v-for="item in foundRooms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="form-actions">
        <el-button native-type="reset" @click="hide()">Annuler</el-button>

        <el-button type="primary" native-type="submit" :loading="loading" @click="onSubmit(form!)">
          Rejoindre
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
.search-input {
  width: 100%;
}
</style>