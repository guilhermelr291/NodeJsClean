//aqui vamos deixar apenas os protocolos genéricos, que servem para qualquer controlador.

export * from './controller';
export * from './http';
export * from './validation';
export * from './middleware';
// export * from './email-validator'; removemos aqui pois esse arquivo deve ser um atalho para os protocolos GENÉRICOS para qualquer controlador. O e-mail validator é exclusivo do SignUpController.

//IMPORTANT vamos criar uma pasta signup e, dentro dela, um sign-up protocols
