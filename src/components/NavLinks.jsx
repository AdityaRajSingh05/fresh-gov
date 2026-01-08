import { NavLink as RouterNavLink } from "react-router-dom";
import { forwardRef } from "react";

const NavLink = forwardRef(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) => {
          return [
            className,
            isActive ? activeClassName : null,
            isPending ? pendingClassName : null,
          ]
            .filter(Boolean)
            .join(" ");
        }}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };