import { Period } from "@/types/analytics"
import { endOfMonth, format, intervalToDuration, startOfMonth } from "date-fns"

export function DateToDurationString(
    end: Date | null | undefined,
    start: Date | null | undefined
){
    if (!end || !start) return null
    const timeElapsed = end.getTime() - start.getTime()
    if (timeElapsed < 1000){
        return `${timeElapsed}ms`
    }

    const duration = intervalToDuration({
        start: 0,
        end: timeElapsed
    })
    return `${duration.minutes || 0}m ${duration.seconds || 0}s`
}

export function formatDateAtTime(isoString: string): string {
  return format(new Date(isoString), "dd MMM yyyy 'at' hh:mm a");
}

export function PeriodToDateRange(period:Period){
    const startDate = startOfMonth(new Date(period.year, period.month))
    const endDate = endOfMonth(new Date(period.year, period.month))
    return {startDate, endDate}
}