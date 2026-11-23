import { z } from "zod";
import type { Hymn, SpeakerItem } from "./types";

// Validate database records against the domain model.
export const SacramentMeetingSchema = z.object({
  id: z.number().int().positive(),
  date: z.iso.date(),
  meetingType: z.enum(["testimony", "regular", "stake", "general"]),
  presiding: z.string(),
  conducting: z.string(),
  announcements: z.array(z.string()),
  openingHymn: z
    .object({
      number: z.number().int().positive(),
      title: z.string(),
    })
    .nullable(),
  openingPrayer: z.string(),
  wardBusiness: z.array(
    z.object({
      description: z.string(),
    }),
  ),
  stakeBusiness: z.boolean(),
  sacramentHymn: z
    .object({
      number: z.number().int().positive(),
      title: z.string(),
    })
    .nullable(),
  speakers: z.array(
    z.object({
      name: z.string(),
      topic: z.string(),
      type: z.enum(["speaker", "musical-number"]),
    }),
  ),
  closingHymn: z
    .object({
      number: z.number().int().positive(),
      title: z.string(),
    })
    .nullable(),
  closingPrayer: z.string(),
});

export const SacramentMeetingsSchema = z.array(SacramentMeetingSchema);

// A hymn can have a number without a title.
function createHymn(number: string, title: string): Hymn | null {
  if (!number) return null;

  return {
    number: Number(number),
    title,
  };
}

// Convert multiline text into an array of strings.
function parseLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

// Convert multiline text into speaker objects.
function parseSpeakers(value: string): SpeakerItem[] {
  return parseLines(value).map((line) => {
    const [name = "", topic = "", type = ""] = line
      .split(";")
      .map((part) => part.trim());

    return {
      name,
      topic,
      type: type as SpeakerItem["type"],
    };
  });
}

