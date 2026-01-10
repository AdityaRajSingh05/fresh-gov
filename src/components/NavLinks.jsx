// Import React and forwardRef to allow ref forwarding
import React, { forwardRef } from 'react';

// Import NavLink from react-router-dom (renamed to avoid naming conflict)
import { NavLink as RouterNavLink } from 'react-router-dom';

// Utility function to conditionally join class names
// Example: cn("base", isActive && "active")
import { cn } from '@/lib/utils';

/**
 * Custom NavLink Component
 *
 * This component wraps React Router's NavLink to:
 * - Support active and pending class names
 * - Work nicely with Tailwind CSS
 * - Forward refs to the underlying <a> element
 */
const NavLink = forwardRef(
  (
    {
      className,         // Base CSS classes (always applied)
      activeClassName,   // Applied when route is active
      pendingClassName,  // Applied while navigation is pending
      to,                // Destination route
      ...props           // Any other NavLink props (end, replace, etc.)
    },
    ref                 // Forwarded ref to the <a> tag
  ) => {
    return (
      <RouterNavLink
        ref={ref} // Attach forwarded ref to the anchor element
        to={to}   // Route path

        /*
          React Router provides isActive and isPending
          We use them to conditionally apply CSS classes
        */
        className={({ isActive, isPending }) =>
          cn(
            className,                  // Always applied
            isActive && activeClassName, // Only when route is active
            isPending && pendingClassName // Only when navigation is pending
          )
        }

        // Pass all remaining props to RouterNavLink
        {...props}
      />
    );
  }
);

// Helpful for debugging and React DevTools
NavLink.displayName = 'NavLink';

// Export the component
export { NavLink };