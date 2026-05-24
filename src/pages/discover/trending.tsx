import { TrendingUI } from "@/modules/discover/trending";

// The page is now just a thin shell — all the state + query orchestration
// happens inside <TrendingUI>, because each tab panel runs its own
// useTrending query and the page-level wrapper has nothing else to add.
const Trending = () => <TrendingUI />;

export { Trending };
