<script lang="ts" setup>
import BgImage from "@/app/components/ui/BgImage.vue";
import { ref, reactive } from "vue";
import { Plus, Edit } from "@element-plus/icons-vue";
import { useFormModal } from "@/app/components/ui/modal";
import type { FormInstance, FormRules, UploadFile } from "element-plus";
import { useProvider } from "@/app/platform";
import { UserAPI } from "@/modules/user/services";
import { AuthenticationService } from "@/modules/authentication/services";
import { MessageService } from "@/modules/message/services/MessageService";

const [userApi, authService, messageService] = useProvider([
  UserAPI,
  AuthenticationService,
  MessageService
]);
const form = ref<FormInstance | null>(null);
const formRules = reactive<FormRules>({
  username: [
    {
      required: true,
      message: "Le pseudo est obligatoire"
    }
  ],
  picture: [
    {
      required: false
    }
  ]
});

const isLoading = ref(false);
const {
  /**
   * Hide the modal
   * */ 
  hide, 
  /**
   * Open the modal
   */
  show, 
  /**
   * Form data
   */
  formModel,
  isVisible, 
} = useFormModal(
  {
    username: "",
    pictureUrl: "",
    picture: null as File | null
  },

  form
);

async function onFileChange(file: UploadFile) {
  const rawFile = file.raw as File;
  formModel.value.picture = rawFile ?? null;
  formModel.value.pictureUrl = await toBase64(rawFile);
}

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

function refreshData() {
  return Promise.all([authService.refreshUserInfo(), messageService.reloadMessages()]);
}

async function onSubmit(form?: FormInstance) {
  if (!form) {
    return;
  }

  try {
    isLoading.value = true;

    // TODO
        
    hide();
  } catch (e) {
    return;
  } finally {
    isLoading.value = false;
  }
}

defineExpose({
  show,
  hide
});
</script>

<template>
  <el-dialog
    class="user-profile-edition"
    v-model="isVisible"
    title="Edition du profil utilisateur"
    width="30%"
  >
    <el-form
      ref="form"
      :model="formModel"
      :rules="formRules"
      label-position="top"
      class="login-form"
      @submit.prevent="onSubmit($refs.form)"
    >
      <el-form-item label="Photo de profil" prop="picture">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          action="#"
          :on-change="onFileChange"
        >
          <bg-image
            v-if="formModel.pictureUrl"
            :src="formModel.pictureUrl"
            class="user-profile-picture"
          >
            <div class="user-profile-picture-edit">
              <el-icon class="avatar-uploader-icon" color="#FFFFFF">
                <Edit />
              </el-icon>
            </div>
          </bg-image>

          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="Pseudo" prop="username">
        <el-input v-model="formModel.username" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="form-actions">
        <el-button
          type="primary"
          native-type="submit"
          @click="onSubmit($refs.form)"
          :loading="isLoading"
        >
          Mettre à jour
        </el-button>

        <el-button native-type="reset" @click="hide()">Annuler</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.user-profile-edition {
  .user-profile-picture {
    width: 178px;
    height: 178px;
    display: block;
    position: relative;

    &:hover {
      > .user-profile-picture-edit {
        opacity: 1;
      }
    }

    > .user-profile-picture-edit {
      opacity: 0;
      height: 100%;
      width: 100%;
      transition: opacity 0.3s ease;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    }
  }
}

.avatar-uploader .user-profile-picture {
}
</style>

<style>
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
