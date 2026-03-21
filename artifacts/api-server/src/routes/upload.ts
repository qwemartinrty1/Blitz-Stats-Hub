import { Router } from "express";
import multer from "multer";
import { supabase, MEDIA_BUCKET } from "../lib/supabase";

const router = Router();

// Store file in memory so we can forward the buffer to Supabase Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB cap
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Unsupported file type: ${file.mimetype}`));
  },
});

// POST /api/upload
// Multipart form: field "file" = the binary, field "user_id" = uploader's id
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "validation", message: "No file provided" });
      return;
    }

    const userId  = (req.body.user_id as string) || "anonymous";
    const ext     = req.file.originalname.split(".").pop() ?? "bin";
    const isVideo = req.file.mimetype.startsWith("video/");
    const folder  = isVideo ? "videos" : "images";
    const path    = `${folder}/${userId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

    res.status(201).json({
      url:        publicUrl,
      path,
      media_type: isVideo ? "video" : "image",
      size:       req.file.size,
      mime:       req.file.mimetype,
    });
  } catch (err: any) {
    console.error("[POST /upload]", err);
    res.status(500).json({ error: "upload_failed", message: err.message });
  }
});

// DELETE /api/upload  — remove a file from storage
router.delete("/", async (req, res) => {
  try {
    const { path } = req.body;
    if (!path) { res.status(400).json({ error: "validation", message: "path is required" }); return; }

    const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    if (error) throw error;

    res.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE /upload]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

export default router;
