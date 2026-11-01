const noop = () => undefined;

export function useRouter() {
  return {
    back: noop,
    forward: noop,
    prefetch: noop,
    push: noop,
    refresh: noop,
    replace: noop,
  };
}

export function usePathname() {
  return "/";
}

export function useSearchParams() {
  return new URLSearchParams();
}

export function useParams() {
  return {};
}

export function redirect() {
  return undefined;
}

export function notFound() {
  return undefined;
}
