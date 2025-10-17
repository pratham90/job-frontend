const API_BASE = "https://job-assis-povz.onrender.com";
console.log('[API] Using API_BASE:', API_BASE);

export const api = {
  recommend: (clerkId: string, params?: Record<string, string | number | undefined>) => {
    const search = params
      ? `?${new URLSearchParams(
          Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
            if (v !== undefined && v !== null) acc[k] = String(v);
            return acc;
          }, {})
        ).toString()}`
      : "";
    return `${API_BASE}/api/recommend/${clerkId}${search}`;
  },
  saved: (clerkId: string) => `${API_BASE}/api/recommend/saved/${clerkId}`,
  liked: (clerkId: string) => `${API_BASE}/api/recommend/liked/${clerkId}`,
  swipe: () => `${API_BASE}/api/recommend/swipe`,
  removeSaved: () => `${API_BASE}/api/recommend/saved/remove`,
  removeLiked: () => `${API_BASE}/api/recommend/liked/remove`,
};



