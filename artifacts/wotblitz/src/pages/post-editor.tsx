import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Layout } from "@/components/layout";
import { TacCard, TacButton, FadeIn, TacBadge, cn } from "@/components/ui/tactical";
import { usePosts, type PostType, type BattleResult } from "@/lib/posts-context";
import {
  FileEdit, MessageSquare, Flame, Medal, Star,
  ChevronDown, ChevronUp, ArrowLeft, Send, Sword
} from "lucide-react";

const MAP_OPTIONS = [
  "Black Goldville", "Fort Despair", "Desert Sands", "Lost Temple",
  "Rockfield", "Canal", "Himmelsdorf", "Mines", "Ruinberg", "Prokhorovka",
];

const TANK_OPTIONS = [
  "IS-7", "T-62A", "Object 430U", "E 50 Ausf. M", "Object 277",
  "Centurion Action X", "IS-3", "T-44", "AMX 50B", "Leopard 1",
];

type PostTypeOption = { value: PostType; label: string; icon: React.ReactNode; desc: string };
const POST_TYPES: PostTypeOption[] = [
  { value: "text", label: "Transmission", icon: <MessageSquare className="w-4 h-4" />, desc: "Share a thought or update" },
  { value: "battle_result", label: "Battle Report", icon: <Flame className="w-4 h-4 text-tactical-orange" />, desc: "Post a battle result" },
  { value: "achievement", label: "Achievement", icon: <Medal className="w-4 h-4 text-tactical-yellow" />, desc: "Share a milestone" },
  { value: "tank_review", label: "Tank Review", icon: <Star className="w-4 h-4 text-[#c64cff]" />, desc: "Review a vehicle" },
];

