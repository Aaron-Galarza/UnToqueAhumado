"use client";

import React from "react";

interface ConfirmButtonProps {
  isDisabled: boolean;
  onClick: () => void;
  mode?: "fixed" | "inline";
}

export function ConfirmButton({
  isDisabled,
  onClick,
  mode = "fixed",
}: ConfirmButtonProps) {
  const isFixed = mode === "fixed";

  return (
    <div
      className={
        isFixed
          ? "fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent z-50"
          : "mt-10"
      }
    >
      <div className={isFixed ? "max-w-3xl mx-auto px-4" : "flex justify-center"}>
        <button 
          disabled={isDisabled}
          onClick={onClick}
          className={
            isFixed
              ? "w-full bg-primary text-primary-foreground font-extrabold text-lg py-4 rounded-xl shadow-lg hover:bg-primary/90 hover:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
              : "w-full md:w-auto md:min-w-100 bg-primary text-primary-foreground font-extrabold text-lg md:text-xl py-4 md:py-3 px-4 md:px-14 rounded-xl shadow-lg hover:bg-primary/90 hover:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
          }
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  );
}
