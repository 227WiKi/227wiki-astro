# 歌曲数据模型

本文说明 Song、Version、分类与演唱者字段的约定，供迁移历史资料时遵循。Schema 在 `src/lib/song-schema.ts` 与 `src/content.config.ts`，索引逻辑在 `src/lib/song-index.ts`。

## Song 与 Version

- **Song** 是歌曲作品，一个文件对应一首，文件名即 Song ID，也是 URL：`/discography/songs/{id}/`。ID 一经发布不再改动。
- **Version** 是作品的一次具体录音或演唱，写在 Song 的 `versions` 数组里，`id` 在该 Song 内唯一且稳定。
- 不写 `versions` 时，Song 有一个隐含的原版，不带任何演唱者或分类信息。
- 标题相同不代表是同一首歌。只有人工确认后才把录音写成同一 Song 下的 Version。

```yaml
versions:
  - id: original          # 第一个 Version；kind 为 original 时必须排第一
    kind: original
    formation: group      # group | unit | solo，单个 Version 内互斥
    persona: member       # member | character
    performers:
      - { type: member, name: 西條和, ref: nagomi }
  - id: character
    kind: alternate-vocal # original | alternate-vocal | re-recording | re-arrangement | other
    label: キャラクター ver.
    formation: solo
    persona: character
    performers:
      - { type: character, name: 滝川みう }
```

## 分类

分两层，每层都来自显式字段：

| 层级 | 类别 | 依据 |
| --- | --- | --- |
| 类型 | 原创曲 | Song 的 `origin: original` |
| 类型 | 翻唱曲 | Song 的 `origin: cover`，可选 `coverOf: { artist, titleJa }` |
| 歌曲类别 | 小组曲 | 任一 Version 的 `formation: unit`，小组名写在 `unit` |
| 歌曲类别 | 角色曲 | 任一 Version 的 `persona: character` |

- 类型二选一；没有填 `origin` 时不显示类型，也不出现在类型筛选结果里，不默认归为原创曲。
- 歌曲类别可以叠加，也可以用在翻唱曲上，例如角色演唱的翻唱曲。
- `formation: group` 和 `formation: solo` 仍可填写，用于记录演唱编制，但不作为分类显示或筛选。
- 标题、发行作品名、演唱者人数都不能用来推断分类。
- 索引筛选：同一层内多选按「或」，类型与歌曲类别之间按「且」。

## 演唱者

- Member 与 Character 是不同身份。Character 照角色名填写，不改写成声优或成员，也不从角色与声优的对应关系推断演唱者。
- `ref` 可选。Member 的 `ref` 必须指向已有成员，构建时检查。Character 的 `ref` 只是为将来的 Character 集合预留的 ID，在 Character 页面上线前不生成链接。
- 没有确认的演唱者就不填 `performers`。

## Release 曲目

- `track.song` 指向 Song ID；需要指向非第一个 Version 时，再加 `track.version`，填该 Song 已声明的 Version ID，构建时检查。
- `variant: off-vocal` 是这条曲目本身的属性，表示该 Version 的伴奏，不是 Version，也不是独立的 Song。伴奏曲目与对应的人声曲目指向同一个 Song 和 Version。
- TV size 等剪辑同理，确认后按曲目属性处理，不新建 Song。

## 首次发行日期

- Song 的首次发行：第一个 Version 为 `original` 时，只看原版所在的曲目；原版不在已整理的作品里时，日期未知，不拿重录版的日期顶替。没有声明原版时，取所有 Version 中最早的一次。
- Version 的首次发行：该 Version 曲目所在的最早作品。
- 同一天的作品按单曲在前、专辑在后、编号、ID 排序；同一作品内按曲目位置排序。

## Live Setlist

Setlist 的 `song` 仍指向 Song ID，不指向 Version；现场演出与录音版本是不同的事。
