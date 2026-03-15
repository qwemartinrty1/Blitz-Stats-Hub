import { useState } from "react";
import { Layout } from "@/components/layout";
import { TacButton, TacCard, TacBadge, FadeIn, cn } from "@/components/ui/tactical";
import { MessageSquare, Heart, Share2, Flame, Medal, Send, Star } from "lucide-react";

type PostType = "text" | "battle_result" | "achievement" | "tank_review";

interface BattleResult {
  tank_name: string;
  damage_dealt: number;
  frags: number;
  xp: number;
  result: "win" | "loss" | "draw";
  map_name: string;
}

interface Post {
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
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author_nickname: "TankAce_2024",
    author_clan_tag: "ELITE",
    content: "Just hit 60% winrate across 8,000 battles! Feels good. IS-7 is carrying me hard lately. The armor is just ridiculous at this tier.",
    likes_count: 42,
    comments_count: 8,
    is_liked: false,
    post_type: "text",
    battle_result: null,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 2,
    author_nickname: "BlitzMaster",
    author_clan_tag: "PRO",
    content: "What a game on Black Goldville! Triple MOE on the T-62A finally achieved after 850 battles in her. Worth every second.",
    likes_count: 87,
    comments_count: 15,
    is_liked: true,
    post_type: "battle_result",
    battle_result: {
      tank_name: "T-62A",
      damage_dealt: 6847,
      frags: 5,
      xp: 4230,
      result: "win",
      map_name: "Black Goldville",
    },
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 3,
    author_nickname: "SteelWarrior",
    author_clan_tag: null,
    content: "Object 430U full review after 400 battles:\n\n✅ Insane hull armor\n✅ Great DPM\n✅ Fast for a heavy-ish medium\n❌ Turret can be penned by tier 10s\n❌ Gun depression is only -5°\n\nOverall: 9/10 — one of the strongest tier 10 meds in the game.",
    likes_count: 31,
    comments_count: 12,
    is_liked: false,
    post_type: "tank_review",
    battle_result: null,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 4,
    author_nickname: "ProTanker_EU",
    author_clan_tag: "CLAN",
    content: "Finally unlocked the IS-7 after months of grinding through the IS-3! 3,000 battles in the IS-3 really paid off — my skills are so much sharper now.",
    likes_count: 55,
    comments_count: 6,
    is_liked: false,
    post_type: "achievement",
    battle_result: null,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 5,
    author_nickname: "IronCommander",
    author_clan_tag: "IRON",
    content: "Horrible loss streak today. 7 defeats in a row. Teammates keep yoloing into the enemy without any plan. Taking a break for today. 😤",
    likes_count: 19,
    comments_count: 22,
    is_liked: false,
    post_type: "text",
    battle_result: null,
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 6,
    author_nickname: "TankHunter99",
    author_clan_tag: null,
    content: "Desert Sands is the worst map in the game, change my mind. All it takes is one HT camping the middle and the whole team is frozen for 7 minutes.",
    likes_count: 134,
    comments_count: 47,
    is_liked: true,
    post_type: "text",
    battle_result: null,
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    id: 7,
    author_nickname: "ArmoredFist_EU",
    author_clan_tag: "FIST",
    content: "Crazy clutch! Down to 1v3 in the IS-7 on Fort Despair and pulled through somehow. Bounced 4 shots in a row at the end. Heart was pounding the whole time.",
    likes_count: 201,
    comments_count: 33,
    is_liked: false,
    post_type: "battle_result",
    battle_result: {
      tank_name: "IS-7",
      damage_dealt: 8124,
      frags: 3,
      xp: 5671,
      result: "win",
      map_name: "Fort Despair",
    },
    created_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
  },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Avatar({ name }: { name: string }) {
  const hash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const hue = hash % 360;
  return (
    <div
      className="w-full h-full"
      style={{ backgroundColor: `hsl(${hue}, 55%, 18%)`, borderBottom: `2px solid hsl(${hue}, 80%, 50%)` }}
    />
  );
}

