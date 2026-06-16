// Run: node create-bucket.mjs
import { createClient } from "@supabase/supabase-js";

const url = "https://xqeqjutulgxiwfkuflla.supabase.co";
// Paste your service_role key below (from Supabase > Settings > API)
const serviceKey = process.env.SUPABASE_SERVICE_KEY ?? "";

if (!serviceKey) {
  console.error("Set SUPABASE_SERVICE_KEY env var");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function run() {
  // Create bucket
  const { error: bucketErr } = await supabase.storage.createBucket("media", {
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"],
  });
  if (bucketErr && !bucketErr.message.includes("already exists")) {
    console.error("Bucket error:", bucketErr.message);
  } else {
    console.log("✓ Bucket 'media' ready");
  }

  // Insert new settings
  const newSettings = [
    { key: "browser_video_url", value: "" },
    { key: "browser_image_url", value: "" },
  ];
  for (const s of newSettings) {
    const { error } = await supabase.from("site_settings").upsert(s, { onConflict: "key" });
    if (error) console.error(`Settings error (${s.key}):`, error.message);
    else console.log(`✓ Setting '${s.key}' ready`);
  }

  console.log("\nDone. Now upload media from /admin on the site.");
}

run();
