"use client";

import { useState, type ReactNode } from "react";
import ConfirmationForm from "@/components/ConfirmationForm";
import type { MeetingType, SacramentMeeting } from "@/lib/types";

interface MeetingsFormProps {
  action: (formData: FormData) => void | Promise<void>;
  meeting?: SacramentMeeting;
  mode: "create" | "edit";
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 user-invalid:border-red-600 user-valid:border-secondary";

const labelClass = "block text-sm font-medium text-gray-700";

function FieldLabel({
  htmlFor,
  required = false,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
      {required && (
        <span className="ml-1 text-red-600" aria-label="required">
          *
        </span>
      )}
    </label>
  );
}

function hymnText(
  number: number | undefined,
  title: string | undefined,
) {
  return {
    number: number ? String(number) : "",
    title: title ?? "",
  };
}

// Validate the participant format before submitting the form.
function getParticipantsError(value: string): string {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (let index = 0; index < lines.length; index++) {
    const parts = lines[index].split(";").map((part) => part.trim());
    const [name, topic, type] = parts;

    if (
      parts.length !== 3 ||
      !name ||
      !["speaker", "musical-number"].includes(type)
    ) {
      return `Line ${index + 1}: use Name; Topic; speaker or Name;; musical-number.`;
    }

    if (type === "speaker" && !topic) {
      return `Line ${index + 1}: a speaker must have a topic.`;
    }

    if (type === "musical-number" && topic) {
      return `Line ${index + 1}: leave the topic empty for a musical number.`;
    }
  }

  return "";
}

// A title cannot be saved without a hymn number.
function updateHymnPairValidity(numberId: string, titleId: string) {
  const numberInput = document.getElementById(
    numberId,
  ) as HTMLInputElement | null;

  const titleInput = document.getElementById(
    titleId,
  ) as HTMLInputElement | null;

  if (!numberInput || !titleInput) return;

  const error =
    titleInput.value.trim() && !numberInput.value.trim()
      ? "Enter a hymn number when providing a title."
      : "";

  numberInput.setCustomValidity(error);
  titleInput.setCustomValidity(error);
}

// Return a formatted date only when the selected day is not Sunday.
function getNonSundayDateLabel(value: string): string | null {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  const selectedDate = new Date(year, month - 1, day);

  if (selectedDate.getDay() === 0) return null;

  return new Intl.DateTimeFormat("en-US", {
    // weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(selectedDate);
}

export default function MeetingsForm({
  action,
  meeting,
  mode,
}: MeetingsFormProps) {
  const openingHymn = hymnText(
    meeting?.openingHymn?.number,
    meeting?.openingHymn?.title,
  );

  const sacramentHymn = hymnText(
    meeting?.sacramentHymn?.number,
    meeting?.sacramentHymn?.title,
  );

  const closingHymn = hymnText(
    meeting?.closingHymn?.number,
    meeting?.closingHymn?.title,
  );

  const [meetingType, setMeetingType] = useState<MeetingType>(
  meeting?.meetingType ?? "regular",
);

const [meetingDate, setMeetingDate] = useState(meeting?.date ?? "");

const requiresConducting = meetingType !== "stake";
const requiresPrayers = meetingType !== "stake";

const requiresHymns =
  meetingType === "regular" || meetingType === "testimony";

const requiresParticipants = meetingType === "regular";

const isEditing = mode === "edit";

const baseConfirmationMessage = isEditing
  ? "Are you sure you want to save these changes to the sacrament meeting?"
  : "Please confirm that you want to create this sacrament meeting.";

const nonSundayDate = getNonSundayDateLabel(meetingDate);

const confirmationMessage = nonSundayDate
    ? `⚠️ Warning: ${nonSundayDate} is not a Sunday. Please verify the date. You can still continue.
  \n${baseConfirmationMessage}`
  : baseConfirmationMessage;

  return (
    <ConfirmationForm
      action={action}
      title={
        isEditing
          ? "Save Meeting Changes?"
          : "Create New Meeting?"
      }
          message={confirmationMessage}
          
      submitLabel={isEditing ? "Save Changes" : "Create Meeting"}
      confirmLabel={isEditing ? "Yes, Save Changes" : "Yes, Create Meeting"}
      cancelLabel="Go Back"
      submitClassName="bg-secondary text-white hover:bg-primary"
    >
      {/* Meeting information */}
      <section className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="date" required>
  Meeting date
</FieldLabel>

<input
  id="date"
  name="date"
  type="date"
  required
  value={meetingDate}
  onChange={(event) => setMeetingDate(event.target.value)}
  className={inputClass}
/>
        </div>

        <div>
          <FieldLabel htmlFor="meetingType">
  Meeting type
</FieldLabel>

<select
  id="meetingType"
  name="meetingType"
  value={meetingType}
  onChange={(event) =>
    setMeetingType(event.target.value as MeetingType)
  }
  className={inputClass}
>
  <option value="regular">Regular Meeting</option>
  <option value="testimony">Testimony Meeting</option>
  <option value="stake">Stake Meeting</option>
  <option value="general">General Meeting</option>
</select>
        </div>

        <div>
          <FieldLabel htmlFor="presiding" required>
  Presiding
</FieldLabel>

<input
  id="presiding"
  name="presiding"
  type="text"
  required
  placeholder="e.g. Bishop Johnson"
  defaultValue={meeting?.presiding ?? ""}
  className={inputClass}
/>
        </div>

        <div>
          <FieldLabel htmlFor="conducting" required={requiresConducting}>
  Conducting
</FieldLabel>

<input
  id="conducting"
  name="conducting"
  type="text"
  required={requiresConducting}
  placeholder="e.g. Brother Smith"
  defaultValue={meeting?.conducting ?? ""}
  className={inputClass}
/>
        </div>
      </section>

      {/* Opening */}
      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-tertiary">
          Opening
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
  <FieldLabel
    htmlFor="openingHymnNumber"
    required={requiresHymns}
  >
    Opening hymn number
  </FieldLabel>

  <input
    id="openingHymnNumber"
    name="openingHymnNumber"
    type="number"
    min="1"
    max="1212"
    step="1"
    required={requiresHymns}
    placeholder="1-1212"
    defaultValue={openingHymn.number}
    onChange={() =>
      updateHymnPairValidity(
        "openingHymnNumber",
        "openingHymnTitle",
      )
    }
    className={inputClass}
  />
</div>

<div>
  <FieldLabel htmlFor="openingHymnTitle">
    Opening hymn title (optional)
  </FieldLabel>

  <input
    id="openingHymnTitle"
    name="openingHymnTitle"
    type="text"
    placeholder="Enter the hymn title if known"
    defaultValue={openingHymn.title}
    onChange={() =>
      updateHymnPairValidity(
        "openingHymnNumber",
        "openingHymnTitle",
      )
    }
    className={inputClass}
  />
</div>
        </div>

        <div>
          <FieldLabel htmlFor="openingPrayer" required={requiresPrayers}>
  Opening prayer
</FieldLabel>

<input
  id="openingPrayer"
  name="openingPrayer"
  type="text"
  required={requiresPrayers}
  placeholder="e.g. Sister Johnson"
  defaultValue={meeting?.openingPrayer ?? ""}
  className={inputClass}
/>
        </div>
      </section>

      {/* Meeting business */}
      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-tertiary">
          Meeting Business
        </h2>

        <div>
          <label htmlFor="announcementsText" className={labelClass}>
            Announcements
          </label>
          <textarea
            id="announcementsText"
            name="announcementsText"
            rows={3}
            placeholder={
              "Ward temple night: Jan 30\nGeneral Conference next month"
            }
            defaultValue={meeting?.announcements?.join("\n") ?? ""}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter one announcement per line.
          </p>
        </div>

        <div>
          <label htmlFor="wardBusinessText" className={labelClass}>
            Ward business
          </label>
          <textarea
            id="wardBusinessText"
            name="wardBusinessText"
            rows={3}
            placeholder="Sustaining of new Sunday School president"
            defaultValue={
              meeting?.wardBusiness
                .map((item) => item.description)
                .join("\n") ?? ""
            }
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter one item per line.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="stakeBusiness"
            defaultChecked={meeting?.stakeBusiness ?? false}
            className="h-4 w-4 rounded border-gray-300"
          />
          Includes stake business
        </label>
      </section>

      {/* Sacrament */}
      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-tertiary">
          Sacrament
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
  <FieldLabel
    htmlFor="sacramentHymnNumber"
    required={requiresHymns}
  >
    Sacrament hymn number
  </FieldLabel>

  <input
    id="sacramentHymnNumber"
    name="sacramentHymnNumber"
    type="number"
    min="1"
    max="1212"
    step="1"
    required={requiresHymns}
    placeholder="1-1212"
    defaultValue={sacramentHymn.number}
    onChange={() =>
      updateHymnPairValidity(
        "sacramentHymnNumber",
        "sacramentHymnTitle",
      )
    }
    className={inputClass}
  />
</div>

<div>
  <FieldLabel htmlFor="sacramentHymnTitle">
    Sacrament hymn title (optional)
  </FieldLabel>

  <input
    id="sacramentHymnTitle"
    name="sacramentHymnTitle"
    type="text"
    placeholder="Enter the hymn title if known"
    defaultValue={sacramentHymn.title}
    onChange={() =>
      updateHymnPairValidity(
        "sacramentHymnNumber",
        "sacramentHymnTitle",
      )
    }
    className={inputClass}
  />
</div>
        </div>
      </section>

      {/* Speakers and musical numbers */}
      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-tertiary">
          Speakers and Musical Numbers
        </h2>

        <div>
          <FieldLabel htmlFor="speakersText" required={requiresParticipants}>
  Participants
</FieldLabel>

<textarea
  id="speakersText"
  name="speakersText"
  rows={5}
  required={requiresParticipants}
  placeholder={
    "Sister Gomez; The Holy Ghost; speaker\nPrimary Choir;; musical-number"
  }
  defaultValue={
    meeting?.speakers
      .map(
        (item) => `${item.name}; ${item.topic}; ${item.type}`,
      )
      .join("\n") ?? ""
  }
  onChange={(event) =>
    event.currentTarget.setCustomValidity(
      getParticipantsError(event.currentTarget.value),
    )
  }
  className={inputClass}
/>

<p className="mt-1 text-xs text-gray-500">
  Enter one participant per line.
  Use: Name; Topic; speaker, or Name;; musical-number.
</p>
        </div>
      </section>

      {/* Closing */}
      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-tertiary">
          Closing
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
  <FieldLabel
    htmlFor="closingHymnNumber"
    required={requiresHymns}
  >
    Closing hymn number
  </FieldLabel>

  <input
    id="closingHymnNumber"
    name="closingHymnNumber"
    type="number"
    min="1"
    max="1212"
    step="1"
    required={requiresHymns}
    placeholder="1-1212"
    defaultValue={closingHymn.number}
    onChange={() =>
      updateHymnPairValidity(
        "openingHymnNumber",
        "openingHymnTitle",
      )
    }
    className={inputClass}
  />
</div>

<div>
  <FieldLabel htmlFor="closingHymnTitle">
    Closing hymn title (optional)
  </FieldLabel>

  <input
    id="closingHymnTitle"
    name="closingHymnTitle"
    type="text"
    placeholder="Enter the hymn title if known"
    defaultValue={closingHymn.title}
    onChange={() =>
      updateHymnPairValidity(
        "closingHymnNumber",
        "closingHymnTitle",
      )
    }
    className={inputClass}
  />
</div>
        </div>

        <div>
          <FieldLabel htmlFor="closingPrayer" required={requiresPrayers}>
  Closing prayer
</FieldLabel>

<input
  id="closingPrayer"
  name="closingPrayer"
  type="text"
  required={requiresPrayers}
  placeholder="e.g. Brother Johnson"
  defaultValue={meeting?.closingPrayer ?? ""}
  className={inputClass}
/>
        </div>
      </section>
    </ConfirmationForm>
  );
}
