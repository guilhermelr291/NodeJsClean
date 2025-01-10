module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3', //bom colocarmos a mesma versão do ambiente de produção aq.
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
  },
};
