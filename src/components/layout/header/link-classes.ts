// The lit state - instant by design (no transition): the selection is
// always exactly where you are.
export const activeClass = "bg-primary text-foreground";

// The compact/fit steps only apply in the desktop header - the mobile
// sheet reuses this class below compact, where they never fire.
export const linkClass =
  "rounded-lg px-4 py-2 compact:px-3 compact:py-1.5 fit:px-4 fit:py-2 text-foreground hover:bg-foreground/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
