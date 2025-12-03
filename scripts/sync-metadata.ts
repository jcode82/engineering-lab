import { config as loadEnv } from "dotenv";
loadEnv();
loadEnv({ path: ".env.local" });
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const EXPERIMENTS_DIR = "src/content/experiments";
const NOTES_DIR = "src/content/notes";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// to run script: npx tsx scripts/sync-metadata.ts

function getFiles(dir: string) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(dir, f));
}

function parseMDX(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const slug = path.basename(filePath).replace(/\.mdx?$/, "");

  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    date: data.date ?? null,
    tags: data.tags ?? [],
  };
}

async function syncTable(table: "experiments" | "notes", dir: string) {
  const files = getFiles(dir);

  console.log(`\n🔍 Scanning ${table} in ${dir}...`);
  console.log(`Found ${files.length} MDX files.`);

  for (const file of files) {
    const meta = parseMDX(file);

    const { error } = await supabase.from(table).upsert(
      {
        slug: meta.slug,
        title: meta.title,
        excerpt: meta.excerpt,
        date: meta.date,
        tags: meta.tags,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`❌ Failed to upsert ${meta.slug}:`, error.message);
    } else {
      console.log(`✅ Synced ${table}/${meta.slug}`);
    }
  }
}

(async () => {
  console.log("🚀 Starting MDX → Supabase metadata sync...");

  await syncTable("experiments", EXPERIMENTS_DIR);
  await syncTable("notes", NOTES_DIR);

  console.log("\n🎉 Sync complete! Your Supabase metadata is now up-to-date.\n");
})();
