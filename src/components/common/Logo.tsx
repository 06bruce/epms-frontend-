import React from 'react';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
    const iconSizes = {
        sm: 'w-6 h-6 text-sm',
        md: 'w-8 h-8 text-lg',
        lg: 'w-12 h-12 text-2xl'
    };

    const textSizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-3xl'
    };

    const roundedSizes = {
        sm: 'rounded-md',
        md: 'rounded-lg',
        lg: 'rounded-xl'
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`${iconSizes[size]} bg-slate-900 ${roundedSizes[size]} flex items-center justify-center`}>
                <span className="text-white font-bold">E</span>
            </div>
            {showText && (
                <span className={`${textSizes[size]} font-bold tracking-tight text-slate-900`}>
                    EPMS
                </span>
            )}
        </div>
    );
};

export default Logo;
