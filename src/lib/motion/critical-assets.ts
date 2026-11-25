export interface AssetResult {
  success: boolean;
  ready: number;
  total: number;
  timedOut: boolean;
}
interface AssetWatchOptions {
  fontsReady: Promise<unknown>;
  timeoutMs?: number;
  onProgress: (ratio: number) => void;
  onSettled: (result: AssetResult) => void;
}
/** Only critical hero pixels/font readiness gate the intro. Cancellation detaches every listener. */
export function watchCriticalAssets(
  root: HTMLElement,
  { fontsReady, timeoutMs = 6500, onProgress, onSettled }: AssetWatchOptions,
) {
  let cancelled = false,
    finished = false,
    ready = 0;
  const cleanups: (() => void)[] = [];
  const images = [
    ...root.querySelectorAll<HTMLImageElement>("img[data-critical]"),
  ];
  const total = images.length + 1;
  const tasks = images.map(
    (img) =>
      new Promise<boolean>((resolve) => {
        let settled = false;
        const detach = () => {
          img.removeEventListener("load", settle);
          img.removeEventListener("error", settle);
        };
        const settle = () => {
          if (settled) return;
          settled = true;
          detach();
          if (img.naturalWidth === 0) {
            resolve(false);
            return;
          }
          img.decode().then(
            () => resolve(true),
            () => resolve(false),
          );
        };
        img.addEventListener("load", settle);
        img.addEventListener("error", settle);
        cleanups.push(() => {
          settled = true;
          detach();
          resolve(false);
        });
        if (img.complete) settle();
      }),
  );
  tasks.push(
    fontsReady.then(
      () => true,
      () => false,
    ),
  );
  const finish = (success: boolean, timedOut: boolean) => {
    if (cancelled || finished) return;
    finished = true;
    clearTimeout(timer);
    cleanups.forEach((cleanup) => cleanup());
    onSettled({ success, ready, total, timedOut });
  };
  const timer = setTimeout(() => finish(false, true), timeoutMs);
  tasks.forEach((task) =>
    task.then((ok) => {
      if (cancelled || finished) return;
      if (ok) ready++;
      onProgress(ready / total);
    }),
  );
  Promise.all(tasks).then((results) => finish(results.every(Boolean), false));
  return () => {
    if (cancelled) return;
    cancelled = true;
    clearTimeout(timer);
    cleanups.forEach((cleanup) => cleanup());
  };
}
