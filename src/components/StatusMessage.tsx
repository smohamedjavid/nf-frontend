interface StatusMessageProps {
  type: "success" | "error";
  message: string;
  className?: string;
}

export function StatusMessage({
  type,
  message,
  className = "",
}: StatusMessageProps) {
  const baseClasses = "p-3 rounded border";
  const typeClasses =
    type === "success"
      ? "bg-green-900/50 border-green-700 text-green-200"
      : "bg-red-900/50 border-red-700 text-red-200";

  return (
    <div className={`${baseClasses} ${typeClasses} ${className}`}>
      {message}
    </div>
  );
}
