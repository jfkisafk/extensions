import { List } from "@raycast/api";
import { usePipelines } from "@hooks/pipelines";
import { useFrecencySorting } from "@raycast/utils";
import { PipelineItem } from "@components/pipelines/pipeline-item";

const Pipelines = () => {
  const { pipelines, isLoading, error } = usePipelines();

  const {
    data: sortedPipelines,
    resetRanking,
    visitItem: visit,
  } = useFrecencySorting(pipelines, {
    key: (pipeline) => pipeline.pipeline_id,
    namespace: "databricks-pipelines",
    sortUnvisited: (a, b) => a.name.localeCompare(b.name),
  });

  return (
    <List isLoading={isLoading} navigationTitle={"Pipelines"}>
      {sortedPipelines?.map((pipeline) => <PipelineItem {...{ pipeline, visit, resetRanking }} />)}
      {!error && !(pipelines ?? []).length && (
        <List.EmptyView
          title={"No pipelines found!"}
          icon={{ source: "databricks.svg" }}
          description={"Your workspace does not have any pipelines."}
        />
      )}
      {error && (
        <List.EmptyView
          title={"Error fetching pipelines!"}
          description={error.message}
          icon={{ source: "databricks.svg" }}
        />
      )}
    </List>
  );
};

export default Pipelines;
