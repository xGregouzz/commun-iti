<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { AuthenticationService } from "@/modules/authentication/services";
import { ElMessage } from "element-plus";
import { useProvider } from "@/app/platform";
import type { FormInstance, FormRules } from "element-plus";

const [authService] = useProvider([AuthenticationService]);
const router = useRouter();

const loginModel = reactive({
  username: "",
  password: ""
});

const userNameRegex = /^(\w+)$/i;

const loginFormRules = reactive<FormRules>({
  username: [
    {
      required: true,
      message: "Pseudo obligatoire",
      pattern: userNameRegex
    }
  ],
  password: [
    {
      required: true,
      message: "Mot de passe obligatoire",
    }
  ]
});

async function onSubmit(form?: FormInstance) {
  if (!form) {
    return;
  }

  try {
    await form.validate();
  } catch (e) {
    return;
  }

  if (await authService.authenticate(loginModel)) {
    router.push("/app")
    ElMessage({
      showClose: true,
      message: 'Connexion réussie',
      type: 'success',
      duration: 2000
    })
    return;
  }
  ElMessage({
    showClose: true,
    message: 'Pseudo ou mot de passe incorrect',
    type: 'error',
    duration: 2000
  })
}
</script>
<template>
  <div class="login center-children full-h">
    <main class="width-s">
      <h1 class="login-title">Se connecter</h1>

      <div class="login-form">
        <el-form ref="form" :model="loginModel" :rules="loginFormRules" label-position="top" class="login-form"
          @submit.prevent="onSubmit($refs.form as FormInstance)">
          <el-form-item label="Pseudo" prop="username">
            <el-input v-model="loginModel.username" />
          </el-form-item>
          <el-form-item label="Mot de passe" prop="password">
            <el-input v-model="loginModel.password" type="password" />
          </el-form-item>

          <el-form-item>
            <div class="form-actions">
              <el-button type="primary" native-type="submit">Connexion</el-button>
              <router-link to="/register">Je n'ai pas de compte</router-link>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </main>
  </div>
</template>
<style scoped lang="scss">
@use "@/app/styles/var";
@use "@/app/styles/mixins";
@use "sass:list";

.form-actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
