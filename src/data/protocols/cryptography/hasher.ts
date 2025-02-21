export interface Hasher {
  hash(value: string): Promise<string>;
  //vale reparar que nao usamos async na assinatura da interface,
  // somente na implementação do método.
}
