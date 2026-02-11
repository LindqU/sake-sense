import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card = ({ children, className = "", onClick }: CardProps) => (
    <div
        onClick={onClick}
        className={cn(
            "bg-white rounded-2xl shadow-sm border border-slate-100",
            className,
            onClick && "cursor-pointer active:scale-[0.98] transition-all"
        )}
    >
        {children}
    </div>
);
