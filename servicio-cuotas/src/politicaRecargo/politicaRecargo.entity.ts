export class PoliticaRecargo {
  constructor(
    public diasHasta: number, // CP
    public porcentaje: number,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
// Sancion maxima en politicaBiblioteca
