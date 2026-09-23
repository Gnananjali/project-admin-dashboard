import { useEffect, useState } from "react";

// Returns `value`, but only updates after `delay` ms of no changes.
// Used so the search box doesn't fire an API call on every keystroke.
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
