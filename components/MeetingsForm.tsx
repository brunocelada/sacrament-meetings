"use client";

import { useActionState, useState, type ReactNode } from "react";
import ConfirmationForm from "@/components/ConfirmationForm";
import type { MeetingType, SacramentMeeting } from "@/lib/types";

interface MeetingFormState {
  message: string;
  errors: Record<string, string[]>;
  values: {
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
  } | null;
  revision: number;
}

const initialState: MeetingFormState = {
  message: "",
  errors: {},
  values: null,
  revision: 0,
};

interface MeetingsFormProps {
  action: (
    prevState: MeetingFormState,
    formData: FormData,
  ) => Promise<MeetingFormState>;
  meeting?: SacramentMeeting;
  mode: "create" | "edit";
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 \
  focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 \
  user-invalid:border-red-600 user-valid:border-green-600 user-valid:border-1";

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

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <p
      id={`${id}-error`}
      aria-live="polite"
      className="mt-1 min-h-5 text-sm text-red-600"
    >
      {errors?.join(" ") ?? ""}
    </p>
  );
}

function hymnText(number: number | undefined, title: string | undefined) {
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
    if (name.length < 3) {
      return "Each participant's name must contain at least 3 characters.";
    }
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
  const [state, formAction, isPending] = useActionState(action, initialState);

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
      key={state.revision}
      action={formAction}
      isPending={isPending}
      title={isEditing ? "Save Meeting Changes?" : "Create New Meeting?"}
      message={confirmationMessage}

      submitLabel={
        isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Meeting"
      }
      confirmLabel={isEditing ? "Yes, Save Changes" : "Yes, Create Meeting"}
      cancelLabel="Go Back"
      submitClassName="bg-secondary text-white hover:bg-primary"
    >
      {state.message && (
        <p
          role="status"
          aria-live="polite"
          className="text-sm font-medium text-red-600"
        >
          {state.message}
        </p>
      )}

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
            aria-describedby="date-error"
          />
          <FieldError id="date" errors={state.errors.date} />
        </div>

        <div>
          <FieldLabel htmlFor="meetingType">Meeting type</FieldLabel>

          <select
            id="meetingType"
            name="meetingType"
            value={meetingType}
            onChange={(event) =>
              setMeetingType(event.target.value as MeetingType)
            }
            className={inputClass}
            aria-describedby="meetingType-error"
          >
            <option value="regular">Regular Meeting</option>
            <option value="testimony">Testimony Meeting</option>
            <option value="stake">Stake Meeting</option>
            <option value="general">General Meeting</option>
          </select>
          <FieldError id="meetingType" errors={state.errors.meetingType} />
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
            minLength={3}
            placeholder="e.g. Bishop Johnson"
            defaultValue={state.values?.presiding ?? meeting?.presiding ?? ""}
            className={inputClass}
            aria-describedby="presiding-error"
          />
          <FieldError id="presiding" errors={state.errors.presiding} />
        </div>

        <div>
          <FieldLabel htmlFor="conducting" required={requiresConducting}>
            Conducting
          </FieldLabel>

          <input
            id="conducting"
            name="conducting"
            type="text"
            minLength={3}
            required={requiresConducting}
            placeholder="e.g. Brother Smith"
            defaultValue={state.values?.conducting ?? meeting?.conducting ?? ""}
            className={inputClass}
            aria-describedby="conducting-error"
          />
          <FieldError id="conducting" errors={state.errors.conducting} />
        </div>
      </section>

      {/* Opening */}
      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-tertiary">Opening</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="openingHymnNumber" required={requiresHymns}>
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
              defaultValue={
                state.values?.openingHymnNumber ??
                meeting?.openingHymn?.number.toString() ??
                ""
              }
              onChange={() =>
                updateHymnPairValidity("openingHymnNumber", "openingHymnTitle")
              }
              className={inputClass}
              aria-describedby="openingHymnNumber-error"
            />
            <FieldError
              id="openingHymnNumber"
              errors={state.errors.openingHymnNumber}
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
              defaultValue={
                state.values?.openingHymnTitle ??
                meeting?.openingHymn?.title ??
                ""
              }
              onChange={() =>
                updateHymnPairValidity("openingHymnNumber", "openingHymnTitle")
              }
              className={inputClass}
              aria-describedby="openingHymnTitle-error"
            />
            <FieldError
              id="openingHymnTitle"
              errors={state.errors.openingHymnTitle}
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
            minLength={3}
            required={requiresPrayers}
            placeholder="e.g. Sister Johnson"
            defaultValue={
              state.values?.openingPrayer ?? meeting?.openingPrayer ?? ""
            }
            className={inputClass}
            aria-describedby="openingPrayer-error"
          />
          <FieldError id="openingPrayer" errors={state.errors.openingPrayer} />
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
            defaultValue={
              state.values?.announcementsText ??
              meeting?.announcements?.join("\n") ??
              ""
            }
            className={inputClass}
            aria-describedby="announcementsText-error"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter one announcement per line.
          </p>

          <FieldError
            id="announcementsText"
            errors={state.errors.announcementsText}
          />
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
              state.values?.wardBusinessText ??
              meeting?.wardBusiness
                .map((item) => item.description)
                .join("\n") ??
              ""
            }
            className={inputClass}
            aria-describedby="wardBusinessText-error"
          />

          <p className="mt-1 text-xs text-gray-500">Enter one item per line.</p>

          <FieldError
            id="wardBusinessText"
            errors={state.errors.wardBusinessText}
          />
        </div>

        <label
          htmlFor="stakeBusiness"
          className="flex items-center gap-2 text-sm text-gray-700"
        >
          <input
            id="stakeBusiness"
            type="checkbox"
            name="stakeBusiness"
            defaultChecked={
              state.values?.stakeBusiness ?? meeting?.stakeBusiness ?? false
            }
            className="h-4 w-4 rounded border-gray-300"
            aria-describedby="stakeBusiness-error"
          />
          Includes stake business
        </label>
        <FieldError id="stakeBusiness" errors={state.errors.stakeBusiness} />
      </section>

      {/* Sacrament */}
      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-tertiary">Sacrament</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="sacramentHymnNumber" required={requiresHymns}>
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
              defaultValue={
                state.values?.sacramentHymnNumber ??
                meeting?.sacramentHymn?.number.toString() ??
                ""
              }
              onChange={() =>
                updateHymnPairValidity(
                  "sacramentHymnNumber",
                  "sacramentHymnTitle",
                )
              }
              className={inputClass}
              aria-describedby="sacramentHymnNumber-error"
            />
            <FieldError
              id="sacramentHymnNumber"
              errors={state.errors.sacramentHymnNumber}
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
              defaultValue={
                state.values?.sacramentHymnTitle ??
                meeting?.sacramentHymn?.title ??
                ""
              }
              onChange={() =>
                updateHymnPairValidity(
                  "sacramentHymnNumber",
                  "sacramentHymnTitle",
                )
              }
              className={inputClass}
              aria-describedby="sacramentHymnTitle-error"
            />
            <FieldError
              id="sacramentHymnTitle"
              errors={state.errors.sacramentHymnTitle}
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
              state.values?.speakersText ??
              meeting?.speakers
                .map((item) => `${item.name}; ${item.topic}; ${item.type}`)
                .join("\n") ??
              ""
            }
            onChange={(event) =>
              event.currentTarget.setCustomValidity(
                getParticipantsError(event.currentTarget.value),
              )
            }
            className={inputClass}
            aria-describedby="speakersText-error"
          />

          <p className="mt-1 text-xs text-gray-500">
            Enter one participant per line. Use: Name; Topic; speaker, or Name;;
            musical-number.
          </p>

          <FieldError id="speakersText" errors={state.errors.speakersText} />
        </div>
      </section>

      {/* Closing */}
      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-tertiary">Closing</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="closingHymnNumber" required={requiresHymns}>
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
              defaultValue={
                state.values?.closingHymnNumber ??
                meeting?.closingHymn?.number.toString() ??
                ""
              }
              onChange={() =>
                updateHymnPairValidity("closingHymnNumber", "closingHymnTitle")
              }
              className={inputClass}
              aria-describedby="closingHymnNumber-error"
            />
            <FieldError
              id="closingHymnNumber"
              errors={state.errors.closingHymnNumber}
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
              defaultValue={
                state.values?.closingHymnTitle ??
                meeting?.closingHymn?.title ??
                ""
              }
              onChange={() =>
                updateHymnPairValidity("closingHymnNumber", "closingHymnTitle")
              }
              className={inputClass}
              aria-describedby="closingHymnTitle-error"
            />
            <FieldError
              id="closingHymnTitle"
              errors={state.errors.closingHymnTitle}
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
            minLength={3}
            required={requiresPrayers}
            placeholder="e.g. Brother Johnson"
            defaultValue={
              state.values?.closingPrayer ?? meeting?.closingPrayer ?? ""
            }
            className={inputClass}
            aria-describedby="closingPrayer-error"
          />
          <FieldError id="closingPrayer" errors={state.errors.closingPrayer} />
        </div>
      </section>
    </ConfirmationForm>
  );
}
