#!/usr/bin/env node
/**
 * Image Optimization Script for Jean Louis David
 *
 * Usage:
 *   npm install sharp
 *   node scripts/image-optimizer.js
 */

import fs from "node:fs/promises";
import path from "node:path";

const CONFIG = {
  inputDir: path.join(process.cwd(), "public/wp-content/uploads"),
  outputDir: path.join(process.cwd(), "public/wp-content/uploads-optimized"),

  // Quality settings
  jpegQuality: 85,
  webpQuality: 80,
  pngQuality: 90,

  // Responsive sizes (WebP variants)
  responsiveSizes: [300, 600, 1024, 1280],

  // Output formats
  formats: {
    original: true, // Re-encode original format
    webp: true, // Generate WebP variant
    jpg: true, // Generate JPG from PNG
    responsive: true, // Generate multiple WebP widths
  },

  verbose: true,
};

class ImageOptimizer {
  constructor(config, sharp) {
    this.config = config;
    this.sharp = sharp;
    this.stats = {
      processed: 0,
      skipped: 0,
      errors: 0,
      originalSize: 0,
      primaryOptimizedSize: 0,
      additionalVariantsSize: 0,
      totalOutputSize: 0,
      primarySavings: 0,
    };
  }

  log(message, level = "info") {
    if (!this.config.verbose) return;

    const timestamp = new Date().toISOString();
    const prefix = {
      info: "✓",
      warn: "⚠",
      error: "✗",
      success: "✔",
    }[level];

    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async ensureOutputDir() {
    try {
      await fs.mkdir(this.config.outputDir, { recursive: true });
      this.log("Output directory ready");
    } catch (error) {
      this.log(`Failed to create output directory: ${error.message}`, "error");
      throw error;
    }
  }

  async getImageFiles() {
    const extensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"]);
    const files = [];

    const readDir = async (dir) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await readDir(fullPath);
          continue;
        }

        if (extensions.has(path.extname(entry.name).toLowerCase())) {
          files.push(fullPath);
        }
      }
    };

    await readDir(this.config.inputDir);
    return files;
  }

  async getFileSize(filePath) {
    const stats = await fs.stat(filePath);
    return stats.size;
  }

  formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
  }

  async writeOriginalVariant(buffer, ext, outputPath) {
    if (ext === ".png") {
      await this.sharp(buffer).png({ quality: this.config.pngQuality, effort: 9 }).toFile(outputPath);
      return;
    }

    if (ext === ".webp") {
      await this.sharp(buffer).webp({ quality: this.config.webpQuality }).toFile(outputPath);
      return;
    }

    await this.sharp(buffer)
      .jpeg({ quality: this.config.jpegQuality, progressive: true })
      .toFile(outputPath);
  }

  async processImage(imagePath) {
    try {
      const originalSize = await this.getFileSize(imagePath);
      const ext = path.extname(imagePath).toLowerCase();
      const basename = path.basename(imagePath, ext);
      const dirname = path.dirname(imagePath).replace(this.config.inputDir, "");
      const outputDir = path.join(this.config.outputDir, dirname);

      await fs.mkdir(outputDir, { recursive: true });

      const buffer = await fs.readFile(imagePath);
      const metadata = await this.sharp(buffer).metadata();
      const outputs = [];
      const primaryCandidates = [];

      if (this.config.formats.original) {
        const originalOutPath = path.join(outputDir, path.basename(imagePath));
        await this.writeOriginalVariant(buffer, ext, originalOutPath);
        const optimizedSize = await this.getFileSize(originalOutPath);
        const result = {
          kind: "original",
          path: originalOutPath,
          size: optimizedSize,
        };
        outputs.push(result);
        primaryCandidates.push(result);
      }

      if (this.config.formats.webp && ext !== ".webp") {
        const webpPath = path.join(outputDir, `${basename}.webp`);
        await this.sharp(buffer).webp({ quality: this.config.webpQuality }).toFile(webpPath);
        const webpSize = await this.getFileSize(webpPath);
        const result = {
          kind: "webp",
          path: webpPath,
          size: webpSize,
        };
        outputs.push(result);
        primaryCandidates.push(result);
      }

      if (this.config.formats.jpg && ext === ".png") {
        const jpgPath = path.join(outputDir, `${basename}.jpg`);
        await this.sharp(buffer)
          .jpeg({ quality: this.config.jpegQuality, progressive: true })
          .toFile(jpgPath);
        const jpgSize = await this.getFileSize(jpgPath);
        const result = {
          kind: "jpg",
          path: jpgPath,
          size: jpgSize,
        };
        outputs.push(result);
        primaryCandidates.push(result);
      }

      if (this.config.formats.responsive && metadata.width) {
        for (const size of this.config.responsiveSizes) {
          if (size > metadata.width) continue;

          const responsivePath = path.join(outputDir, `${basename}-${size}w.webp`);
          const resizedResult = await this.sharp(buffer)
            .resize(size, size, {
              withoutEnlargement: true,
              fit: "inside",
            })
            .webp({ quality: this.config.webpQuality })
            .toFile(responsivePath);

          outputs.push({
            kind: `responsive-${size}w-webp`,
            path: responsivePath,
            size: resizedResult.size,
          });
        }
      }

      if (primaryCandidates.length === 0) {
        this.stats.skipped += 1;
        this.log(`Skipped ${path.basename(imagePath)} (no primary output generated)`, "warn");
        return null;
      }

      const bestPrimary = primaryCandidates.reduce((best, current) =>
        current.size < best.size ? current : best,
      );

      const additionalVariantsSize = outputs.reduce((sum, output) => {
        if (output.path === bestPrimary.path) return sum;
        return sum + output.size;
      }, 0);

      this.stats.processed += 1;
      this.stats.originalSize += originalSize;
      this.stats.primaryOptimizedSize += bestPrimary.size;
      this.stats.additionalVariantsSize += additionalVariantsSize;
      this.stats.totalOutputSize += bestPrimary.size + additionalVariantsSize;
      this.stats.primarySavings += originalSize - bestPrimary.size;

      const reduction = Math.round(((originalSize - bestPrimary.size) / originalSize) * 100);
      this.log(
        `${path.basename(imagePath)} → primary ${bestPrimary.kind} ${this.formatBytes(originalSize)} → ${this.formatBytes(bestPrimary.size)} (${reduction}% saved)`,
      );

      return {
        bestPrimary,
        outputs,
      };
    } catch (error) {
      this.log(`Error processing ${imagePath}: ${error.message}`, "error");
      this.stats.errors += 1;
      return null;
    }
  }

  async run() {
    this.log("Starting image optimization");
    this.log(`Input: ${this.config.inputDir}`);
    this.log(`Output: ${this.config.outputDir}`);

    await this.ensureOutputDir();

    const images = await this.getImageFiles();
    this.log(`Found ${images.length} images to optimize`);

    for (const imagePath of images) {
      // eslint-disable-next-line no-await-in-loop
      await this.processImage(imagePath);
    }

    this.printReport();
  }

  printReport() {
    const primaryReduction =
      this.stats.originalSize > 0
        ? Math.round((this.stats.primarySavings / this.stats.originalSize) * 100)
        : 0;

    console.log(`\n${"=".repeat(64)}`);
    console.log("IMAGE OPTIMIZATION REPORT");
    console.log(`${"=".repeat(64)}`);
    console.log(`Total Images Processed    : ${this.stats.processed}`);
    console.log(`Skipped                   : ${this.stats.skipped}`);
    console.log(`Errors                    : ${this.stats.errors}`);
    console.log("-".repeat(64));
    console.log(`Original Size             : ${this.formatBytes(this.stats.originalSize)}`);
    console.log(`Primary Optimized Size    : ${this.formatBytes(this.stats.primaryOptimizedSize)}`);
    console.log(`Primary Savings           : ${this.formatBytes(this.stats.primarySavings)} (${primaryReduction}%)`);
    console.log(`Additional Variants Size  : ${this.formatBytes(this.stats.additionalVariantsSize)}`);
    console.log(`Total Output Size         : ${this.formatBytes(this.stats.totalOutputSize)}`);
    console.log(`${"=".repeat(64)}\n`);
  }
}

async function loadSharp() {
  try {
    const module = await import("sharp");
    return module.default;
  } catch {
    throw new Error('The "sharp" package is required. Run: npm install sharp');
  }
}

async function main() {
  try {
    const sharp = await loadSharp();
    const optimizer = new ImageOptimizer(CONFIG, sharp);
    await optimizer.run();
  } catch (error) {
    console.error("Fatal error:", error.message);
    process.exit(1);
  }
}

main();
