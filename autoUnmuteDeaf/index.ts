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
        description: "Sunucu mute'unu otomatik olarak kaldır",
        type: OptionType.BOOLEAN,
        default: true,
    },
    autoUndeaf: {
        description: "Sunucu deaf'ini otomatik olarak kaldır",
        type: OptionType.BOOLEAN,
        default: true,
    }
});

let enabled = false;

function interceptor(action: any) {
    if (!enabled) return;

    if (action.type === "VOICE_STATE_UPDATES") {
        const myId = UserStore.getCurrentUser()?.id;
        if (!myId || !action.voiceStates) return;

        for (const state of action.voiceStates) {
            if (state.userId === myId) {
                if (settings.store.autoUnmute) state.mute = false;
                if (settings.store.autoUndeaf) state.deaf = false;
            }
        }
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

    start() {
        enabled = true;
        (FluxDispatcher as any).addInterceptor(interceptor);
    },

    stop() {
        enabled = false;
    }
});
