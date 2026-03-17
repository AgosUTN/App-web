import { Autor } from "./autor.entity";
import { AutorReadDTO } from "./dtos/autorRead.dto";

export class AutorMapper {
  static toReadDTO(autor: Autor): AutorReadDTO {
    return {
      id: autor.id!,
      nombrecompleto: autor.nombrecompleto,
    };
  }
}
