import axios from "axios";
import { APP_CONFIG } from "./env";

export const DEFAULT_HTTP = axios.create({
  baseURL: APP_CONFIG.serverUrl
});
