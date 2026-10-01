import { ExternalLink, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { hoursContent } from "@/content/hours";
import { buildMapsUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";
import { getWeekdayIndex } from "@/lib/weekday";

export function HoursSection() {
  const todayIndex = getWeekdayIndex(new Date());

  return (
    <section id="horarios" className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-bold tracking-tight">
          {hoursContent.title}
        </h2>
        <p className="mt-2 text-muted-foreground">{hoursContent.subtitle}</p>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-start">
          <Card>
            <CardContent>
              <dl className="space-y-1">
                {hoursContent.days.map((day, index) => {
                  const isToday = index === todayIndex;
                  return (
                    <div
                      key={day.label}
                      aria-current={isToday ? "date" : undefined}
                      className={cn(
                        "flex items-center justify-between gap-4 rounded-md px-2 py-1.5",
                        isToday && "bg-primary/10 font-semibold",
                      )}
                    >
                      <dt className="flex items-center gap-2">
                        {day.label}
                        {isToday && <Badge>{hoursContent.todayLabel}</Badge>}
                      </dt>
                      <dd
                        className={cn(
                          "tabular-nums",
                          day.closed && !isToday && "text-muted-foreground",
                          isToday && "text-foreground",
                        )}
                      >
                        {day.hours}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <MapPin aria-hidden="true" className="text-primary" />
                {hoursContent.addressLabel}
              </div>
              <address className="not-italic text-muted-foreground">
                {hoursContent.address}
              </address>
              <Button asChild>
                <a
                  href={buildMapsUrl(hoursContent.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {hoursContent.directions.label}
                  <ExternalLink aria-hidden="true" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
