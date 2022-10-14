import preprocess from "svelte-preprocess";
// Openevse hostname for dev proxy

const config = {
  preprocess: [
    preprocess({
      scss: {
        prependData: '@use "src/variables.scss" as *;',
      },
    }),
  ],
};

export default config;
