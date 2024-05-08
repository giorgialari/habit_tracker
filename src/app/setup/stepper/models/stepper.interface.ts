export interface IStep {
  label: string;
  active: boolean;

  title: string;
  description: string;
  isLast: boolean;
  icon: string;
}

export interface IContentItem {
  id: number;
  type: string;
  content: string;
  required: boolean;
  name: string; // Da utilizzare  per il formControlName solo per i campi di tipo text e number

  title?: string;
  description?: string;
  icon?: string;
}

export interface IContent {
  steps: IContentItem[][];
}
