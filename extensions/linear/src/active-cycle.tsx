import { Action, ActionPanel, List } from "@raycast/api";
import { useMemo, useState } from "react";

import { getActiveCycleIssues } from "./api/getIssues";

import useIssues from "./hooks/useIssues";
import useTeams from "./hooks/useTeams";
import usePriorities from "./hooks/usePriorities";
import useMe from "./hooks/useMe";
import useUsers from "./hooks/useUsers";

import { getTeamIcon } from "./helpers/teams";

import StateIssueList from "./components/StateIssueList";
import CreateIssueForm from "./components/CreateIssueForm";
import View from "./components/View";

function ActiveCycle() {
  const [teamQuery, setTeamQuery] = useState<string>("");
  const { teams, isLoadingTeams } = useTeams(teamQuery);
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  const { priorities, isLoadingPriorities } = usePriorities();
  const { me, isLoadingMe } = useMe();
  const { users, isLoadingUsers } = useUsers();

  const cycleId = useMemo(() => {
    return teams?.find((team) => team.id === selectedTeam)?.activeCycle?.id;
  }, [selectedTeam]);

  const { issues, isLoadingIssues, mutateList } = useIssues(getActiveCycleIssues, [cycleId], {
    execute: !!cycleId && cycleId.trim().length > 0,
  });

  return (
    <List
      searchBarAccessory={
        <List.Dropdown
          tooltip="Change Team"
          onChange={setSelectedTeam}
          storeValue
          throttle
          isLoading={isLoadingTeams}
          onSearchTextChange={setTeamQuery}
        >
          {teams?.map((team) => (
            <List.Dropdown.Item key={team.id} value={team.id} title={team.name} icon={getTeamIcon(team)} />
          ))}
        </List.Dropdown>
      }
      isLoading={isLoadingIssues || isLoadingTeams || isLoadingPriorities || isLoadingMe || isLoadingUsers}
      searchBarPlaceholder="Filter by ID, title, status, assignee or priority"
      filtering={{ keepSectionOrder: true }}
    >
      <List.EmptyView
        title={cycleId ? "No issues" : "No active cycles"}
        description={cycleId ? "There are no issues in the active cycle." : "This team does not have active cycles."} // "There are no issues in the active cycle."
        {...{
          ...((cycleId && {
            actions: (
              <ActionPanel>
                <Action.Push
                  title="Create Issue"
                  target={
                    <CreateIssueForm
                      cycleId={cycleId}
                      teamId={selectedTeam}
                      priorities={priorities}
                      users={users}
                      me={me}
                    />
                  }
                />
              </ActionPanel>
            ),
          }) ||
            {}),
        }}
      />
      <StateIssueList issues={issues} mutateList={mutateList} priorities={priorities} users={users} me={me} />
    </List>
  );
}

export default function Command() {
  return (
    <View>
      <ActiveCycle />
    </View>
  );
}
