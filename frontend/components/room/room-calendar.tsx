"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export function RoomCalendar() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 21), // 21 Aug 2026
    to: addDays(new Date(2026, 7, 21), 2), // 23 Aug 2026
  });

  return (
    <div className="py-8 border-b border-neutral-200">
      <div>
        <h2 className="text-[22px] font-semibold mb-1">
          {date?.from && date?.to
            ? `${Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))} nights in Chandigarh`
            : "Select dates"}
        </h2>
        <div className="text-sm text-neutral-500 mb-6">
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "d MMM yyyy")} - {format(date.to, "d MMM yyyy")}
              </>
            ) : (
              format(date.from, "d MMM yyyy")
            )
          ) : (
            <span>Add your travel dates for exact pricing</span>
          )}
        </div>
      </div>

      <div className="flex w-full overflow-hidden items-center justify-center">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          className="border-none w-fit"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-12 sm:space-y-0",
            head_cell: "text-neutral-500 font-normal text-[0.8rem] w-12",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-neutral-100 first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20",
            day: "h-12 w-12 p-0 font-semibold aria-selected:opacity-100 hover:border hover:border-black hover:rounded-full rounded-full transition-all flex items-center justify-center",
            day_selected: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-full",
            day_today: "bg-neutral-100 text-neutral-900",
            day_outside: "text-neutral-300 opacity-50",
            day_disabled: "text-neutral-300 opacity-50",
            day_range_middle: "aria-selected:bg-neutral-100 aria-selected:text-neutral-900 !rounded-none hover:!rounded-full hover:border hover:border-black",
            day_range_end: "bg-black text-white rounded-full",
            day_range_start: "bg-black text-white rounded-full",
          }}
        />
      </div>
    </div>
  );
}
