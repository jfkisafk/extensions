import {Action, ActionPanel, Color, Detail, List} from "@raycast/api";

const DeltaLiveTables = () => (
    <List>
      <List.Item
        icon={{source: "databricks.svg"}}
        title="Greeting"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
          </ActionPanel>
        }
      />
    </List>
  );

export default DeltaLiveTables;
