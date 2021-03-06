// ====================================================================
// XEP-0050: Ad-Hoc Commands
// --------------------------------------------------------------------
// Source: https://xmpp.org/extensions/xep-0050.html
// Version: 1.2.2 (2016-12-03)
// ====================================================================

import {
    addAlias,
    attribute,
    childBoolean,
    childEnum,
    DefinitionOptions,
    extendStanzaError,
    text
} from '../jxt';
import { NS_ADHOC_COMMANDS, NS_DATAFORM } from '../Namespaces';

import { DataForm } from './';

declare module './' {
    export interface IQPayload {
        command?: AdHocCommand;
    }
    export interface StanzaError {
        commandError?: AdhocCommandError;
    }
}

export type AdhocCommandError =
    | 'bad-action'
    | 'bad-locale'
    | 'bad-payload'
    | 'bad-sessionid'
    | 'malformed-action'
    | 'session-expired';

export interface AdHocCommand {
    sid?: string;
    node?: string;
    status?: 'canceled' | 'executing' | 'completed';
    action?: 'execute' | 'cancel' | 'complete' | 'next' | 'prev';
    availableActions?: {
        execute: string;
        next?: boolean;
        prev?: boolean;
        complete?: boolean;
    };
    notes?: Array<{
        type?: 'info' | 'warn' | 'error';
        value?: string;
    }>;
    form?: DataForm;
}

const Protocol: DefinitionOptions[] = [
    addAlias(NS_DATAFORM, 'x', ['iq.command.form']),
    extendStanzaError({
        commandError: childEnum(NS_ADHOC_COMMANDS, [
            'bad-action',
            'bad-locale',
            'bad-payload',
            'bad-sessionid',
            'malformed-action',
            'session-expired'
        ])
    }),
    {
        element: 'command',
        fields: {
            action: attribute('action'),
            node: attribute('node'),
            sid: attribute('sessionid'),
            status: attribute('status')
        },
        namespace: NS_ADHOC_COMMANDS,
        path: 'iq.command'
    },
    {
        element: 'actions',
        fields: {
            complete: childBoolean(null, 'complete'),
            execute: attribute('execute'),
            next: childBoolean(null, 'next'),
            prev: childBoolean(null, 'prev')
        },
        namespace: NS_ADHOC_COMMANDS,
        path: 'iq.command.availableActions'
    },
    {
        aliases: [{ path: 'iq.command.notes', multiple: true }],
        element: 'note',
        fields: {
            type: attribute('type'),
            value: text()
        },
        namespace: NS_ADHOC_COMMANDS
    }
];
export default Protocol;
