import { createContext, useContext, useState, ReactNode } from "react";

export type PostType = "text" | "battle_result" | "achievement" | "tank_review";

export interface BattleResult {
  tank_name: string;
  damage_dealt: number;
  frags: number;
  xp: number;
  result: "win" | "loss" | "draw";
  map_name: string;
}

export interface Comment {
  id: number;
  post_id: number;
  author_nickname: string;
  author_clan_tag: string | null;
  content: string;
  created_at: string;
  is_own: boolean;
}

export interface Post {
  id: number;
  author_nickname: string;
  author_clan_tag: string | null;
  content: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  post_type: PostType;
  battle_result: BattleResult | null;
  created_at: string;
  is_own: boolean;
}

const INITIAL_COMMENTS: Comment[] = [
  { id: 1, post_id: 1, author_nickname: "BlitzMaster", author_clan_tag: "PRO", content: "That IS-7 armor is absolutely insane — I've had tier 10 AP rounds bounce off it so many times!", created_at: new Date(Date.now() - 600_000).toISOString(), is_own: false },
  { id: 2, post_id: 1, author_nickname: "SteelWarrior", author_clan_tag: null, content: "60% WR is crazy bro, massive gratz! What equipment setup are you running on it?", created_at: new Date(Date.now() - 300_000).toISOString(), is_own: false },
  { id: 3, post_id: 2, author_nickname: "TankAce_2024", author_clan_tag: "ELITE", content: "Triple MOE is HUGE. That's 850 battles of pure commitment. Absolute respect.", created_at: new Date(Date.now() - 1_800_000).toISOString(), is_own: false },
  { id: 4, post_id: 2, author_nickname: "IronCommander", author_clan_tag: "IRON", content: "6847 damage in the T-62A is insane! What map were you on?", created_at: new Date(Date.now() - 900_000).toISOString(), is_own: false },
  { id: 5, post_id: 2, author_nickname: "GunnerPro", author_clan_tag: "GPR", content: "5 frags = Radley-Walters medal! You legend 😤", created_at: new Date(Date.now() - 600_000).toISOString(), is_own: false },
  { id: 6, post_id: 6, author_nickname: "ArmoredFist_EU", author_clan_tag: "FIST", content: "Desert Sands is literally designed for passive campers. 100% agree with you.", created_at: new Date(Date.now() - 1_200_000).toISOString(), is_own: false },
  { id: 7, post_id: 6, author_nickname: "ProTanker_EU", author_clan_tag: "CLAN", content: "Pro tip: take a medium with good gun depression and abuse the central ridge. Changes the whole map.", created_at: new Date(Date.now() - 600_000).toISOString(), is_own: false },
  { id: 8, post_id: 7, author_nickname: "TankHunter99", author_clan_tag: null, content: "1v3 clutch in the IS-7?! You're built different. That's a highlight reel moment fr.", created_at: new Date(Date.now() - 1_500_000).toISOString(), is_own: false },
  { id: 9, post_id: 7, author_nickname: "Destroyer_X", author_clan_tag: "DEX", content: "8124 damage in a SINGLE BATTLE. That's one of the best IS-7 games I've seen posted here.", created_at: new Date(Date.now() - 900_000).toISOString(), is_own: false },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author_nickname: "TankAce_2024",
    author_clan_tag: "ELITE",
    content: "Just hit 60% winrate across 8,000 battles! Feels good. IS-7 is carrying me hard lately. The armor is just ridiculous at this tier.",
    likes_count: 42,
    comments_count: 2,
    is_liked: false,
    post_type: "text",
    battle_result: null,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    is_own: false,
  },
  {
    id: 2,
    author_nickname: "BlitzMaster",
    author_clan_tag: "PRO",
    content: "What a game on Black Goldville! Triple MOE on the T-62A finally achieved after 850 battles in her. Worth every second.",
    likes_count: 87,
    comments_count: 3,
    is_liked: true,
    post_type: "battle_result",
    battle_result: { tank_name: "T-62A", damage_dealt: 6847, frags: 5, xp: 4230, result: "win", map_name: "Black Goldville" },
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    is_own: false,
  },
  {
    id: 3,
    author_nickname: "SteelWarrior",
    author_clan_tag: null,
    content: "Object 430U full review after 400 battles:\n\n✅ Insane hull armor\n✅ Great DPM\n✅ Fast for a heavy-ish medium\n❌ Turret can be penned by tier 10s\n❌ Gun depression is only -5°\n\nOverall: 9/10 — one of the strongest tier 10 meds in the game.",
    likes_count: 31,
    comments_count: 0,
    is_liked: false,
    post_type: "tank_review",
    battle_result: null,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    is_own: false,
  },
  {
    id: 4,
    author_nickname: "ProTanker_EU",
    author_clan_tag: "CLAN",
    content: "Finally unlocked the IS-7 after months of grinding through the IS-3! 3,000 battles in the IS-3 really paid off — my skills are so much sharper now.",
    likes_count: 55,
    comments_count: 0,
    is_liked: false,
    post_type: "achievement",
    battle_result: null,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    is_own: false,
  },
  {
    id: 5,
    author_nickname: "IronCommander",
    author_clan_tag: "IRON",
    content: "Horrible loss streak today. 7 defeats in a row. Teammates keep yoloing into the enemy without any plan. Taking a break for today.",
    likes_count: 19,
    comments_count: 0,
    is_liked: false,
    post_type: "text",
    battle_result: null,
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    is_own: false,
  },
  {
    id: 6,
    author_nickname: "TankHunter99",
    author_clan_tag: null,
    content: "Desert Sands is the worst map in the game, change my mind. All it takes is one HT camping the middle and the whole team is frozen for 7 minutes.",
    likes_count: 134,
    comments_count: 2,
    is_liked: true,
    post_type: "text",
    battle_result: null,
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    is_own: false,
  },
  {
    id: 7,
    author_nickname: "ArmoredFist_EU",
    author_clan_tag: "FIST",
    content: "Crazy clutch! Down to 1v3 in the IS-7 on Fort Despair and pulled through somehow. Bounced 4 shots in a row at the end. Heart was pounding the whole time.",
    likes_count: 201,
    comments_count: 2,
    is_liked: false,
    post_type: "battle_result",
    battle_result: { tank_name: "IS-7", damage_dealt: 8124, frags: 3, xp: 5671, result: "win", map_name: "Fort Despair" },
    created_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    is_own: false,
  },
];

