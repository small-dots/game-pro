import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";

export const useResponseStore = defineStore({
  id: "app-manage-res",
  state: () => ({
    allReponseData: null,
  }),
  getters: {},
  actions: {
    setResData(data) {
      this.allReponseData = data;
    },
  },
  persist: piniaPersistConfig("app-manage-res")
});
