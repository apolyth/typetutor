import { cn } from "@/lib/utils";

interface TypeIconProps extends React.SVGProps<SVGSVGElement> {
  typeName: string;
}

export const TypeIcon = ({ typeName, className, ...props }: TypeIconProps) => {
  const iconProps = {
    className: cn("h-6 w-6", className),
    ...props,
  };

  switch (typeName) {
    case 'Normal':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
    case 'Fire':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c2.4 2.4 3.6 5.1 3.6 8.4 0 3.3-1.2 6-3.6 8.4-2.4-2.4-3.6-5.1-3.6-8.4 0-3.3 1.2-6 3.6-8.4z" />
          <path d="M12 12a4.8 4.8 0 104.8 4.8A4.8 4.8 0 0012 12z" />
        </svg>
      );
    case 'Water':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0L12 2.69z" />
        </svg>
      );
    case 'Electric':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'Grass':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l-3 4h6l-3-4z" />
          <path d="M12 22V6" />
          <path d="M12 6a4 4 0 100-8 4 4 0 000 8z" transform="rotate(45 12 6)" />
        </svg>
      );
    case 'Ice':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l-2 4h4l-2-4z" />
          <path d="M12 22l2-4h-4l2 4z" />
          <path d="M2 12l4-2v4l-4-2z" />
          <path d="M22 12l-4-2v4l4-2z" />
          <path d="M5.64 5.64l2.82 2.82" />
          <path d="M15.54 15.54l2.82 2.82" />
          <path d="M5.64 18.36l2.82-2.82" />
          <path d="M15.54 8.46l2.82-2.82" />
        </svg>
      );
    case 'Fighting':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      );
    case 'Poison':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l-4.24 4.24-1.42 1.42A2 2 0 005.66 10H5a2 2 0 00-2 2v2a2 2 0 002 2h.66a2 2 0 001.41.59l1.42 1.42L12 21.31l4.24-4.24 1.42-1.42a2 2 0 00.59-1.41V14a2 2 0 00-2-2h-.66a2 2 0 00-1.41-.59l-1.42-1.42L12 2.69z" />
        </svg>
      );
    case 'Ground':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h20" />
          <path d="M5 12V7h14v5" />
          <path d="M5 12v5h14v-5" />
        </svg>
      );
    case 'Flying':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.7 7.7a7 7 0 10-11.4 0" />
          <path d="M12 14a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      );
    case 'Psychic':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4a8 8 0 100 16 8 8 0 000-16z" />
          <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      );
    case 'Bug':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20a8 8 0 100-16 8 8 0 000 16z" />
          <path d="M12 14a2 2 0 100-4 2 2 0 000 4z" />
          <path d="M4 12h1" />
          <path d="M19 12h1" />
          <path d="M12 4V3" />
          <path d="M12 21v-1" />
          <path d="M6.3 6.3L5.6 5.6" />
          <path d="M18.4 18.4l-.7-.7" />
          <path d="M6.3 17.7l-.7.7" />
          <path d="M18.4 5.6l-.7.7" />
        </svg>
      );
    case 'Rock':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case 'Ghost':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 10h.01" />
          <path d="M15 10h.01" />
          <path d="M12 2a8 8 0 00-8 8v12l3-3 2 3 2-3 2 3 2-3 3 3V10a8 8 0 00-8-8z" />
        </svg>
      );
    case 'Dragon':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      );
    case 'Dark':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      );
    case 'Steel':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l-2.12 6.88H2l5.5 4.25-2.13 6.87L12 15.25l6.63 4.75-2.13-6.87L22 8.88h-7.88L12 2z" />
        </svg>
      );
    case 'Fairy':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
};
