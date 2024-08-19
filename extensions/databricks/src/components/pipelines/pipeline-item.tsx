import { Color, Icon, List } from "@raycast/api";
import { PipelineActions, PipelineActionsProps } from "@components/pipelines/pipeline-actions";

const statusToIcon = {
  DEPLOYING: { source: Icon.Play, tintColor: Color.Green },
  STARTING: { source: Icon.Play, tintColor: Color.Blue },
  RUNNING: { source: Icon.Forward, tintColor: Color.Blue },
  STOPPING: { source: Icon.Stop, tintColor: Color.Orange },
  DELETED: { source: Icon.Trash, tintColor: Color.Red },
  RECOVERING: { source: Icon.BandAid, tintColor: Color.Yellow },
  FAILED: { source: Icon.XMarkCircle, tintColor: Color.Red },
  RESETTING: { source: Icon.RotateClockwise, tintColor: Color.Magenta },
  IDLE: { source: Icon.Hourglass, tintColor: Color.Purple },
};

export const PipelineItem = ({ pipeline, ...rest }: PipelineActionsProps) => (
  <List.Item
    key={pipeline.pipeline_id}
    title={pipeline.name}
    icon={{ source: "databricks.svg" }}
    keywords={[
      pipeline.name,
      pipeline.pipeline_id,
      pipeline.creator_user_name ?? "",
      pipeline.run_as_user_name ?? "",
      pipeline.cluster_id ?? "",
    ]}
    accessories={[
      ...(pipeline.latest_updates && pipeline.latest_updates.length > 0
        ? [
            {
              date: new Date(pipeline.latest_updates[0].creation_time),
              icon: { source: Icon.Clock, tintColor: Color.Blue },
              tooltip: `Last updated: ${pipeline.latest_updates[0].creation_time}`,
            },
          ]
        : []),
      ...(pipeline.cluster_id
        ? [
            {
              icon: { source: Icon.ComputerChip, tintColor: Color.Yellow },
              tooltip: `Cluster: ${pipeline.cluster_id}`,
            },
          ]
        : []),
      { icon: Icon.Person, tooltip: `Creator: ${pipeline.creator_user_name}` },
      { icon: statusToIcon[pipeline.state as keyof typeof statusToIcon], tooltip: `State: ${pipeline.state}` },
    ]}
    actions={<PipelineActions {...{ pipeline, ...rest }} />}
  />
);
