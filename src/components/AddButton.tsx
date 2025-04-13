
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

const AddButton = ({ onClick, className, label }: AddButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 bg-accent-teal hover:bg-accent-teal/90 text-white py-2 px-4 rounded-full",
        className
      )}
    >
      <div className="flex items-center justify-center rounded-full bg-white/20 p-1">
        <Plus className="h-4 w-4" />
      </div>
      {label && <span>{label}</span>}
    </button>
  );
};

export default AddButton;
