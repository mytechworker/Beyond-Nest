export interface BaseAreaDto {
    title: string;
    description?: string;
    helpText?: string;
    type: 'abundance' | 'focus' | 'action';
    abundanceAreaId?: string;
    focusAreaId?: string;
  }
  