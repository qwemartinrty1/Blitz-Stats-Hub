import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PostsProvider } from "@/lib/posts-context";
import { AuthProvider } from "@/lib/auth-context";

// Pages
import Feed from "./pages/feed";
import PostEditor from "./pages/post-editor";
import Search from "./pages/search";
import Tournaments from "./pages/tournaments";
import TournamentDetail from "./pages/tournament-detail";
import PlayerProfile from "./pages/player-profile";
import MyProfile from "./pages/my-profile";
import Settings from "./pages/settings";
import Login from "./pages/login";
import AuthCallback from "./pages/auth-callback";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Feed} />
      <Route path="/posts/new" component={PostEditor} />
      <Route path="/posts/:id/edit" component={PostEditor} />
      <Route path="/search" component={Search} />
      <Route path="/tournaments" component={Tournaments} />
      <Route path="/tournaments/:id" component={TournamentDetail} />
      <Route path="/players/:id" component={PlayerProfile} />
      <Route path="/my-profile" component={MyProfile} />
      <Route path="/settings" component={Settings} />
      <Route path="/login" component={Login} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PostsProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </PostsProvider>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
