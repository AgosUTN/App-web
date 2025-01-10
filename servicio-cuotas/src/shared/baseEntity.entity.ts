export class baseEntity {
  constructor(
    public id?: number,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
