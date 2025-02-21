export interface Encrypter {
  encrypt(value: string): Promise<string>;
  //vale reparar que nao usamos async na assinatura da interface,
  // somente na implementação do método.
}
