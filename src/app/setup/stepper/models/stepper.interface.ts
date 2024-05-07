export interface IStep {
  label: string;
  active: boolean;
}

export interface IContentItem {
  id: number;
  type: string;
  content: string;
  required: boolean;

  title?: string;
  description?: string;
  icon?: string;
}

export interface IContent {
  steps: IContentItem[][];
}
