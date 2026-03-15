import { useState } from "react";
import { Layout } from "@/components/layout";
import { useListPosts, useCreatePost, useLikePost, type Post } from "@workspace/api-client-react";
import { TacButton, TacCard, TacInput, TacBadge, FadeIn, cn } from "@/components/ui/tactical";
import { MessageSquare, Heart, Share2, Flame, AlertCircle, Medal, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Feed() {
  const { data: postsData, isLoading, refetch } = useListPosts({ limit: 20 });
  const createPostMutation = useCreatePost();
  
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<"text" | "battle_result" | "achievement" | "tank_review">("text");

  const handleCreatePost = () => {
    if (!content.trim()) return;
    createPostMutation.mutate({
      data: { content, postType }
    }, {
      onSuccess: () => {
        setContent("");
        refetch();
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full space-y-8">
        
        <FadeIn>
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl text-glow mb-2">Intel Feed</h1>
            <p className="text-muted-foreground font-sans">Global network activity and battle reports.</p>
          </header>
        </FadeIn>

        {/* Create Post Transmit Box */}
        <FadeIn delay={0.1}>
          <TacCard className="p-4 md:p-6 border-primary/20 bg-black/40 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-secondary clip-edges-sm flex items-center justify-center flex-shrink-0">
                <UserAvatar seed="me" />
              </div>
              <div className="flex-1 space-y-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Transmit communication to the network..."
                  className="w-full bg-transparent border-none text-foreground resize-none focus:outline-none focus:ring-0 font-sans min-h-[80px]"
                />
                
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                  <div className="flex gap-2">
                    {(["text", "battle_result", "achievement"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setPostType(type)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-display uppercase tracking-wider clip-edges-sm transition-colors",
                          postType === type 
                            ? "bg-primary/20 text-primary border border-primary/50" 
                            : "bg-white/5 text-muted-foreground hover:bg-white/10"
                        )}
                      >
                        {type.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  <TacButton 
                    size="sm" 
                    onClick={handleCreatePost} 
                    isLoading={createPostMutation.isPending}
                    disabled={!content.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Transmit
                  </TacButton>
                </div>
              </div>
            </div>
          </TacCard>
        </FadeIn>

        {/* Feed List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <TacCard key={i} className="h-48 animate-pulse bg-white/5 border-white/10" />
              ))}
            </div>
          ) : postsData?.posts.map((post, i) => (
            <FadeIn key={post.id} delay={0.2 + (i * 0.1)}>
              <PostItem post={post} onUpdate={refetch} />
            </FadeIn>
          ))}
          
          {postsData?.posts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground border border-dashed border-white/10 bg-black/20">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-display text-xl uppercase tracking-widest">No Transmissions Found</p>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}

function PostItem({ post, onUpdate }: { post: Post, onUpdate: () => void }) {
  const likeMutation = useLikePost();

  const handleLike = () => {
    likeMutation.mutate({ postId: post.id }, {
      onSuccess: () => onUpdate()
    });
  };

  const getTypeIcon = () => {
    switch(post.post_type) {
      case "battle_result": return <Flame className="w-4 h-4 text-tactical-orange" />;
      case "achievement": return <Medal className="w-4 h-4 text-tactical-yellow" />;
      default: return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <TacCard className="p-5">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-secondary clip-edges-sm flex items-center justify-center flex-shrink-0 border border-white/10">
          <UserAvatar seed={post.author_nickname} />
        </div>
        
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold font-sans text-lg">{post.author_nickname}</span>
                {post.author_clan_tag && (
                  <span className="text-primary font-display font-bold tracking-widest text-sm">
                    [{post.author_clan_tag}]
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                {getTypeIcon()}
                <span className="uppercase font-display tracking-widest">{post.post_type.replace('_', ' ')}</span>
                <span className="mx-1">•</span>
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="text-foreground/90 font-sans whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>

          {/* Battle Result Attachment */}
          {post.battle_result && (
            <div className="mt-4 p-4 border border-white/10 bg-black/40 rounded-sm">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <span className="font-display font-bold text-lg text-glow tracking-wider">{post.battle_result.tank_name}</span>
                <TacBadge variant={post.battle_result.result === 'win' ? 'success' : post.battle_result.result === 'loss' ? 'danger' : 'warning'}>
                  {post.battle_result.result}
                </TacBadge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Damage</div>
                  <div className="text-xl font-bold">{post.battle_result.damage_dealt.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Frags</div>
                  <div className="text-xl font-bold">{post.battle_result.frags}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Base XP</div>
                  <div className="text-xl font-bold text-tactical-yellow">{post.battle_result.xp}</div>
                </div>
              </div>
            </div>
          )}

          {/* Image Attachment */}
          {post.image_url && (
            <div className="mt-4 border border-white/10 rounded-sm overflow-hidden">
              <img src={post.image_url} alt="Attachment" className="w-full h-auto max-h-96 object-cover" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 pt-4 mt-2 border-t border-white/5">
            <button 
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className={cn(
                "flex items-center gap-2 text-sm font-display uppercase tracking-wider transition-colors",
                post.is_liked ? "text-primary text-glow" : "text-muted-foreground hover:text-white"
              )}
            >
              <Heart className={cn("w-4 h-4", post.is_liked && "fill-primary")} />
              {post.likes_count}
            </button>
            <button className="flex items-center gap-2 text-sm font-display uppercase tracking-wider text-muted-foreground hover:text-white transition-colors">
              <MessageSquare className="w-4 h-4" />
              {post.comments_count}
            </button>
            <button className="flex items-center gap-2 text-sm font-display uppercase tracking-wider text-muted-foreground hover:text-white transition-colors ml-auto">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </TacCard>
  );
}

// Simple deterministic avatar generator
function UserAvatar({ seed }: { seed: string }) {
  const hash = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const hue = hash % 360;
  return (
    <div 
      className="w-full h-full" 
      style={{ backgroundColor: `hsl(${hue}, 60%, 20%)`, border: `2px solid hsl(${hue}, 80%, 50%)` }}
    />
  );
}
