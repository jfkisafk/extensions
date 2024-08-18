import { List } from "@raycast/api";

const DeltaLiveTables = () => (
  <List>
    <List.EmptyView
      icon={{ source: "databricks.svg" }}
      title={"No pipelines found!"}
      description={"Your workspace does not have any pipelines."}
    />
  </List>
);

export default DeltaLiveTables;
