import { cn } from '@/lib/utils';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'outline' | 'ghost' | 'success';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
    children,
    onClick,
    disabled,
    variant = "primary",
    className = "",
    type = "button"
}: ButtonProps) => {
    const base = "flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100";
    const variants: Record<string, string> = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        outline: "border border-slate-200 text-slate-500 hover:bg-slate-50",
        ghost: "text-slate-400 hover:bg-slate-100",
        success: "bg-emerald-500 text-white"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(base, variants[variant], className)}
        >
            {children}
        </button>
    );
};
