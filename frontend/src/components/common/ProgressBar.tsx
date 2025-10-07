import { FC } from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

/**
 * Renders a fixed top progress indicator with a subtle track.
 */
export const ProgressBar: FC<ProgressBarProps> = ({ progress, className = '' }) => {
  return (
    <div
      className={`fixed top-0 inset-x-0 h-1.5 pointer-events-none z-[999] ${className}`.trim()}
      aria-hidden
    >
      <div
        className="absolute inset-0 bg-slate-200/40"
        style={{
          opacity: progress > 0 ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
      <div
        className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 shadow-sm rounded-br-full rounded-tr-full"
        style={{
          width: `${progress}%`,
          opacity: progress > 0 ? 1 : 0,
          transition: 'width 0.35s ease, opacity 0.3s ease',
        }}
      />
    </div>
  );
};
