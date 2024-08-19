import { callApi } from "@api/base";

type LatestUpdate = {
  update_id: string;
  state: string;
  creation_time: string;
};

export type Pipeline = {
  name: string;
  pipeline_id: string;
  state: string;
} & Partial<{
  creator_user_name: string;
  cluster_id: string;
  run_as_user_name: string;
  latest_updates: LatestUpdate[];
}>;

type ListPipelinesResponse = Partial<{
  statuses: Pipeline[];
  next_page_token: string;
}>;

type ListPipelinesRequest = Partial<{
  cursor: string;
  maxResults: number;
}>;

export const listPipelines = async (request?: ListPipelinesRequest) => {
  const response = await callApi<ListPipelinesResponse>(
    `pipelines?${new URLSearchParams({
      order_by: ["name", "asc"].join(" "),
      max_results: request?.maxResults?.toString() ?? "100",
      ...(request?.cursor && { page_token: request?.cursor }),
    })}`,
  );

  return {
    pipelines: response?.statuses ?? [],
    cursor: response?.next_page_token,
  };
};
