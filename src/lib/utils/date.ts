import { format, parseISO } from 'date-fns';

export function generateICSEvent(params: {
  title: string;
  description: string;
  date: string;
  id: string;
}): string {
  const d = parseISO(params.date);
  const dateStr = format(d, "yyyyMMdd'T'HHmmss");

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GovMate AI//Deadline//EN',
    'BEGIN:VEVENT',
    `UID:${params.id}@govmate.ai`,
    `DTSTART;VALUE=DATE:${format(d, 'yyyyMMdd')}`,
    `DTEND;VALUE=DATE:${format(d, 'yyyyMMdd')}`,
    `SUMMARY:${params.title}`,
    `DESCRIPTION:${params.description.replace(/\n/g, '\\n')}`,
    `DTSTAMP:${dateStr}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Deadline: ${params.title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
