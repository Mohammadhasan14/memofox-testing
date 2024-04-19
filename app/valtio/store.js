import { proxy, useSnapshot } from "valtio";

export const store = proxy({
    data: {
        shopData: {}
    },
    toast:{
        error:false,
        active:false,
        message:''
    }
  });
