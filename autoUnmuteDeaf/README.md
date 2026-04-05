# AutoUnmuteDeaf

Sunucu tarafindan atilan **mute** ve **deaf** islemlerini otomatik olarak kaldiran bir Vencord userplugin'i.

## Nasil Calisir?

Plugin, Discord'un `VOICE_STATE_UPDATES` event'lerini yakalar ve sunucu tarafindan uygulanan mute/deaf flag'lerini istemci tarafinda kaldirir. Bu sayede sunucu sizi mute veya deaf yapsa bile ses iletimi ve alimi devam eder.

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
