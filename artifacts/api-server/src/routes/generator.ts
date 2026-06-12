import { Router } from "express";
import multer from "multer";
import { randomUUID } from "crypto";
import { db, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
type PdfParseFn = (dataBuffer: Buffer) => Promise<{ text: string }>;
let _pdfParse: PdfParseFn | null = null;
async function getPdfParse(): Promise<PdfParseFn> {
  if (!_pdfParse) {
    const mod = await import("pdf-parse");
    _pdfParse = (mod.default ?? mod) as PdfParseFn;
  }
  return _pdfParse;
}
import mammoth from "mammoth";
import JSZip from "jszip";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
const imageUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── helpers ────────────────────────────────────────────────────────────────

async function extractPdf(buffer: Buffer): Promise<string> {
  const pdfParse = await getPdfParse();
  const data = await pdfParse(buffer);
  return data.text;
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractPptx(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const slideFiles = Object.keys(zip.files).filter(
    (name) => name.match(/^ppt\/slides\/slide\d+\.xml$/)
  ).sort();

  const texts: string[] = [];
  for (const file of slideFiles) {
    const xml = await zip.files[file].async("string");
    const stripped = xml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (stripped) texts.push(stripped);
  }
  return texts.join("\n\n---SLIDE---\n\n");
}

const INITIAL_QUESTIONS = [
  {
    id: "event_name",
    question: "What is the name of the event or session?",
    type: "text",
    placeholder: "e.g. Freedom Yuva Youth Conference"
  },
  {
    id: "event_date",
    question: "What is the date of the event?",
    type: "text",
    placeholder: "e.g. 14 June 2026"
  },
  {
    id: "audience",
    question: "Who is the target audience for these takeaway notes?",
    type: "choice",
    options: ["Youth / Teenagers", "Young Adults (18-30)", "General Church", "Professional / Corporate", "Mixed / All Ages"]
  },
  {
    id: "tone",
    question: "What tone should the takeaway notes have?",
    type: "choice",
    options: ["Warm & Encouraging", "Formal & Professional", "Fun & Energetic", "Devotional & Reflective", "Educational & Informative"]
  },
  {
    id: "doc_sections",
    question: "Which sections should the takeaway notes include?",
    type: "multiChoice",
    options: ["Key Points / Do's & Don'ts", "Discussion Questions", "Reflection Prompts", "Scripture / Quotes", "Action Steps", "Summary"]
  },
  {
    id: "length",
    question: "How detailed should the takeaway notes be?",
    type: "choice",
    options: ["Brief (2-3 pages)", "Moderate (4-6 pages)", "Comprehensive (7+ pages)"]
  },
  {
    id: "branding",
    question: "What is the presenter's name or organization to include on the cover?",
    type: "text",
    placeholder: "e.g. Pastor John / Freedom Church"
  },
  {
    id: "design_style",
    question: "What visual style should the document have?",
    type: "choice",
    options: ["Clean & Minimal", "Bold & Modern", "Warm & Inviting", "Classic & Elegant"]
  },
  {
    id: "additional",
    question: "Is there anything specific you want to highlight or emphasize?",
    type: "text",
    placeholder: "e.g. Focus on the practical application section, include the main scripture verse prominently"
  }
];

// ─── POST /api/generator/upload ──────────────────────────────────────────────

router.post(
  "/upload",
  upload.fields([
    { name: "notes", maxCount: 1 },
    { name: "presentation", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      const speakerNotesFile = files?.notes?.[0];
      const presentationFile = files?.presentation?.[0];

      if (!speakerNotesFile && !presentationFile) {
        res.status(400).json({ error: "At least one file is required" });
        return;
      }

      const parts: string[] = [];

      if (speakerNotesFile) {
        const mime = speakerNotesFile.mimetype;
        const name = speakerNotesFile.originalname.toLowerCase();
        if (mime === "application/pdf" || name.endsWith(".pdf")) {
          parts.push("=== SPEAKER NOTES ===\n" + await extractPdf(speakerNotesFile.buffer));
        } else if (
          mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          name.endsWith(".docx")
        ) {
          parts.push("=== SPEAKER NOTES ===\n" + await extractDocx(speakerNotesFile.buffer));
        } else {
          res.status(400).json({ error: "Speaker notes must be PDF or DOCX" });
          return;
        }
      }

      if (presentationFile) {
        const mime = presentationFile.mimetype;
        const name = presentationFile.originalname.toLowerCase();
        if (
          mime === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
          name.endsWith(".pptx")
        ) {
          parts.push("=== PRESENTATION SLIDES ===\n" + await extractPptx(presentationFile.buffer));
        } else {
          res.status(400).json({ error: "Presentation must be PPTX" });
          return;
        }
      }

      const extractedContent = parts.join("\n\n");
      const sessionId = randomUUID();

      await db.insert(sessionsTable).values({
        sessionId,
        status: "questionnaire",
        extractedContent,
        questions: INITIAL_QUESTIONS,
        answers: null,
        notes: null,
        uploadedImageUrls: [],
      });

      res.json({
        sessionId,
        extractedContent: extractedContent.slice(0, 500) + (extractedContent.length > 500 ? "..." : ""),
        questions: INITIAL_QUESTIONS,
      });
    } catch (err) {
      req.log.error(err, "Error processing upload");
      res.status(500).json({ error: "Failed to process files" });
    }
  }
);

// ─── GET /api/generator/sessions/:sessionId ──────────────────────────────────

router.get("/sessions/:sessionId", async (req, res) => {
  const sessionId = String(req.params.sessionId);
  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.sessionId, sessionId));
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  res.json({
    sessionId: session.sessionId,
    status: session.status,
    extractedContent: session.extractedContent,
    questions: session.questions,
    answers: session.answers,
    notes: session.notes,
    uploadedImageUrls: session.uploadedImageUrls,
  });
});

// ─── POST /api/generator/sessions/:sessionId/questionnaire ───────────────────

router.post("/sessions/:sessionId/questionnaire", async (req, res) => {
  const sessionId = String(req.params.sessionId);
  const { answers, additionalInstructions } = req.body as {
    answers: Record<string, unknown>;
    additionalInstructions?: string;
  };

  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.sessionId, sessionId));
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const mergedAnswers = { ...(session.answers as Record<string, unknown> || {}), ...answers };
  if (additionalInstructions) mergedAnswers["_additionalInstructions"] = additionalInstructions;

  // Ask AI if we have enough information
  const answerSummary = Object.entries(mergedAnswers)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");

  const checkCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content: `You are evaluating whether we have sufficient information to generate professional takeaway notes for a presentation. 
Return ONLY valid JSON: { "ready": boolean, "missingInfo": string[] }
If ready is false, list 1-2 specific pieces of missing info that would significantly improve the output.
Consider ready=true if we have: event name, audience type, tone preference, and key sections to include.`
      },
      {
        role: "user",
        content: `Answers collected so far:\n${answerSummary}`
      }
    ]
  });

  let ready = true;
  let followUpQuestions: typeof INITIAL_QUESTIONS = [];

  try {
    const parsed = JSON.parse(checkCompletion.choices[0].message.content ?? "{}");
    ready = parsed.ready ?? true;
    if (!ready && parsed.missingInfo?.length) {
      followUpQuestions = parsed.missingInfo.map((info: string, i: number) => ({
        id: `followup_${i}`,
        question: info,
        type: "text" as const,
        placeholder: "Please provide more details..."
      }));
    }
  } catch {
    ready = true;
  }

  await db.update(sessionsTable)
    .set({ answers: mergedAnswers, status: ready ? "generating" : "questionnaire" })
    .where(eq(sessionsTable.sessionId, sessionId));

  res.json({
    needsMoreInfo: !ready,
    followUpQuestions,
    ready,
    message: ready ? "Great! We have everything we need." : "A few more details would help."
  });
});

