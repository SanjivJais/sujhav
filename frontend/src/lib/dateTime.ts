import { toZonedTime } from "date-fns-tz"

export const utcToLocal = (utCDateTime: string) => {
    const localDateTime = toZonedTime(new Date(utCDateTime), Intl.DateTimeFormat().resolvedOptions().timeZone);
    return localDateTime
}