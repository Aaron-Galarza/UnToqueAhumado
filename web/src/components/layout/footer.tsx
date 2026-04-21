export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border py-4 md:py-6 relative z-10">
      <div className="container mx-auto px-4 max-w-3xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="https://res.cloudinary.com/dwqxdensk/image/upload/v1774491741/image_so7u3x.png"
            alt="Un Toque Ahumado"
            className="w-8 h-8 grayscale opacity-40 shrink-0"
          />
          <div>
            <p className="text-[10px] font-extrabold text-secondary-foreground uppercase tracking-wider leading-tight">
              Un Toque Ahumado
            </p>
            <p className="text-[9px] font-medium text-muted-foreground">
              &copy; {new Date().getFullYear()} Todos los derechos reservados
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-medium text-muted-foreground leading-tight">
            Desarrollado por
          </p>
          <p className="text-[10px] font-extrabold text-primary tracking-wide">
            AFdevelopers
          </p>
        </div>
      </div>
    </footer>
  );
}