// ─── POST /api/generator/sessions/:sessionId/generate ────────────────────────

router.post("/sessions/:sessionId/generate", async (req, res) => {
  const sessionId = String(req.params.sessionId);
  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.sessionId, sessionId));
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const answers = session.answers as Record<string, unknown> || {};
  const content = session.extractedContent ?? "";

  const prompt = `You are a professional document designer creating takeaway notes for a presentation.

PRESENTATION CONTENT:
${content.slice(0, 8000)}

USER PREFERENCES:
- Event Name: ${answers.event_name ?? "Presentation"}
- Event Date: ${answers.event_date ?? ""}
- Target Audience: ${answers.audience ?? "General"}
- Tone: ${answers.tone ?? "Warm & Encouraging"}
- Sections to include: ${JSON.stringify(answers.doc_sections ?? [])}
- Length: ${answers.length ?? "Moderate (4-6 pages)"}
- Presenter/Organization: ${answers.branding ?? ""}
- Visual Style: ${answers.design_style ?? "Clean & Minimal"}
- Special emphasis: ${answers.additional ?? ""}
- Additional instructions: ${answers._additionalInstructions ?? ""}

Generate a structured takeaway notes document as a JSON array of pages. Each page should be engaging, well-organized, and appropriate for the audience.

Return ONLY valid JSON (no markdown, no code blocks). The structure is:
[
  {
    "id": "page-1",
    "type": "cover",
    "title": "Main presentation title",
    "subtitle": "Subtitle or tagline",
    "band": null,
    "eventName": "Event name",
    "eventDate": "Date string",
    "sections": [],
    "quote": null,
    "quoteSource": null,
    "imageUrl": null,
    "questions": []
  },
  {
    "id": "page-2",
    "type": "content",
    "title": "Section heading",
    "subtitle": null,
    "band": "SECTION LABEL IN CAPS",
    "eventName": null,
    "eventDate": null,
    "sections": [
      {
        "title": "Subsection title",
        "items": [
          { "t": "Key point title", "n": "Explanation or supporting note" }
        ],
        "subsections": []
      }
    ],
    "quote": "Optional memorable quote",
    "quoteSource": "Quote attribution",
    "imageUrl": null,
    "questions": []
  },
  {
    "id": "page-3",
    "type": "reflection",
    "title": "Discussion & Reflection",
    "subtitle": null,
    "band": "BEFORE WE BEGIN",
    "eventName": null,
    "eventDate": null,
    "sections": [],
    "quote": null,
    "quoteSource": null,
    "imageUrl": null,
    "questions": [
      { "q": "Reflection question text here?" }
    ]
  }
]

Guidelines:
- Cover page first, then content pages, then optionally a reflection/discussion page
- Extract key insights, do's and don'ts, practical takeaways from the content
- Each content page should have 3-6 items per section
- Items should be concise — title (t) is 3-8 words, note (n) is 1-2 sentences max
- Include 3-5 reflection questions if requested
- Band labels are short, uppercase section identifiers (e.g. "KEY TAKEAWAYS", "DO'S & DON'TS", "ACTION STEPS")
- Aim for ${answers.length === "Brief (2-3 pages)" ? "2-3" : answers.length === "Comprehensive (7+ pages)" ? "7-9" : "4-6"} pages total`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }]
    });

    let pagesJson = completion.choices[0].message.content ?? "[]";
    // strip markdown code fences if present
    pagesJson = pagesJson.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

    const pages = JSON.parse(pagesJson);

    const notes = { pages };

    await db.update(sessionsTable)
      .set({ notes, status: "complete" })
      .where(eq(sessionsTable.sessionId, sessionId));

    res.json({
      sessionId,
      pages,
      uploadedImageUrls: (session.uploadedImageUrls as string[]) ?? []
    });
  } catch (err) {
    req.log.error(err, "Error generating notes");
    res.status(500).json({ error: "Failed to generate notes" });
  }
});

