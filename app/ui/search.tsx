'use client';

// Need to use debouncing for this component to make sure that each keystroke doesn't trigger a sql query
// How Debouncing Works:
// Trigger Event: When an event that should be debounced (like a keystroke in the search box) occurs, a timer starts.
// Wait: If a new event occurs before the timer expires, the timer is reset.
// Execution: If the timer reaches the end of its countdown, the debounced function is executed.
// Install with 'pnpm i use-debounce'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname(); //console.log("Pathname:", pathname)
  const { replace } = useRouter(); //console.log("Replace", replace)
  
  const handleSearch = useDebouncedCallback((term: string) => {
    // URLSearchParams is a Web API that provides utility methods for manipulating the 
    // URL query parameters. Instead of creating a complex string literal, you can use 
    // it to get the params string like ?page=1&query=a.
    //
    // Here's a breakdown of what's happening:
    // - ${pathname} is the current path, in your case, "/dashboard/invoices".
    // - As the user types into the search bar, params.toString() translates this input into a URL-friendly format.
    // - replace(${pathname}?${params.toString()}) updates the URL with the user's search data. For example, /dashboard/invoices?query=lee if the user searches for "Lee".
    // - The URL is updated without reloading the page, thanks to Next.js's client-side navigation (which you learned about in the chapter on navigating between pages.

    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Set 1 by default for new searches
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300) // only execute if the use hasn't typed for 300ms

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={e => {
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get('query')?.toString()} // To ensure the input field is in sync with the URL and will be populated when sharing
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}

// defaultValue vs. value / Controlled vs. Uncontrolled

// If you're using state to manage the value of an input, you'd use the value attribute to make it a
// controlled component. This means React would manage the input's state.

// However, since you're not using state, you can use defaultValue. This means the native input will 
// manage its own state. This is okay since you're saving the search query to the URL instead of state.