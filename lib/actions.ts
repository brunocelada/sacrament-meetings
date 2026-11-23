"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  addMeeting,
  updateMeeting as updateMeetingInDB,
  deleteMeeting as deleteMeetingFromDB,
} from "@/lib/meetings-db";

import { validateMeetingForm } from "@/lib/validations";

type MeetingFormValues = {
  date: string;
  meetingType: string;
  presiding: string;
  conducting: string;
  announcementsText: string;
  openingHymnNumber: string;
  openingHymnTitle: string;
  openingPrayer: string;
  wardBusinessText: string;
  stakeBusiness: boolean;
  sacramentHymnNumber: string;
  sacramentHymnTitle: string;
  speakersText: string;
  closingHymnNumber: string;
  closingHymnTitle: string;
  closingPrayer: string;
};

type State = {
  message: string;
  errors: Record<string, string[]>;
  values: MeetingFormValues | null;
  revision: number;
};

function getFieldErrors(
  issues: readonly { path: PropertyKey[]; message: string }[],
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const issue of issues) {
    const field = String(issue.path[0] ?? "form");

    if (!errors[field]) {
      errors[field] = [];
    }

    errors[field].push(issue.message);
  }

  return errors;
}

function getSubmittedValues(formData: FormData): MeetingFormValues {
  const getString = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };

  return {
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
  };
}

// CREATE
export async function createMeeting(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const values = getSubmittedValues(formData);
  const revision = _prevState.revision + 1;

  const result = validateMeetingForm(formData);

  if (!result.success) {
    return {
      message: "Please correct the corresponding errors.",
      errors: getFieldErrors(result.error.issues),
      values,
      revision,
    };
  }

  try {
    await addMeeting(result.data);
  } catch (error) {
    console.error("Failed to create meeting:", error);
    return {
      message: "Unable to create the meeting. Please try again.",
      errors: {},
      values,
      revision,
    };
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}

// UPDATE
export async function updateMeeting(
  id: number,
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const values = getSubmittedValues(formData);
  const revision = _prevState.revision + 1;

  if (!Number.isSafeInteger(id) || id <= 0) {
    return {
      message: "Invalid meeting ID.",
      errors: {},
      values,
      revision,
    };
  }

  const result = validateMeetingForm(formData);

  if (!result.success) {
    return {
      message: "Please correct the corresponding errors.",
      errors: getFieldErrors(result.error.issues),
      values,
      revision,
    };
  }

  let updatedMeeting: Awaited<ReturnType<typeof updateMeetingInDB>>;

  try {
    updatedMeeting = await updateMeetingInDB(id, result.data);
  } catch (error) {
    console.error("Failed to update meeting:", error);
    return {
      message: "Unable to update the meeting. Please try again.",
      errors: {},
      values,
      revision,
    };
  }

  if (!updatedMeeting) {
    return {
      message: "Meeting not found.",
      errors: {},
      values,
      revision,
    };
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);

  redirect(`/meetings/${id}`);
}

// DELETE
export async function deleteMeeting(id: number, _formData: FormData) {
  void _formData;

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid meeting ID.");
  }

  let deleted: Awaited<ReturnType<typeof deleteMeetingFromDB>>;

  try {
    deleted = await deleteMeetingFromDB(id);
  } catch (error) {
    console.error("Failed to delete meeting:", error);
    throw new Error("Unable to delete the meeting. Please try again.");
  }

  if (!deleted) {
    throw new Error("Meeting not found.");
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}
