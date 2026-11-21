import type { SacramentMeeting } from "./types";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const ITEMS_PER_PAGE = 5;

const MEETING_RETURNING = `
  id,
  to_char(date, 'YYYY-MM-DD') AS "date",
  meeting_type AS "meetingType",
  presiding,
  conducting,
  COALESCE(announcements, '{}'::text[]) AS announcements,
  opening_hymn AS "openingHymn",
  opening_prayer AS "openingPrayer",
  CASE
    WHEN ward_business IS NULL OR ward_business = 'null'::jsonb
    THEN '[]'::jsonb
    ELSE ward_business
  END AS "wardBusiness",
  COALESCE(stake_business, false) AS "stakeBusiness",
  sacrament_hymn AS "sacramentHymn",
  CASE
    WHEN speakers IS NULL OR speakers = 'null'::jsonb
    THEN '[]'::jsonb
    ELSE speakers
  END AS speakers,
  closing_hymn AS "closingHymn",
  closing_prayer AS "closingPrayer"
`;

export async function getMeetings(
  query: string = "",
  currentPage: number = 1,
  date?: string,
): Promise<SacramentMeeting[]> {
  const searchTerm = `%${query}%`;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, 
      conducting, 
      COALESCE(announcements, '{}'::text[]) AS announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      CASE
  WHEN ward_business IS NULL OR ward_business = 'null'::jsonb
  THEN '[]'::jsonb
  ELSE ward_business
END AS "wardBusiness",
      COALESCE(stake_business, false) AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      CASE
  WHEN speakers IS NULL OR speakers = 'null'::jsonb
  THEN '[]'::jsonb
  ELSE speakers
END AS speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE
    (${date ?? null}::date IS NULL OR date = ${date ?? null}::date)
      AND (
      presiding     ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
    )
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
  return rows as unknown as SacramentMeeting[];
}

export async function getAllMeetings(
  date?: string,
): Promise<SacramentMeeting[]> {
  // For API
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, 
      conducting, 
      COALESCE(announcements, '{}'::text[]) AS announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      CASE
  WHEN ward_business IS NULL OR ward_business = 'null'::jsonb
  THEN '[]'::jsonb
  ELSE ward_business
END AS "wardBusiness",
      COALESCE(stake_business, false) AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      CASE
  WHEN speakers IS NULL OR speakers = 'null'::jsonb
  THEN '[]'::jsonb
  ELSE speakers
END AS speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE (${date ?? null}::date IS NULL OR date = ${date ?? null}::date)
    ORDER BY id
  `;

  return rows as unknown as SacramentMeeting[];
}

export async function getMeetingsTotalPages(
  query: string = "",
): Promise<number> {
  const searchTerm = `%${query}%`;
  const rows = await sql`
    SELECT COUNT(*) FROM meetings
    WHERE
      presiding     ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
  `;
  return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, 
      conducting, 
      COALESCE(announcements, '{}'::text[]) AS announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      CASE
  WHEN ward_business IS NULL OR ward_business = 'null'::jsonb
  THEN '[]'::jsonb
  ELSE ward_business
END AS "wardBusiness",
      COALESCE(stake_business, false) AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      CASE
  WHEN speakers IS NULL OR speakers = 'null'::jsonb
  THEN '[]'::jsonb
  ELSE speakers
END AS speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings WHERE id = ${id}
  `;
  return (rows[0] as unknown as SacramentMeeting) ?? null;
}

export async function addMeeting(
  data: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting> {
  const rows = await sql.query(
    `INSERT INTO meetings (
      date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    )
    VALUES (
      $1::date,
      $2,
      $3,
      $4,
      ARRAY(SELECT jsonb_array_elements_text($5::jsonb)),
      $6::jsonb,
      $7,
      $8::jsonb,
      $9,
      $10::jsonb,
      $11::jsonb,
      $12::jsonb,
      $13
    )
    RETURNING ${MEETING_RETURNING}`,
    [
      data.date,
      data.meetingType,
      data.presiding,
      data.conducting,
      JSON.stringify(data.announcements ?? []),
      JSON.stringify(data.openingHymn),
      data.openingPrayer,
      JSON.stringify(data.wardBusiness ?? []),
      data.stakeBusiness ?? false,
      JSON.stringify(data.sacramentHymn),
      JSON.stringify(data.speakers ?? []),
      JSON.stringify(data.closingHymn),
      data.closingPrayer,
    ],
  );

  return rows[0] as SacramentMeeting;
}

export async function updateMeeting(
  id: number,
  updates: Partial<SacramentMeeting>,
): Promise<SacramentMeeting | null> {
  const setClauses: string[] = [];
  const values: (string | number | boolean)[] = [];

  function addField(
    column: string,
    value: string | number | boolean,
    cast = "",
  ) {
    values.push(value);
    setClauses.push(`${column} = $${values.length}${cast}`);
  }

  if (updates.date !== undefined) {
    addField("date", updates.date, "::date");
  }

  if (updates.meetingType !== undefined) {
    addField("meeting_type", updates.meetingType);
  }

  if (updates.presiding !== undefined) {
    addField("presiding", updates.presiding);
  }

  if (updates.conducting !== undefined) {
    addField("conducting", updates.conducting);
  }

  if (updates.announcements !== undefined) {
    values.push(JSON.stringify(updates.announcements));
    setClauses.push(
      `announcements = ARRAY(SELECT jsonb_array_elements_text($${values.length}::jsonb))`,
    );
  }

  if (updates.openingHymn !== undefined) {
    addField("opening_hymn", JSON.stringify(updates.openingHymn), "::jsonb");
  }

  if (updates.openingPrayer !== undefined) {
    addField("opening_prayer", updates.openingPrayer);
  }

  if (updates.wardBusiness !== undefined) {
    addField("ward_business", JSON.stringify(updates.wardBusiness), "::jsonb");
  }

  if (updates.stakeBusiness !== undefined) {
    addField("stake_business", updates.stakeBusiness);
  }

  if (updates.sacramentHymn !== undefined) {
    addField(
      "sacrament_hymn",
      JSON.stringify(updates.sacramentHymn),
      "::jsonb",
    );
  }

  if (updates.speakers !== undefined) {
    addField("speakers", JSON.stringify(updates.speakers), "::jsonb");
  }

  if (updates.closingHymn !== undefined) {
    addField("closing_hymn", JSON.stringify(updates.closingHymn), "::jsonb");
  }

  if (updates.closingPrayer !== undefined) {
    addField("closing_prayer", updates.closingPrayer);
  }

  // Nothing to update: return the current meeting.
  if (setClauses.length === 0) {
    return getMeetingById(id);
  }

  values.push(id);

  const rows = await sql.query(
    `UPDATE meetings
     SET ${setClauses.join(", ")}
     WHERE id = $${values.length}
     RETURNING ${MEETING_RETURNING}`,
    values,
  );

  return (rows[0] as SacramentMeeting | undefined) ?? null;
}

export async function deleteMeeting(id: number): Promise<boolean> {
  const rows = await sql`
    DELETE FROM meetings
    WHERE id = ${id}
    RETURNING id
  `;

  return rows.length > 0;
}
