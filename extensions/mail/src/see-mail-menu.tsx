import {
  Action,
  Color,
  environment,
  getPreferenceValues,
  Icon,
  launchCommand,
  LaunchType,
  MenuBarExtra,
  openCommandPreferences,
} from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";

import { Mailbox } from "./types";
import { getAccounts } from "./scripts/accounts";
import { GetMessageResult, getMessages, openMessage } from "./scripts/messages";
import { MenuBarItem, MenuBarSection } from "./utils";
import { isImportantMailbox, isInbox } from "./utils/mailbox";
import { MailIcon } from "./utils/presets";
import { MessageDetail } from "./components";

export default function SeeMailMenu() {
  const { maxItems, showCount, mailbox } = getPreferenceValues<Preferences.SeeMailMenu>();
  const mailboxFilter = mailbox === "Recent Mail" ? isInbox : isImportantMailbox;

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error,
  } = useCachedPromise(
    async (_filter: (mailbox: Mailbox) => boolean) => {
      const accounts = await getAccounts();

      if (!accounts) {
        return [];
      }

      const responses = await Promise.all(
        accounts.map((account) => {
          const mailbox = account.mailboxes.find(_filter);
          if (!mailbox) {
            return { messages: [], messageCount: 0 } as GetMessageResult;
          }
          return getMessages(account, mailbox, true, parseInt(maxItems), false);
        }),
      );

      return accounts.map((account, index) => {
        account.messages = responses[index].messages ?? [];
        account.messageCount = responses[index].messageCount ?? 0;
        return account;
      });
    },
    [mailboxFilter],
    {
      failureToastOptions: { title: "Could not get recent messages from accounts" },
    },
  );

  const numMessages = (accounts ?? []).reduce((a, account) => a + (account.messageCount ?? 0), 0);
  const reloadMenu = () => launchCommand({ name: environment.commandName, type: LaunchType.UserInitiated });
  const launchExtCommand = () =>
    launchCommand({
      name: mailbox === "Recent Mail" ? "see-recent-mail" : "see-important-mail",
      type: LaunchType.UserInitiated,
    });

  return (
    <MenuBarExtra
      icon={Icon.Envelope}
      isLoading={isLoadingAccounts}
      title={showCount ? `${numMessages}` : undefined}
      tooltip={mailbox}
    >
      {numMessages &&
        (accounts ?? []).map((account) => {
          const folder = account.mailboxes.find(mailboxFilter);
          return folder ? (
            <MenuBarSection
              title={account.name}
              key={account.id}
              maxChildren={account.messageCount}
              moreElement={(hidden) => <MenuBarItem title={`... ${hidden} more`} onAction={launchExtCommand} />}
              emptyElement={<MenuBarItem title="No unread messages" />}
            >
              {account.messages?.map((msg) => (
                <MenuBarItem
                  key={msg.id}
                  title={msg.subject ?? "No Subject"}
                  icon={msg.read ? MailIcon.Read : MailIcon.Unread}
                  onAction={() => openMessage(msg, folder)}
                />
              ))}
            </MenuBarSection>
          ) : undefined;
        })}
      {!error && !numMessages && !isLoadingAccounts && (
        <MenuBarItem title={"No Recent Unread Messages"} icon={{ source: Icon.Envelope, tintColor: Color.Purple }} />
      )}
      {error && (
        <MenuBarItem
          title={error.message}
          icon={{ source: Icon.Warning, tintColor: Color.Red }}
          onAction={reloadMenu}
        />
      )}

      <MenuBarSection>
        <MenuBarItem
          title={`Open ${mailbox}`}
          icon={Icon.Envelope}
          shortcut={{ modifiers: ["cmd"], key: "o" }}
          onAction={launchExtCommand}
        />
        <MenuBarItem
          title="Configure Command"
          shortcut={{ modifiers: ["cmd"], key: "," }}
          icon={Icon.Gear}
          onAction={openCommandPreferences}
        />
      </MenuBarSection>
    </MenuBarExtra>
  );
}
