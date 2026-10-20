import React from 'react';

export interface MelodyAnimatedLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBolt?: boolean;
  isAnimated?: boolean;
  className?: string;
}

export const MelodyAnimatedLogo: React.FC<MelodyAnimatedLogoProps> = ({
  size = 'sm',
  showBolt = true,
  isAnimated = true,
  className = '',
}) => {
  // Sizing definitions matching Google Stitch design system
  const configs = {
    xs: {
      container: 'w-[28px] h-[28px]',
      ringPadding: 'p-[1.5px]',
      innerGap: 'gap-[1.5px]',
      barWidth: 'w-[2px]',
      barBoxHeight: 'h-[16px]',
      boltBadge: 'w-[12px] h-[12px] -bottom-[1px] -right-[1px]',
      boltIconSize: 'text-[8px]',
      bars: [
        { initialHeight: '35%', color: 'bg-[#ff5e3a]', animClass: 'melody-eq-bar-1' },
        { initialHeight: '70%', color: 'bg-[#ff453a]', animClass: 'melody-eq-bar-2' },
        { initialHeight: '90%', color: 'bg-[#5b42f3]', animClass: 'melody-eq-bar-3' },
        { initialHeight: '65%', color: 'bg-[#3830a3]', animClass: 'melody-eq-bar-4' },
        { initialHeight: '40%', color: 'bg-[#0d9488]', animClass: 'melody-eq-bar-5' },
      ],
    },
    sm: {
      container: 'w-[36px] h-[36px]',
      ringPadding: 'p-[2px]',
      innerGap: 'gap-[2.5px]',
      barWidth: 'w-[2.5px]',
      barBoxHeight: 'h-[20px]',
      boltBadge: 'w-[14px] h-[14px] -bottom-[2px] -right-[2px]',
      boltIconSize: 'text-[9px]',
      bars: [
        { initialHeight: '35%', color: 'bg-[#ff5e3a]', animClass: 'melody-eq-bar-1' },
        { initialHeight: '72%', color: 'bg-[#ff453a]', animClass: 'melody-eq-bar-2' },
        { initialHeight: '95%', color: 'bg-[#5b42f3]', animClass: 'melody-eq-bar-3' },
        { initialHeight: '75%', color: 'bg-[#3830a3]', animClass: 'melody-eq-bar-4' },
        { initialHeight: '42%', color: 'bg-[#0d9488]', animClass: 'melody-eq-bar-5' },
      ],
    },
    md: {
      container: 'w-[48px] h-[48px]',
      ringPadding: 'p-[2.5px]',
      innerGap: 'gap-[3px]',
      barWidth: 'w-[3px]',
      barBoxHeight: 'h-[26px]',
      boltBadge: 'w-[18px] h-[18px] -bottom-[2px] -right-[2px]',
      boltIconSize: 'text-[11px]',
      bars: [
        { initialHeight: '35%', color: 'bg-[#ff5e3a]', animClass: 'melody-eq-bar-1' },
        { initialHeight: '72%', color: 'bg-[#ff453a]', animClass: 'melody-eq-bar-2' },
        { initialHeight: '95%', color: 'bg-[#5b42f3]', animClass: 'melody-eq-bar-3' },
        { initialHeight: '75%', color: 'bg-[#3830a3]', animClass: 'melody-eq-bar-4' },
        { initialHeight: '42%', color: 'bg-[#0d9488]', animClass: 'melody-eq-bar-5' },
      ],
    },
    lg: {
      container: 'w-[80px] h-[80px]',
      ringPadding: 'p-[3px]',
      innerGap: 'gap-[4px]',
      barWidth: 'w-[5px]',
      barBoxHeight: 'h-[44px]',
      boltBadge: 'w-[24px] h-[24px] bottom-0 right-0',
      boltIconSize: 'text-[15px]',
      bars: [
        { initialHeight: '35%', color: 'bg-[#ff5e3a]', animClass: 'melody-eq-bar-1' },
        { initialHeight: '72%', color: 'bg-[#ff453a]', animClass: 'melody-eq-bar-2' },
        { initialHeight: '95%', color: 'bg-[#5b42f3]', animClass: 'melody-eq-bar-3' },
        { initialHeight: '75%', color: 'bg-[#3830a3]', animClass: 'melody-eq-bar-4' },
        { initialHeight: '42%', color: 'bg-[#0d9488]', animClass: 'melody-eq-bar-5' },
      ],
    },
    xl: {
      container: 'w-[112px] h-[112px]',
      ringPadding: 'p-1',
      innerGap: 'gap-[5px]',
      barWidth: 'w-[6px]',
      barBoxHeight: 'h-[62px]',
      boltBadge: 'w-[28px] h-[28px] bottom-1 right-0',
      boltIconSize: 'text-[18px]',
      bars: [
        { initialHeight: '35%', color: 'bg-[#ff5e3a]', animClass: 'melody-eq-bar-1' },
        { initialHeight: '72%', color: 'bg-[#ff453a]', animClass: 'melody-eq-bar-2' },
        { initialHeight: '95%', color: 'bg-[#5b42f3]', animClass: 'melody-eq-bar-3' },
        { initialHeight: '75%', color: 'bg-[#3830a3]', animClass: 'melody-eq-bar-4' },
        { initialHeight: '42%', color: 'bg-[#0d9488]', animClass: 'melody-eq-bar-5' },
        { initialHeight: '30%', color: 'bg-[#155544]', animClass: 'melody-eq-bar-6' },
      ],
    },
  };

  const cfg = configs[size];

  return (
    <div
      className={`relative ${cfg.container} flex items-center justify-center flex-shrink-0 select-none ${className}`}
    >
      {/* Outer Tactile Gradient Disc Ring */}
      <div
        className={`w-full h-full rounded-full bg-gradient-to-tr from-secondary-container via-primary-container to-primary shadow-[0_3px_12px_rgba(66,29,219,0.22)] flex items-center justify-center ${cfg.ringPadding}`}
      >
        {/* Inner Cream / White Inset Plate */}
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden">
          {/* Animated Equalizer Soundstage Wrapper */}
          <div
            className={`flex items-end justify-center ${cfg.innerGap} ${cfg.barBoxHeight} w-full px-[3px]`}
          >
            {cfg.bars.map((bar, idx) => (
              <span
                key={idx}
                className={`rounded-full ${cfg.barWidth} ${bar.color} ${
                  isAnimated ? bar.animClass : ''
                } origin-bottom transition-all duration-300`}
                style={{
                  height: isAnimated ? '100%' : bar.initialHeight,
                  willChange: 'transform',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Orbit Floating Bolt Badge */}
      {showBolt && (
        <div
          className={`absolute ${cfg.boltBadge} rounded-full bg-[#fe5d39] text-white flex items-center justify-center shadow-md ring-[1.5px] ring-white z-10 select-none ${
            isAnimated ? 'bolt-badge-anim' : ''
          }`}
        >
          <span
            className={`material-symbols-outlined ${cfg.boltIconSize} leading-none`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
        </div>
      )}
    </div>
  );
};
