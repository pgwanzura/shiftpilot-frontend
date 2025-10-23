export interface FormQuestionInputProps {
  index: number;
  disabled?: boolean;
  onRemove?: () => void;
  canRemove?: boolean;
}

export interface FormRefereeInputProps {
  index: number;
  disabled?: boolean;
  onRemove?: () => void;
  canRemove?: boolean;
}

export interface SectionHeaderProps {
  icon: string;
  title: string;
  description?: string;
}

export interface TipProps {
  type?: 'info' | 'best-practice';
  message: string;
}
