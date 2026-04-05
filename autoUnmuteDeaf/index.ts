/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 santanabot
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { FluxDispatcher, UserStore } from "@webpack/common";

const settings = definePluginSettings({
    autoUnmute: {
        description: "Sunucu mute'unu otomatik olarak kaldir",
        type: OptionType.BOOLEAN,
        default: true,
    },
    autoUndeaf: {
        description: "Sunucu deaf'ini otomatik olarak kaldir",
        type: OptionType.BOOLEAN,
        default: true,
    }
});

let enabled = false;
let origDispatch: typeof FluxDispatcher.dispatch | null = null;

function stripServerFlags(action: any) {
    if (!enabled || action?.type !== "VOICE_STATE_UPDATES") return;

    try {
        const myId = UserStore.getCurrentUser()?.id;
        if (!myId || !Array.isArray(action.voiceStates)) return;

        for (const state of action.voiceStates) {
            if (state.userId === myId) {
                if (settings.store.autoUnmute) state.mute = false;
                if (settings.store.autoUndeaf) state.deaf = false;
            }
        }
    } catch (e) {
        console.error("[AutoUnmuteDeaf]", e);
    }
}

export default definePlugin({
    name: "AutoUnmuteDeaf",
    description: "Sunucu tarafindan atilan mute ve deaf'leri otomatik olarak kaldirir",
    authors: [{
        name: "santanabot",
        id: 0n
    }],
    settings,

    // Patch the voice connection module to prevent the media engine
    // from actually muting/deafening when server mute/deaf is applied.
    // This is needed because the voice WebSocket may signal mute
    // independently of Flux, directly to the media engine.
    patches: [
        {
            find: ".setSelfMute(",
            replacement: [
                {
                    // Intercept setSelfMute calls — when our plugin is
                    // enabled, always pass false to keep mic transmitting
                    match: /\.setSelfMute\((\w+)\)/,
                    replace: '.setSelfMute($self.filterMute($1))'
                },
                {
                    // Intercept setSelfDeaf calls — when our plugin is
                    // enabled, always pass false to keep audio receiving
                    match: /\.setSelfDeaf\((\w+(?:\.\w+)?)\)/,
                    replace: '.setSelfDeaf($self.filterDeaf($1))'
                }
            ]
        }
    ],

    filterMute(val: boolean) {
        if (!enabled || !settings.store.autoUnmute) return val;
        // Always return false to prevent any mute from being applied.
        // The dispatch wrapper already strips server mute from the
        // voice state, so selfMute clicks won't reach here as true
        // unless the user actually clicked mute themselves.
        // However, since server mute also flows through setSelfMute,
        // we must block it here too.
        return false;
    },

    filterDeaf(val: boolean) {
        if (!enabled || !settings.store.autoUndeaf) return val;
        return false;
    },

    start() {
        enabled = true;

        // Wrap FluxDispatcher.dispatch to modify voice state events
        // BEFORE any stores (like VoiceStateStore) process them.
        // This prevents the client from ever seeing server mute/deaf flags.
        origDispatch = FluxDispatcher.dispatch;
        const boundOrig = origDispatch.bind(FluxDispatcher);

        (FluxDispatcher as any).dispatch = function (action: any) {
            stripServerFlags(action);
            return boundOrig(action);
        };
    },

    stop() {
        enabled = false;
        if (origDispatch) {
            (FluxDispatcher as any).dispatch = origDispatch;
            origDispatch = null;
        }
    }
});
