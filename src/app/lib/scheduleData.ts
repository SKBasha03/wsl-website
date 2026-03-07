export type ScheduleMatch = {
  id: string;
  home: string;
  away: string;
  label: string;
  meta: string;
  status: "scheduled" | "coming-soon";
};

export type GroupSchedule = {
  group: "A" | "B" | "C" | "D" | "E" | "F";
  matches: ScheduleMatch[];
};

function mkMatch(
  group: GroupSchedule["group"],
  index: number,
  home: string,
  away: string,
  meta: string,
  status: ScheduleMatch["status"]
): ScheduleMatch {
  return {
    id: `${group}-${index}`,
    home,
    away,
    label: `Match ${index}`,
    meta,
    status,
  };
}

export function getAllScheduledMatches(): ScheduleMatch[] {
  const week1Groups: GroupSchedule[] = [
    {
      group: "A",
      matches: [
        mkMatch("A", 1, "Majunu", "Spartan", "Monday | March 09, 2026", "scheduled"),
        mkMatch("A", 2, "Majunu", "Harry", "Tuesday | March 10, 2026", "scheduled"),
        mkMatch("A", 3, "Majunu", "Hasagi", "Wednesday | March 11, 2026", "scheduled"),
        mkMatch("A", 4, "Hasagi", "Harry", "Thursday | March 12, 2026", "scheduled"),
        mkMatch("A", 5, "Hasagi", "Spartan", "Friday | March 13, 2026", "scheduled"),
        mkMatch("A", 6, "Harry", "Spartan", "Friday | March 13, 2026", "scheduled"),
      ],
    },
    {
      group: "B",
      matches: [
        mkMatch("B", 1, "Nightfury", "Corona", "Monday | March 09, 2026", "scheduled"),
        mkMatch("B", 2, "Nightfury", "Kentucky", "Tuesday | March 10, 2026", "scheduled"),
        mkMatch("B", 3, "Nightfury", "Wizard", "Wednesday | March 11, 2026", "scheduled"),
        mkMatch("B", 4, "Corona", "Kentucky", "Thursday | March 12, 2026", "scheduled"),
        mkMatch("B", 5, "Corona", "Wizard", "Monday | March 09, 2026", "scheduled"),
        mkMatch("B", 6, "Kentucky", "Wizard", "Wednesday | March 11, 2026", "scheduled"),
      ],
    },
    {
      group: "C",
      matches: [
        mkMatch("C", 1, "Jilla", "Santy", "Sunday | March 15, 2026", "scheduled"),
        mkMatch("C", 2, "Jilla", "Slayer", "Saturday | March 14, 2026", "scheduled"),
        mkMatch("C", 3, "Jilla", "Sudhir", "Saturday | March 14, 2026", "scheduled"),
        mkMatch("C", 4, "Santy", "Slayer", "Monday | March 09, 2026", "scheduled"),
        mkMatch("C", 5, "Santy", "Sudhir", "Tuesday | March 10, 2026", "scheduled"),
        mkMatch("C", 6, "Slayer", "Sudhir", "Wednesday | March 11, 2026", "scheduled"),
      ],
    },
    {
      group: "D",
      matches: [
        mkMatch("D", 1, "Mind", "Adhil", "Monday | March 09, 2026", "scheduled"),
        mkMatch("D", 2, "Mind", "Arvind Siva", "Wednesday | March 11, 2026", "scheduled"),
        mkMatch("D", 3, "Mind", "Rushyy", "Tuesday | March 10, 2026", "scheduled"),
        mkMatch("D", 4, "Adhil", "Arvind Siva", "Thursday | March 12, 2026", "scheduled"),
        mkMatch("D", 5, "Adhil", "Rushyy", "Friday | March 13, 2026", "scheduled"),
        mkMatch("D", 6, "Arvind Siva", "Rushyy", "Friday | March 13, 2026", "scheduled"),
      ],
    },
    {
      group: "E",
      matches: [
        mkMatch("E", 1, "Abhiram", "ADN", "Sunday | March 15, 2026", "scheduled"),
        mkMatch("E", 2, "Abhiram", "Flat-C", "Tuesday | March 10, 2026", "scheduled"),
        mkMatch("E", 3, "Abhiram", "Sibin Michael", "Saturday | March 14, 2026", "scheduled"),
        mkMatch("E", 4, "ADN", "Flat-C", "Sunday | March 15, 2026", "scheduled"),
        mkMatch("E", 5, "ADN", "Sibin Michael", "Saturday | March 14, 2026", "scheduled"),
        mkMatch("E", 6, "Flat-C", "Sibin Michael", "Saturday | March 14, 2026", "scheduled"),
      ],
    },
    {
      group: "F",
      matches: [
        mkMatch("F", 1, "Adhireya", "Meethun", "Friday | March 13, 2026", "scheduled"),
        mkMatch("F", 2, "Adhireya", "Ejas", "Monday | March 09, 2026", "scheduled"),
        mkMatch("F", 3, "Adhireya", "Akhil", "Monday | March 09, 2026", "scheduled"),
        mkMatch("F", 4, "Meethun", "Ejas", "Friday | March 13, 2026", "scheduled"),
        mkMatch("F", 5, "Meethun", "Akhil", "Friday | March 13, 2026", "scheduled"),
        mkMatch("F", 6, "Ejas", "Akhil", "Wednesday | March 11, 2026", "scheduled"),
      ],
    },
  ];

  return week1Groups.flatMap((group) => group.matches);
}

export function parseMatchDate(meta: string): Date | null {
  // Supports strings like: "Monday | March 09, 2026"
  const match = meta.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (!match) return null;

  const monthName = match[1];
  const day = Number(match[2]);
  const year = Number(match[3]);
  
  const monthIndexByName: Record<string, number> = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  const monthIndex = monthIndexByName[monthName];
  if (monthIndex == null) return null;

  return new Date(year, monthIndex, day);
}

export function getUpcomingMatches(limit: number = 10): ScheduleMatch[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const allMatches = getAllScheduledMatches();
  
  return allMatches
    .filter((match) => {
      const matchDate = parseMatchDate(match.meta);
      return matchDate && matchDate >= today;
    })
    .sort((a, b) => {
      const dateA = parseMatchDate(a.meta);
      const dateB = parseMatchDate(b.meta);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, limit);
}

export function getNextDateMatches(): ScheduleMatch[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const allMatches = getAllScheduledMatches();
  
  // Get all upcoming matches sorted by date
  const upcomingMatches = allMatches
    .filter((match) => {
      const matchDate = parseMatchDate(match.meta);
      return matchDate && matchDate >= today;
    })
    .sort((a, b) => {
      const dateA = parseMatchDate(a.meta);
      const dateB = parseMatchDate(b.meta);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });
  
  if (upcomingMatches.length === 0) return [];
  
  // Get the date of the first upcoming match
  const firstMatchDate = parseMatchDate(upcomingMatches[0].meta);
  if (!firstMatchDate) return [];
  
  // Return all matches from that same date
  return upcomingMatches.filter((match) => {
    const matchDate = parseMatchDate(match.meta);
    if (!matchDate) return false;
    return matchDate.getTime() === firstMatchDate.getTime();
  });
}
