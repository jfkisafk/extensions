import {Image, Keyboard, MenuBarExtra} from "@raycast/api";
import React from "react";

const shownElements = (elements?: React.ReactNode, maxElements?: number): { shown?: React.ReactNode; hidden: number } => {
    if (!maxElements) {
        return { shown: elements, hidden: 0 };
    }
    if (React.isValidElement(elements)) {
        return { shown: [elements], hidden: 0 };
    }
    const els = elements as React.JSX.Element[] | undefined;
    if (!els || els.length <= 0) {
        return { shown: undefined, hidden: 0 };
    }
    const maxShown = maxElements || 10;
    const shown = els.slice(0, maxShown);
    const hidden = els.length - shown.length;
    return { shown, hidden };
}

export function MenuBarSection(props: {
    title?: string;
    maxChildren?: number;
    children?: React.ReactNode;
    moreElement?: (hidden: number) => React.JSX.Element | null;
    emptyElement?: React.JSX.Element | null;
}): React.JSX.Element | null {
    const { shown, hidden } = shownElements(props.children, props.maxChildren);
    const empty = shown === undefined || (shown as object[]).length <= 0;
    return (
        <MenuBarExtra.Section title={props.title}>
            {shown}
            {hidden > 0 && props.moreElement && props.moreElement(hidden)}
            {empty && props.emptyElement && props.emptyElement}
        </MenuBarExtra.Section>
    );
}

const clipText = (text: string) => {
    const maxLength = 100;
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + " ...";
    }
    return text;
};

export function MenuBarItem(props: {
    title: string;
    subtitle?: string;
    icon?: Image.ImageLike;
    shortcut?: Keyboard.Shortcut | undefined;
    onAction?: ((event: object) => void) | undefined;
    tooltip?: string;
}): JSX.Element {
    return (
        <MenuBarExtra.Item
            title={clipText(props.title)}
            icon={props.icon}
            subtitle={props.subtitle}
            shortcut={props.shortcut}
            onAction={props.onAction}
            tooltip={props.tooltip}
        />
    );
}