function Avatar({ name }: { name: string }) {
  const hash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const hue = hash % 360;
  return (
    <div
      className="w-full h-full flex items-center justify-center font-display font-bold text-sm"
      style={{ backgroundColor: `hsl(${hue}, 55%, 18%)`, color: `hsl(${hue}, 80%, 65%)` }}
    >
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
}

export default function PostEditor() {
  const [, setLocation] = useLocation();
  const [matchEdit, paramsEdit] = useRoute("/posts/:id/edit");
  const { posts, addPost, updatePost } = usePosts();

  const editId = matchEdit ? parseInt(paramsEdit.id) : null;
  const existingPost = editId ? posts.find((p) => p.id === editId) : null;
  const isEdit = !!existingPost;

  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<PostType>("text");
  const [showBattle, setShowBattle] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult>({
    tank_name: "IS-7",
    damage_dealt: 0,
    frags: 0,
    xp: 0,
    result: "win",
    map_name: "Black Goldville",
  });

  useEffect(() => {
    if (existingPost) {
      setContent(existingPost.content);
      setPostType(existingPost.post_type);
      if (existingPost.battle_result) {
        setBattleResult(existingPost.battle_result);
        setShowBattle(true);
      }
    }
  }, [existingPost?.id]);

  useEffect(() => {
    setShowBattle(postType === "battle_result");
  }, [postType]);

  const setBR = <K extends keyof BattleResult>(key: K, value: BattleResult[K]) =>
    setBattleResult((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const data = {
      author_nickname: "You",
      author_clan_tag: null,
      content: content.trim(),
      post_type: postType,
      battle_result: showBattle ? battleResult : null,
    };
    if (isEdit && editId) {
      updatePost(editId, data);
      setLocation("/");
    } else {
      addPost(data);
      setLocation("/");
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full space-y-6">

        <FadeIn>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 text-sm font-display tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Feed
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <header>
            <h1 className="text-3xl md:text-4xl font-bold text-glow uppercase tracking-widest flex items-center gap-3">
              <FileEdit className="w-8 h-8 text-primary" />
              {isEdit ? "Edit Transmission" : "New Transmission"}
            </h1>
            <p className="text-muted-foreground text-sm font-sans mt-1">
              {isEdit ? "Update your post on the network." : "Broadcast a new message to the BlitzNet network."}
            </p>
          </header>
        </FadeIn>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Post type selector */}
          <FadeIn delay={0.08}>
            <TacCard className="p-5">
              <p className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-3">Transmission Type</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {POST_TYPES.map((pt) => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => setPostType(pt.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 border text-center transition-all",
                      postType === pt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/10 bg-white/3 text-muted-foreground hover:bg-white/8 hover:border-white/20"
                    )}
                  >
                    <span className={postType === pt.value ? "text-primary" : ""}>{pt.icon}</span>
                    <span className="text-xs font-display uppercase tracking-wider leading-tight">{pt.label}</span>
                    <span className="text-[10px] text-muted-foreground font-sans">{pt.desc}</span>
                  </button>
                ))}
              </div>
            </TacCard>
          </FadeIn>

          {/* Author preview */}
          <FadeIn delay={0.1}>
            <TacCard className="p-5">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                <div className="w-10 h-10 bg-secondary border border-white/10 flex-shrink-0 overflow-hidden">
                  <Avatar name="You" />
                </div>
                <div>
                  <div className="font-bold font-sans">You</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-display tracking-widest uppercase mt-0.5">
                    {POST_TYPES.find(p => p.value === postType)?.icon}
                    <span>{POST_TYPES.find(p => p.value === postType)?.label}</span>
                  </div>
                </div>
                <TacBadge variant="default" className="ml-auto text-[10px] bg-primary/10 text-primary border-primary/30">
                  Posting as You
                </TacBadge>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  postType === "battle_result" ? "Describe the battle — what happened, key moments, how you won (or lost)..."
                  : postType === "achievement" ? "Share your milestone — what did you unlock, how long did it take, how does it feel?"
                  : postType === "tank_review" ? "Write your review — strengths, weaknesses, playstyle tips, verdict..."
                  : "What's happening on the network? Share a thought, tip, or update..."
                }
                rows={7}
                className="w-full bg-transparent border border-white/10 focus:border-primary/50 text-foreground p-4 resize-y focus:outline-none font-sans text-sm leading-relaxed transition-colors"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-display uppercase tracking-widest mt-2">
                <span>{wordCount} words</span>
                <span className={charCount > 1000 ? "text-tactical-yellow" : ""}>{charCount} / 2000 chars</span>
              </div>
            </TacCard>
          </FadeIn>

          {/* Battle result panel */}
          {(postType === "battle_result") && (
            <FadeIn delay={0.12}>
              <TacCard className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowBattle(!showBattle)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
                >
                  <span className="flex items-center gap-2 font-display uppercase tracking-widest text-sm text-primary">
                    <Sword className="w-4 h-4" /> Battle Result Attachment
                  </span>
                  {showBattle ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                {showBattle && (
                  <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-display tracking-widest uppercase text-muted-foreground">Vehicle</label>
                        <select
                          value={battleResult.tank_name}
                          onChange={(e) => setBR("tank_name", e.target.value)}
                          className="w-full h-10 px-3 bg-input border border-border text-foreground focus:outline-none focus:border-primary font-sans text-sm appearance-none"
                        >
                          {TANK_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-display tracking-widest uppercase text-muted-foreground">Map</label>
                        <select
                          value={battleResult.map_name}
                          onChange={(e) => setBR("map_name", e.target.value)}
                          className="w-full h-10 px-3 bg-input border border-border text-foreground focus:outline-none focus:border-primary font-sans text-sm appearance-none"
                        >
                          {MAP_OPTIONS.map((m) => <option key={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {(["damage_dealt", "frags", "xp"] as const).map((field) => (
                        <div key={field} className="space-y-1.5">
                          <label className="text-xs font-display tracking-widest uppercase text-muted-foreground">
                            {field === "damage_dealt" ? "Damage" : field === "frags" ? "Frags" : "Base XP"}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={battleResult[field] || ""}
                            onChange={(e) => setBR(field, parseInt(e.target.value) || 0)}
                            className="w-full h-10 px-3 bg-input border border-border text-foreground focus:outline-none focus:border-primary font-sans text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-display tracking-widest uppercase text-muted-foreground">Battle Outcome</label>
                      <div className="flex gap-2">
                        {(["win", "loss", "draw"] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setBR("result", r)}
                            className={cn(
                              "flex-1 py-2 text-xs font-display uppercase tracking-wider border transition-colors",
                              battleResult.result === r
                                ? r === "win" ? "bg-tactical-green/20 text-tactical-green border-tactical-green/50"
                                  : r === "loss" ? "bg-destructive/20 text-destructive border-destructive/50"
                                  : "bg-white/15 text-white border-white/30"
                                : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
                            )}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TacCard>
            </FadeIn>
          )}

          {/* Actions */}
          <FadeIn delay={0.15}>
            <div className="flex items-center justify-between gap-4 pt-2">
              <TacButton type="button" variant="outline" onClick={() => setLocation("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
              </TacButton>
              <TacButton type="submit" size="lg" disabled={!content.trim()}>
                <Send className="w-5 h-5 mr-2" />
                {isEdit ? "Update Transmission" : "Broadcast"}
              </TacButton>
            </div>
          </FadeIn>

        </form>
      </div>
    </Layout>
  );
}