// ─── POST /api/generator/sessions/:sessionId/edit ────────────────────────────

router.post(
  "/sessions/:sessionId/edit",
  imageUpload.array("images", 10),
  async (req, res) => {
    const sessionId = String(req.params.sessionId);
    const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.sessionId, sessionId));
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    // Handle JSON body (when no files) or multipart
    const instructions = (req.body?.instructions as string) || "";
    const existingNotes = session.notes as { pages: unknown[] } | null;

    if (!existingNotes?.pages) {
      res.status(400).json({ error: "No notes to edit yet" });
      return;
    }

    // Convert any uploaded images to data URLs and store references
    const uploadedFiles = req.files as Express.Multer.File[] | undefined;
    const newImageRefs: string[] = [];
    if (uploadedFiles?.length) {
      for (const file of uploadedFiles) {
        const b64 = file.buffer.toString("base64");
        const dataUrl = `data:${file.mimetype};base64,${b64}`;
        newImageRefs.push(dataUrl);
      }
    }

    const existingUrls = (session.uploadedImageUrls as string[]) ?? [];
    const allImageUrls = [...existingUrls, ...(req.body?.uploadedImageUrls ?? []), ...newImageRefs];

    const currentPagesJson = JSON.stringify(existingNotes.pages, null, 2);

    const prompt = `You are editing a takeaway notes document based on user feedback.

CURRENT DOCUMENT PAGES (JSON):
${currentPagesJson.slice(0, 6000)}

USER EDIT INSTRUCTIONS:
${instructions}

${allImageUrls.length > 0 ? `The user has uploaded ${allImageUrls.length} image(s) for reference.` : ""}

Apply the requested changes to the document pages. Maintain the same JSON structure.
Return ONLY the updated pages as a valid JSON array (no markdown, no code blocks).`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 8192,
        messages: [{ role: "user", content: prompt }]
      });

      let pagesJson = completion.choices[0].message.content ?? "[]";
      pagesJson = pagesJson.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

      const pages = JSON.parse(pagesJson);
      const notes = { pages };

      await db.update(sessionsTable)
        .set({ notes, uploadedImageUrls: allImageUrls })
        .where(eq(sessionsTable.sessionId, sessionId));

      res.json({
        sessionId,
        pages,
        uploadedImageUrls: allImageUrls
      });
    } catch (err) {
      req.log.error(err, "Error editing notes");
      res.status(500).json({ error: "Failed to edit notes" });
    }
  }
);

export default router;