function PostTypeIcon({ type }: { type: PostType }) {
  if (type === "battle_result") return <Flame className="w-3.5 h-3.5 text-tactical-orange" />;
  if (type === "achievement") return <Medal className="w-3.5 h-3.5 text-tactical-yellow" />;
  if (type === "tank_review") return <Star className="w-3.5 h-3.5 text-[#c64cff]" />;
  return <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />;
}

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <TacCard className="p-5">
      <div className="flex gap-4">
        <div className="w-11 h-11 bg-secondary border border-white/10 flex-shrink-0 overflow-hidden">
          <Avatar name={post.author_nickname} />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold font-sans text-base">{post.author_nickname}</span>
                {post.author_clan_tag && (
                  <span className="text-primary font-display font-bold tracking-widest text-xs">
                    [{post.author_clan_tag}]
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground font-display tracking-widest uppercase">
                <PostTypeIcon type={post.post_type} />
                <span>{post.post_type.replace("_", " ")}</span>
                <span className="mx-1 opacity-40">•</span>
                <span>{timeAgo(post.created_at)}</span>
              </div>
            </div>
          </div>

          <p className="text-foreground/90 font-sans text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {post.battle_result && (
            <div className="p-4 border border-white/10 bg-black/40">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className="font-display font-bold text-base tracking-wider text-glow">
                  {post.battle_result.tank_name}
                </span>
                <TacBadge variant={post.battle_result.result === "win" ? "success" : post.battle_result.result === "loss" ? "danger" : "warning"}>
                  {post.battle_result.result}
                </TacBadge>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Damage</div>
                  <div className="text-lg font-bold">{post.battle_result.damage_dealt.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Frags</div>
                  <div className="text-lg font-bold">{post.battle_result.frags}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">XP</div>
                  <div className="text-lg font-bold text-tactical-yellow">{post.battle_result.xp.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Map</div>
                  <div className="text-xs font-sans text-muted-foreground mt-1">{post.battle_result.map_name}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 pt-3 border-t border-white/5">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 text-xs font-display uppercase tracking-wider transition-colors",
                liked ? "text-primary" : "text-muted-foreground hover:text-white"
              )}
            >
              <Heart className={cn("w-4 h-4", liked && "fill-primary")} />
              {likesCount}
            </button>
            <button className="flex items-center gap-2 text-xs font-display uppercase tracking-wider text-muted-foreground hover:text-white transition-colors">
              <MessageSquare className="w-4 h-4" />
              {post.comments_count}
            </button>
            <button className="flex items-center gap-2 text-xs font-display uppercase tracking-wider text-muted-foreground hover:text-white transition-colors ml-auto">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </TacCard>
  );
}

export default function Feed() {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<PostType>("text");
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const handleSubmit = () => {
    if (!content.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      author_nickname: "You",
      author_clan_tag: null,
      content: content.trim(),
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      post_type: postType,
      battle_result: null,
      created_at: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    setContent("");
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full space-y-6">
        <FadeIn>
          <header className="mb-2">
            <h1 className="text-4xl md:text-5xl text-glow mb-1 uppercase tracking-widest">Intel Feed</h1>
            <p className="text-muted-foreground font-sans text-sm">Global network activity and battle reports.</p>
          </header>
        </FadeIn>

        <FadeIn delay={0.05}>
          <TacCard className="p-4 md:p-5 border-primary/20 bg-black/40">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-secondary border border-white/10 flex-shrink-0 overflow-hidden">
                <Avatar name="You" />
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Transmit communication to the network..."
                  rows={3}
                  className="w-full bg-transparent border-none text-foreground resize-none focus:outline-none font-sans text-sm"
                />
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                  <div className="flex gap-2">
                    {(["text", "battle_result", "achievement"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setPostType(t)}
                        className={cn(
                          "px-3 py-1 text-xs font-display uppercase tracking-wider transition-colors",
                          postType === t
                            ? "bg-primary/20 text-primary border border-primary/50"
                            : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-transparent"
                        )}
                      >
                        {t.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                  <TacButton size="sm" onClick={handleSubmit} disabled={!content.trim()}>
                    <Send className="w-4 h-4 mr-2" /> Transmit
                  </TacButton>
                </div>
              </div>
            </div>
          </TacCard>
        </FadeIn>

        <div className="space-y-4">
          {posts.map((post, i) => (
            <FadeIn key={post.id} delay={0.1 + i * 0.05}>
              <PostCard post={post} />
            </FadeIn>
          ))}
        </div>
      </div>
    </Layout>
  );
}
