import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { TacButton, TacCard, TacBadge, FadeIn, cn } from "@/components/ui/tactical";
import { usePosts, type Post, type Comment } from "@/lib/posts-context";
import {
  MessageSquare, Heart, Share2, Flame, Medal, Plus,
  Star, Trash2, Edit2, Send, ChevronDown, ChevronUp, X
} from "lucide-react";

type PostType = Post["post_type"];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const hash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const hue = hash % 360;
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  return (
    <div
      className={`w-full h-full flex items-center justify-center font-display font-bold ${textSize}`}
      style={{ backgroundColor: `hsl(${hue}, 55%, 18%)`, color: `hsl(${hue}, 80%, 65%)` }}
    >
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
}

function PostTypeIcon({ type }: { type: PostType }) {
  if (type === "battle_result") return <Flame className="w-3.5 h-3.5 text-tactical-orange" />;
  if (type === "achievement") return <Medal className="w-3.5 h-3.5 text-tactical-yellow" />;
  if (type === "tank_review") return <Star className="w-3.5 h-3.5 text-[#c64cff]" />;
  return <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />;
}

function CommentItem({ comment, onDelete }: { comment: Comment; onDelete: (id: number) => void }) {
  return (
    <div className="flex gap-3 group">
      <div className="w-7 h-7 flex-shrink-0 bg-secondary border border-white/10 overflow-hidden">
        <Avatar name={comment.author_nickname} size="sm" />
      </div>
      <div className="flex-1 min-w-0 bg-white/3 border border-white/5 px-3 py-2">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold font-sans">{comment.author_nickname}</span>
            {comment.author_clan_tag && (
              <span className="text-[10px] text-primary font-display">[{comment.author_clan_tag}]</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] text-muted-foreground font-display tracking-wider">{timeAgo(comment.created_at)}</span>
            {comment.is_own && (
              <button
                onClick={() => onDelete(comment.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs font-sans text-foreground/80 mt-1 leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}

function CommentsSection({ post }: { post: Post }) {
  const { comments, addComment, deleteComment } = usePosts();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const postComments = comments.filter((c) => c.post_id === post.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(post.id, text.trim());
    setText("");
  };

  return (
    <div className="border-t border-white/5 mt-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 pt-3 pb-1 text-xs font-display uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        {open ? "Hide" : "Show"} Comments ({post.comments_count})
        {open ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
      </button>

      {open && (
        <div className="pb-3 space-y-3 mt-2">
          {postComments.length === 0 && (
            <p className="text-xs text-muted-foreground font-sans italic pl-1">No comments yet. Be the first.</p>
          )}
          {postComments.map((c) => (
            <CommentItem key={c.id} comment={c} onDelete={deleteComment} />
          ))}

          {/* Write comment */}
          <form onSubmit={handleSubmit} className="flex gap-2 mt-3 pt-3 border-t border-white/5">
            <div className="w-7 h-7 flex-shrink-0 bg-secondary border border-white/10 overflow-hidden">
              <Avatar name="You" size="sm" />
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 h-8 px-3 bg-input border border-border text-foreground focus:outline-none focus:border-primary font-sans text-xs transition-colors"
              />
              <TacButton type="submit" size="sm" disabled={!text.trim()} className="h-8 px-3">
                <Send className="w-3.5 h-3.5" />
              </TacButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const [, setLocation] = useLocation();
  const { toggleLike, deletePost } = usePosts();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      deletePost(post.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <TacCard className="p-5">
      <div className="flex gap-4">
        <div className="w-11 h-11 bg-secondary border border-white/10 flex-shrink-0 overflow-hidden">
          <Avatar name={post.author_nickname} />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold font-sans text-base">{post.author_nickname}</span>
                {post.author_clan_tag && (
                  <span className="text-primary font-display font-bold tracking-widest text-xs">[{post.author_clan_tag}]</span>
                )}
                {post.is_own && (
                  <TacBadge variant="default" className="text-[10px] bg-primary/10 text-primary border-primary/30">You</TacBadge>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground font-display tracking-widest uppercase">
                <PostTypeIcon type={post.post_type} />
                <span>{post.post_type.replace("_", " ")}</span>
                <span className="mx-1 opacity-40">•</span>
                <span>{timeAgo(post.created_at)}</span>
              </div>
            </div>

            {/* Own post actions */}
            {post.is_own && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setLocation(`/posts/${post.id}/edit`)}
                  className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                  title="Edit post"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className={cn(
                    "p-1.5 transition-colors",
                    confirmDelete
                      ? "text-destructive bg-destructive/10 border border-destructive/30"
                      : "text-muted-foreground hover:text-destructive"
                  )}
                  title={confirmDelete ? "Click again to confirm delete" : "Delete post"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <p className="text-foreground/90 font-sans text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

          {/* Battle result attachment */}
          {post.battle_result && (
            <div className="p-4 border border-white/10 bg-black/40">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className="font-display font-bold text-sm tracking-wider text-glow">{post.battle_result.tank_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-sans">{post.battle_result.map_name}</span>
                  <TacBadge variant={post.battle_result.result === "win" ? "success" : post.battle_result.result === "loss" ? "danger" : "warning"}>
                    {post.battle_result.result}
                  </TacBadge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Damage", value: post.battle_result.damage_dealt.toLocaleString() },
                  { label: "Frags", value: String(post.battle_result.frags) },
                  { label: "XP", value: post.battle_result.xp.toLocaleString(), color: "text-tactical-yellow" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">{label}</div>
                    <div className={cn("text-lg font-bold", color)}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reactions row */}
          <div className="flex items-center gap-5 pt-2 border-t border-white/5">
            <button
              onClick={() => toggleLike(post.id)}
              className={cn(
                "flex items-center gap-1.5 text-xs font-display uppercase tracking-wider transition-colors",
                post.is_liked ? "text-primary" : "text-muted-foreground hover:text-white"
              )}
            >
              <Heart className={cn("w-4 h-4", post.is_liked && "fill-primary")} />
              {post.likes_count}
            </button>
            <button className="flex items-center gap-1.5 text-xs font-display uppercase tracking-wider text-muted-foreground hover:text-white transition-colors">
              <MessageSquare className="w-4 h-4" />
              {post.comments_count}
            </button>
            <button className="flex items-center gap-1.5 text-xs font-display uppercase tracking-wider text-muted-foreground hover:text-white transition-colors ml-auto">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Comments */}
          <CommentsSection post={post} />
        </div>
      </div>
    </TacCard>
  );
}

export default function Feed() {
  const [, setLocation] = useLocation();
  const { posts } = usePosts();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full space-y-5">
        <FadeIn>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl text-glow mb-1 uppercase tracking-widest">Intel Feed</h1>
              <p className="text-muted-foreground font-sans text-sm">Global network activity and battle reports.</p>
            </div>
            <TacButton onClick={() => setLocation("/posts/new")} size="md">
              <Plus className="w-4 h-4 mr-2" /> New Post
            </TacButton>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {posts.length === 0 && (
            <FadeIn>
              <div className="text-center py-20 border border-dashed border-white/10 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-display uppercase tracking-widest">No transmissions yet.</p>
                <TacButton className="mt-4" onClick={() => setLocation("/posts/new")}>
                  <Plus className="w-4 h-4 mr-2" /> Create First Post
                </TacButton>
              </div>
            </FadeIn>
          )}
          {posts.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.04}>
              <PostCard post={post} />
            </FadeIn>
          ))}
        </div>
      </div>
    </Layout>
  );
}
