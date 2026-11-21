"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  addMeeting,
  updateMeeting as updateMeetingInDB,
  deleteMeeting as deleteMeetingFromDB,
} from "@/lib/meetings-db";

import { validateMeetingForm } from "@/lib/validations";

// CREATE
export async function createMeeting(formData: FormData) {
  const result = validateMeetingForm(formData);

  if (!result.success) {
    throw new Error(
      result.error.issues.map((issue) => issue.message).join(" "),
    );
  }

  try {
  await addMeeting(result.data);
} catch (error) {
  console.error("Failed to create meeting:", error);
  throw new Error("Unable to create the meeting. Please try again.");
}

  revalidatePath("/meetings");
  redirect("/meetings");
}

// UPDATE
export async function updateMeeting(id: number, formData: FormData) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid meeting ID.");
  }

  const result = validateMeetingForm(formData);

  if (!result.success) {
    throw new Error(
      result.error.issues.map((issue) => issue.message).join(" "),
    );
  }

  let updatedMeeting: Awaited<ReturnType<typeof updateMeetingInDB>>;

try {
  updatedMeeting = await updateMeetingInDB(id, result.data);
} catch (error) {
  console.error("Failed to update meeting:", error);
  throw new Error("Unable to update the meeting. Please try again.");
}

  if (!updatedMeeting) {
    throw new Error("Meeting not found.");
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);

  redirect(`/meetings/${id}`);
}

// DELETE
export async function deleteMeeting(
    id: number,
    _formData: FormData,
) {
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