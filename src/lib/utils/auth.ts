export function getApiUrl(): string {
  const isDocker = process.env.DOCKER_ENV === 'true';
  const internalApiUrl = process.env.INTERNAL_API_URL;
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (isDocker) {
    return validateUrl(internalApiUrl, 'http://shiftpilot-api:80');
  }

  return validateUrl(publicApiUrl, 'http://localhost:8000');
}

export function validateUrl(url: string | undefined, fallback: string): string {
  if (!url) return fallback;

  try {
    new URL(url);
    return url;
  } catch {
    console.warn(`Invalid URL configured: ${url}, using fallback: ${fallback}`);
    return fallback;
  }
}
