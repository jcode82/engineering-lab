import React from "react";

export default function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    info: "border-blue-300 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300",
    warning:
      "border-yellow-300 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300",
    danger:
      "border-red-300 bg-red-50 text-red-900 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300",
  };

  return (
    <div
      className={`my-6 border-l-4 p-4 rounded ${colors[type]}`}
      role="alert"
    >
      {children}
    </div>
  );
}
