export interface ConfirmDialogData {
  title: string;
  message: string;
  tipoConfirmacion: TipoConfirmacion;
  confirmText?: string;
  cancelText?: string;
}

export type TipoConfirmacion = 'BORRAR' | 'CONFIRMAR';