export const MeetingFormSchema = z
  .object({
    date: z.iso.date(),

    meetingType: z.enum(["testimony", "regular", "stake", "general"]),

    presiding: z
      .string()
      .trim()
      .min(3, "Presiding is required. Must contain at least 3 characters."),
    conducting: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || value.length >= 3,
        "Must contain at least 3 characters",
      ),

    announcementsText: z.string(),

    openingHymnNumber: z.string().trim(),
    openingHymnTitle: z.string().trim(),
    openingPrayer: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || value.length >= 3,
        "Must contain at least 3 characters",
      ),

    wardBusinessText: z.string(),
    stakeBusiness: z.boolean(),

    sacramentHymnNumber: z.string().trim(),
    sacramentHymnTitle: z.string().trim(),

    speakersText: z.string(),

    closingHymnNumber: z.string().trim(),
    closingHymnTitle: z.string().trim(),
    closingPrayer: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || value.length >= 3,
        "Must contain at least 3 characters",
      ),
  })
  .superRefine((data, ctx) => {
    const requiresConducting = data.meetingType !== "stake";
    const requiresPrayers = data.meetingType !== "stake";
    const requiresHymns =
      data.meetingType === "regular" || data.meetingType === "testimony";
    const requiresParticipants = data.meetingType === "regular";

    // Conditional conducting requirement.
    if (requiresConducting && !data.conducting) {
      ctx.addIssue({
        code: "custom",
        path: ["conducting"],
        message: "Conducting is required for this meeting type.",
      });
    }

    // Conditional prayer requirements.
    const prayers = [
      {
        value: data.openingPrayer,
        path: "openingPrayer",
        label: "Opening prayer",
      },
      {
        value: data.closingPrayer,
        path: "closingPrayer",
        label: "Closing prayer",
      },
    ];

    if (requiresPrayers) {
      for (const prayer of prayers) {
        if (!prayer.value) {
          ctx.addIssue({
            code: "custom",
            path: [prayer.path],
            message: `${prayer.label} is required.`,
          });
        }
      }
    }

    // Validate hymn numbers. Titles are optional.
    const hymns = [
      {
        number: data.openingHymnNumber,
        title: data.openingHymnTitle,
        path: "openingHymnNumber",
        label: "Opening hymn",
      },
      {
        number: data.sacramentHymnNumber,
        title: data.sacramentHymnTitle,
        path: "sacramentHymnNumber",
        label: "Sacrament hymn",
      },
      {
        number: data.closingHymnNumber,
        title: data.closingHymnTitle,
        path: "closingHymnNumber",
        label: "Closing hymn",
      },
    ];

    for (const hymn of hymns) {
      if (!hymn.number && hymn.title) {
        ctx.addIssue({
          code: "custom",
          path: [hymn.path],
          message: `${hymn.label}: enter a number when providing a title.`,
        });
      }

      if (requiresHymns && !hymn.number) {
        ctx.addIssue({
          code: "custom",
          path: [hymn.path],
          message: `${hymn.label} number is required.`,
        });
      }

      if (
        hymn.number &&
        (!/^\d+$/.test(hymn.number) ||
          Number(hymn.number) < 1 ||
          Number(hymn.number) > 1212)
      ) {
        ctx.addIssue({
          code: "custom",
          path: [hymn.path],
          message: `${hymn.label}: number must be an integer between 1 and 1212.`,
        });
      }
    }

    // Validate speakers and musical numbers.
    const lines = parseLines(data.speakersText);

    lines.forEach((line, index) => {
      const parts = line.split(";").map((part) => part.trim());
      const [name, topic, type] = parts;

      if (name && name.length < 3) {
        ctx.addIssue({
          code: "custom",
          path: ["speakersText"],
          message: `Line ${index + 1}: name must contain at least 3 characters.`,
        });
      }

      if (
        parts.length !== 3 ||
        !name ||
        !["speaker", "musical-number"].includes(type)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["speakersText"],
          message: `Line ${index + 1}: use Name; Topic; speaker or Name;; musical-number.`,
        });
      } else if (type === "speaker" && !topic) {
        ctx.addIssue({
          code: "custom",
          path: ["speakersText"],
          message: `Line ${index + 1}: a speaker must have a topic.`,
        });
      } else if (type === "musical-number" && topic) {
        ctx.addIssue({
          code: "custom",
          path: ["speakersText"],
          message: `Line ${index + 1}: leave the topic empty for a musical number.`,
        });
      }
    });

    if (requiresParticipants && lines.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["speakersText"],
        message: "Add at least one speaker or musical number.",
      });
    }
  })
  .transform((data) => ({
    date: data.date,
    meetingType: data.meetingType,
    presiding: data.presiding,
    conducting: data.conducting,

    announcements: parseLines(data.announcementsText),

    openingHymn: createHymn(data.openingHymnNumber, data.openingHymnTitle),
    openingPrayer: data.openingPrayer,

    wardBusiness: parseLines(data.wardBusinessText).map((description) => ({
      description,
    })),

    stakeBusiness: data.stakeBusiness,

    sacramentHymn: createHymn(
      data.sacramentHymnNumber,
      data.sacramentHymnTitle,
    ),

    speakers: parseSpeakers(data.speakersText),

    closingHymn: createHymn(data.closingHymnNumber, data.closingHymnTitle),
    closingPrayer: data.closingPrayer,
  }));

export function validateMeetingForm(formData: FormData) {
  const getString = (name: string): string => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };

  return MeetingFormSchema.safeParse({
    date: getString("date"),
    meetingType: getString("meetingType"),
    presiding: getString("presiding"),
    conducting: getString("conducting"),

    announcementsText: getString("announcementsText"),

    openingHymnNumber: getString("openingHymnNumber"),
    openingHymnTitle: getString("openingHymnTitle"),
    openingPrayer: getString("openingPrayer"),

    wardBusinessText: getString("wardBusinessText"),
    stakeBusiness: formData.get("stakeBusiness") === "on",

    sacramentHymnNumber: getString("sacramentHymnNumber"),
    sacramentHymnTitle: getString("sacramentHymnTitle"),

    speakersText: getString("speakersText"),

    closingHymnNumber: getString("closingHymnNumber"),
    closingHymnTitle: getString("closingHymnTitle"),
    closingPrayer: getString("closingPrayer"),
  });
}
