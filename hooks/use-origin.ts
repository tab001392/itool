import { useEffect, useState } from "react";

export function useOrigin(): string {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return "";
  }

  return typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : "";
}
