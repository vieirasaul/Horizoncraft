export type OrderDirection = "up" | "down";

export function nextOrder(currentMax: number | null | undefined): number {
  return (currentMax ?? -1) + 1;
}

export function reorderById<T extends { id: string }>(
  items: readonly T[],
  id: string,
  direction: OrderDirection,
): T[] | null {
  const currentIndex = items.findIndex((item) => item.id === id);
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= items.length) {
    return null;
  }

  const reordered = [...items];
  [reordered[currentIndex], reordered[targetIndex]] = [
    reordered[targetIndex],
    reordered[currentIndex],
  ];
  return reordered;
}
