type JSONValue = string | number | boolean | JSONObject | JSONArray;
interface JSONObject {
  [key: string]: JSONValue;
}
interface JSONArray extends Array<JSONValue> {}
// todo have a place where types are stored

export function findAllActiveEvents(obj: JSONValue): any[][] {
  const results: any[][] = [];

  function search(node: JSONValue): void {
    if (typeof node !== "object" || node === null) return;

    if (Array.isArray(node)) {
      for (const item of node) {
        search(item);
      }
    } else {
      for (const key in node) {
        const value = node[key];
        if (key === "activeEvents" && Array.isArray(value)) {
          const LetmesimponyouEvents = value
            .filter((e: any) => e.instanceId == null) // theres like client events with this, no point tracking
            .map((event: any) => ({
              eventType: event.eventType,
              activeUntil: event.activeUntil,
              activeSince: event.activeSince,
            }));
          results.push(LetmesimponyouEvents);
        } else {
          search(value);
        }
      }
    }
  }

  search(obj);
  return results;
}

function isEventModified(oldEvent: any, newEvent: any): boolean {
  const oldStart = oldEvent.activeSince;
  const oldEnd = oldEvent.activeUntil;
  const newStart = newEvent.activeSince;
  const newEnd = newEvent.activeUntil;

  return oldStart !== newStart || oldEnd !== newEnd;
}

export function diffEvents(TimelineOld: any[], FindAllActiveEvents: any[]) {
  const added = FindAllActiveEvents.filter(
    (newEvent) =>
      !TimelineOld.some((old) => old.eventType === newEvent.eventType)
  );

  const removed = TimelineOld.filter(
    (old) =>
      !FindAllActiveEvents.some(
        (newEvent) => newEvent.eventType === old.eventType
      )
  );

  const modified: any[] = [];

  FindAllActiveEvents.filter((newEvent) => {
    const oldEvent = TimelineOld.find(
      (old) => old.eventType === newEvent.eventType
    );

    if (oldEvent && isEventModified(oldEvent, newEvent)) {
      const cahnges: any = {};

      cahnges.oldActiveUntil = oldEvent.activeUntil;
      cahnges.newActiveUntil = newEvent.activeUntil;
      cahnges.oldActiveSince = oldEvent.activeSince;
      cahnges.newActiveSince = newEvent.activeSince;

      if (Object.keys(cahnges).length > 0) {
        cahnges.eventType = newEvent.eventType;
        modified.push(cahnges);
        return cahnges;
      }
    }

    return false;
  });

  return { added, removed, modified };
}
