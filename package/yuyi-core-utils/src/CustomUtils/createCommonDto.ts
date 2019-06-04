import CommonDto from "../CommonDto";
export function createCommonDto<M extends object>(model: M): CommonDto<M> {
  return new CommonDto(model);
}
