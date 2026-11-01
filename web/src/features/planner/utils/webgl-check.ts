/**
 * Deterministic check for WebGL support in the user's browser environment.
 * Allows graceful fallback to 2D canvas when WebGL is unavailable or disabled.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!(gl && gl instanceof WebGLRenderingContext);
  } catch {
    return false;
  }
}

