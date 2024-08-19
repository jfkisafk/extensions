import { useCachedPromise } from "@raycast/utils";
import { listPipelines, Pipeline } from "@api/pipelines";
import { isReady } from "@api/base";

export const usePipelines = () => {
  const fetch = async (cursor?: string, aggregate?: Pipeline[]) => {
    const { pipelines, cursor: nextCursor } = await listPipelines({ cursor });
    const agg = [...(aggregate ?? []), ...pipelines];
    if (nextCursor) return await fetch(nextCursor, agg);
    return agg;
  };

  const {
    data: pipelines,
    isLoading,
    error,
    mutate,
  } = useCachedPromise(fetch, [], { failureToastOptions: { title: "Failed to fetch pipelines" }, execute: isReady() });

  return { pipelines, isLoading: isLoading || (!pipelines && !error), error, mutate };
};
