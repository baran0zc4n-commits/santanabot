# AutoUnmuteDeaf

Sunucu tarafindan atilan **mute** ve **deaf** islemlerini otomatik olarak kaldiran bir Vencord userplugin'i.

## Nasil Calisir?

Plugin, `FluxDispatcher.dispatch` metodunu sarmalayarak `VOICE_STATE_UPDATES` event'lerini store'lara ulasmadan ONCE yakalar ve sunucu tarafindan uygulanan mute/deaf flag'lerini kaldirir. Bu sayede VoiceStateStore sunucu mute/deaf durumunu hic gormez ve istemci normal sekilde calismaya devam eder.

**Not:** Sunucu deaf bypass'i kesinlikle calisir (sunucu sesi gondermeye devam eder). Sunucu mute bypass'i ise Discord'un sunucu tarafinda ses paketlerini engelleyip engellememesine baglidir.

## Ayarlar

| Ayar | Aciklama | Varsayilan |
|------|----------|------------|
| **autoUnmute** | Sunucu mute'unu otomatik olarak kaldir | Acik |
| **autoUndeaf** | Sunucu deaf'ini otomatik olarak kaldir | Acik |

## Kurulum

1. Vencord'u kaynak koddan derleyerek kurun:
   ```bash
   git clone https://github.com/Vendicated/Vencord
   cd Vencord
   pnpm install --frozen-lockfile
   ```

2. Bu klasoru `src/userplugins/` dizinine kopyalayin:
   ```bash
   cp -r autoUnmuteDeaf /path/to/Vencord/src/userplugins/
   ```

3. Vencord'u derleyin ve enjekte edin:
   ```bash
   pnpm build
   pnpm inject
   ```

4. Discord'u yeniden baslatin.

5. Discord ayarlarindan **Vencord > Plugins** kismina gidin ve **AutoUnmuteDeaf** plugin'ini aktif edin.
