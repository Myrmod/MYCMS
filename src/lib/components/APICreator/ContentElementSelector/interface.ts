export type ContentElement = 'select' | 'text' | 'textarea' | 'rte' | 'number' | 'checkbox' | 'radiolist' | 'array' | 'object';

export type ContentElementGroup = 'basic' | 'complex' | 'custom';

export interface SelectItem {
  value: ContentElement;
  label: string;
  group?: ContentElementGroup;
}