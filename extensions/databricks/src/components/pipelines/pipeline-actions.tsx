import { Action, ActionPanel, Icon, Keyboard } from "@raycast/api";
import { Pipeline } from "@api/pipelines";

export type PipelineActionsProps = {
  pipeline: Pipeline;
  resetRanking: (item: Pipeline) => Promise<void>;
  visit: (item: Pipeline) => Promise<void>;
};

export const PipelineActions = ({ pipeline, resetRanking, visit }: PipelineActionsProps) => (
  <ActionPanel>
    <ActionPanel.Section>
      <Action.CopyToClipboard
        title={"Copy Pipeline Name"}
        content={pipeline.name}
        onCopy={() => visit(pipeline)}
        shortcut={Keyboard.Shortcut.Common.Copy}
      />
      {pipeline.cluster_id && (
        <Action.CopyToClipboard
          title={"Copy Cluster Id"}
          content={pipeline.cluster_id}
          onCopy={() => visit(pipeline)}
          shortcut={{ modifiers: ["ctrl", "shift"], key: "c" }}
        />
      )}
    </ActionPanel.Section>
    <ActionPanel.Section>
      <Action
        title={"Reset Ranking"}
        onAction={() => resetRanking(pipeline)}
        icon={Icon.RotateClockwise}
        shortcut={{ modifiers: ["ctrl"], key: "r" }}
      />
    </ActionPanel.Section>
  </ActionPanel>
);
