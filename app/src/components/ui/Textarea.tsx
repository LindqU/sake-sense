import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    icon?: React.ReactNode;
}

export const Textarea = ({ label, icon, className = "", ...props }: TextareaProps) => (
    <div className="space-y-1.5 w-full">
        {label && (
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                {label}
            </label>
        )}
        <div className="relative group">
            {icon && (
                <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    {icon}
                </div>
            )}
            <textarea
                className={`
                    w-full min-h-[120px] bg-white border border-slate-100 rounded-2xl shadow-sm
                    p-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                    outline-none transition-all placeholder:text-slate-300 text-slate-700
                    ${icon ? 'pl-11' : ''}
                    ${className}
                `}
                {...props}
            />
        </div>
    </div>
);