interface PostsContextValue {
  posts: Post[];
  comments: Comment[];
  addPost: (post: Omit<Post, "id" | "likes_count" | "comments_count" | "is_liked" | "created_at" | "is_own">) => number;
  updatePost: (id: number, patch: Partial<Omit<Post, "id">>) => void;
  deletePost: (id: number) => void;
  toggleLike: (postId: number) => void;
  addComment: (postId: number, content: string) => void;
  deleteComment: (commentId: number) => void;
}

const PostsContext = createContext<PostsContextValue | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);

  const addPost = (data: Omit<Post, "id" | "likes_count" | "comments_count" | "is_liked" | "created_at" | "is_own">) => {
    const id = Date.now();
    setPosts((prev) => [{
      ...data,
      id,
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
      is_own: true,
    }, ...prev]);
    return id;
  };

  const updatePost = (id: number, patch: Partial<Omit<Post, "id">>) => {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p));
  };

  const deletePost = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setComments((prev) => prev.filter((c) => c.post_id !== id));
  };

  const toggleLike = (postId: number) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      return { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 };
    }));
  };

  const addComment = (postId: number, content: string) => {
    const newComment: Comment = {
      id: Date.now(),
      post_id: postId,
      author_nickname: "You",
      author_clan_tag: null,
      content,
      created_at: new Date().toISOString(),
      is_own: true,
    };
    setComments((prev) => [...prev, newComment]);
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p));
  };

  const deleteComment = (commentId: number) => {
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setPosts((prev) => prev.map((p) => p.id === comment.post_id ? { ...p, comments_count: Math.max(0, p.comments_count - 1) } : p));
  };

  return (
    <PostsContext.Provider value={{ posts, comments, addPost, updatePost, deletePost, toggleLike, addComment, deleteComment }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used within PostsProvider");
  return ctx;
}
