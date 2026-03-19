import { PoliticaBibliotecaReadDTO } from "./dtos/politicaBibliotecaRead.dto";
import { PoliticaBiblioteca } from "./politicaBiblioteca.entity";

export class PoliticaBibliotecaMapper {
  static toReadDTO(politica: PoliticaBiblioteca): PoliticaBibliotecaReadDTO {
    return {
      diasPrestamo: politica.diasPrestamo,
      diasSancionMaxima: politica.diasSancionMaxima,
      cantPendientesMaximo: politica.cantPendientesMaximo,
    };
  }
}
