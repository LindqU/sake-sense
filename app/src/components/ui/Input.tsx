import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
}

export const Input = ({ label, icon, className = "", ...props }: InputProps) => (
    <div className="space-y-1.5 w-full">
        {label && (
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                {label}
            </label>
        )}
        <div className="relative group">
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    {icon}
                </div>
            )}
            <input
                className={`
                    w-full h-12 bg-white border border-slate-100 rounded-2xl shadow-sm
                    px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                    outline-none transition-all placeholder:text-slate-300 text-slate-700
                    ${icon ? 'pl-11' : ''}
                    ${className}
                `}
                {...props}
            />
        </div>
    </div>
);
