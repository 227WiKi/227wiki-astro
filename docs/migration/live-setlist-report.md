# Live Setlist 迁移报告

基线为迁移开始时当前 Astro 集合；未读取旧 MkDocs。逐表通过 Markdown AST 及源位置解析。编号去除排版用句点，前导零与 EN 编号保留；不假定全局连续。

## 实际统计

| 项目 | 数量 |
| --- | ---: |
| 扫描活动 | 120 |
| 扫描公演 | 234 |
| 旧曲目表 | 230 |
| 已迁移曲目表 | 225 |
| 待核实曲目表 | 5 |
| 已迁移活动 | 114 |
| 已录入曲目公演 | 224 |
| 已关联 Song 的曲目条目 | 129 |
| 暂未关联 Song 的曲目条目 | 2096 |
| Section | 121 |
| Note | 2 |
| 明确记录角色演唱者的曲目条目 | 15 |
| 已移除 iframe | 229 |
| 保留普通资料链接 | 399 |

3 篇无曲目表活动维持 Setlist 缺失。未给缺失场次生成空数组。Member 引用未由在籍阵容或角色 CV 推断。明确写明角色与 CV 的逐曲原注保存在 character.name 中，保持纯文本，不映射为 Member。

## 待核实原始记录

| 文件 | 原表标题 | Show | 原因与核实方向 |
| --- | --- | --- | --- |
| src/content/live-events/2017/2017-special-christmas-event.md | 曲目 | 未分配；现有 ID 见下方清单 | 共用曲目表未注明第一场或第二场；确认两场的曲序后再分配。朗读表保留原文。 |
| src/content/live-events/2018/2018-shampoo-release-events.md | 曲目 | 未分配；现有 ID 见下方清单 | 正文记载三场，当前 Show 只有两个日期；共用表未注明场次。需核实 4/14 两部的独立日程与曲序。 |
| src/content/live-events/2026/2026-live-in-taipei.md | 7月24日 Fan Meeting | 未分配；现有 ID 见下方清单 | 曲目表日期在现有 Show 中不存在；保留原表，需核实独立 Show 的日期和会场。 |
| src/content/live-events/2026/2026-star-travelers.md | Episode1／失われたホロスコープ | 未分配；现有 ID 见下方清单 | Episode 曲目与 2/7、2/8、2/14 舞台见面会的对应关系未记录；不能按顺序猜测。 |
| src/content/live-events/2026/2026-star-travelers.md | Episode2／エメラルドの奇跡 | 未分配；现有 ID 见下方清单 | Episode 曲目与 2/7、2/8、2/14 舞台见面会的对应关系未记录；不能按顺序猜测。 |

上述原表仍可读，未复制到多个 Show。2018 发售活动的两条既有 Show 未擅自改成三条，原文三场说明保留。Star Travelers 的角色姓名仍在原表中。

## 曲目关联

仅现存 Song 正式名称完全一致时关联（无模糊匹配）。

| 已关联标题 | ID | 出现次数 |
| --- | --- | ---: |
| 地下鉄抵抗主義 | chikatetsu-teikou-shugi | 69 |
| 僕は存在していなかった | boku-wa-sonzai-shiteinakatta | 45 |
| 11人が集まった理由 | 11nin-ga-atsumatta-riyuu | 15 |

### 暂无 Song 关联的标题

保留曲目文本；包含翻唱、子组合注释等，不创建空页面。数字为已迁移条目次数；未分配原表不计入这些条目统计。

| 标题 | 次数 |
| --- | ---: |
| 22/7 | 15 |
| adrenaline!!!（TrySail Cover） | 1 |
| Crash | 2 |
| DOWN TOWN | 1 |
| ETERNAL BLAZE | 1 |
| God knows... | 1 |
| Honey Come!! | 1 |
| HOT LIMIT（天城サリー Solo Cover） | 1 |
| INTERNET ANGEL | 1 |
| INTERNET OVERDOSE（Anime version） | 1 |
| Jupiter | 1 |
| Just here and now | 34 |
| LOVEマシーン | 1 |
| Lucky Happy Everyday | 1 |
| Missing You | 1 |
| Moonlight | 4 |
| Moonlight／立川絢香（CV.宮瀬玲奈） | 1 |
| oath sign（LiSA） | 1 |
| One of them | 4 |
| One of them／滝川みう（CV.西條和） | 1 |
| only my railgun | 1 |
| Overture | 12 |
| Overture - spring parade ver.- | 2 |
| Overture (Anniversary Live 2024 ver.) | 4 |
| pray | 1 |
| Rain of lies | 40 |
| riddle mermaid（椎名桜月 Solo Cover） | 1 |
| Rising Hope | 1 |
| secret base ～君がくれたもの～ | 1 |
| To goでよろしく！ | 19 |
| Why are you crying? | 12 |
| YESとNOの間に | 60 |
| アイロニ | 1 |
| あざす | 12 |
| あたしを彼女にしたいなら（コレサワ） | 1 |
| あちこちに残された走り書きの意味 | 10 |
| あちこちに残された走り書きの意味 / 22/7_the 3rd | 1 |
| あなたがここにいて抱きしめることができるなら（椎名桜月 Solo Cover） | 1 |
| あなたでなくちゃ | 37 |
| あやふやな世界観 | 12 |
| いつの間にSunrise | 13 |
| イングリッシュ・ゴールデンレトリバー | 2 |
| お姉ちゃんだから（初披露） | 1 |
| カントリーガール | 21 |
| キウイの主張 | 11 |
| キウイの主張（根室ver.） | 1 |
| クリスマスソング（back number） | 1 |
| このピアノでお前を8759632145回ぶん殴る | 1 |
| じゃあね | 1 |
| じゃあね (おニャン子クラブ Cover) | 1 |
| シャンプーの匂いがした | 69 |
| スパシーバ！ | 14 |
| ソフトクリーム落としちゃった | 18 |
| ソフトクリーム落としちゃった／気の抜けたサイダー | 1 |
| だから僕は音楽を辞めた（ヨルシカ） | 1 |
| タチツテトパワー | 45 |
| タトゥー・ラブ | 17 |
| タトゥー・ラブ／蛍光灯再生計画 | 1 |
| とんぼの気持ち | 30 |
| ハレロ | 16 |
| ひとくちぶん | 2 |
| ヒヤシンス | 40 |
| ファンサ（HoneyWorks） | 1 |
| ファンサ（望月りの Solo Cover） | 1 |
| ブルーバード（いきものがかり） | 1 |
| ヘッドフォンを外せ! | 2 |
| ヘッドフォンを外せ！ | 5 |
| ポニーテールは振り向かせない | 44 |
| マリーゴールド | 1 |
| ムズイ | 31 |
| もう少し生きてみないか？ | 2 |
| もう純情は邪魔なだけ | 8 |
| もんだいガール（望月りの Solo Cover） | 1 |
| やさしい記憶 | 26 |
| やさしい記憶（三雲遥加 Solo） | 1 |
| ラムのラブソング（松谷祐子） | 1 |
| ロキ | 1 |
| ロックは死なない | 12 |
| ロマンスの積み木 | 30 |
| ロミオとシンデレラ（椎名桜月 Solo Cover） | 1 |
| 不確かな青春 | 42 |
| 世界の矛盾 | 13 |
| 世界中で歌おうぜ | 28 |
| 乳酸菌たち | 5 |
| 二つの道 | 14 |
| 交換条件 | 16 |
| 交換条件 (全員 ver.) | 1 |
| 人格崩壊 | 15 |
| 人生はワルツ | 3 |
| 人生はワルツ／戸田ジュン（CV.海乃るり） | 1 |
| 今年 初めての雪 | 10 |
| 佐藤さん | 17 |
| 何もしてあげられない | 49 |
| 僕が持ってるものなら | 27 |
| 僕のホロスコープ | 13 |
| 僕のホロスコープ (気の抜けたサイダー ver.) | 1 |
| 僕は今夜、出て行く | 14 |
| 僕は存在していなかった（桧山依子 Solo） | 1 |
| 僕らの環境 | 37 |
| 優等生じゃつまらない | 3 |
| 優等生じゃつまらない／佐藤麗華（CV.帆風千春） | 1 |
| 最後のピアノ | 15 |
| 千本桜 | 2 |
| 半チャーハン | 18 |
| 半チャーハン (全員 ver.) | 1 |
| 半チャーハン／晴れた日のベンチ | 1 |
| 叫ぶしかない青春 | 21 |
| 叫ぶしかない青春（22/7_the 3rd） | 4 |
| 可愛くてごめん | 1 |
| 君とどれくらい会わずにいられるか？ | 17 |
| 君は Moon | 6 |
| 君はMoon | 21 |
| 君は誰だ？ | 14 |
| 告白 | 1 |
| 命の続き | 20 |
| 命の続き / 22/7_the 3rd | 1 |
| 命の続き（22/7_the 3rd） | 7 |
| 唱（月城咲舞 Solo Cover） | 1 |
| 地獄一丁目 | 2 |
| 声優になりたくて | 1 |
| 夢の船 | 3 |
| 夢の船／河野都（CV.倉岡水巴） | 1 |
| 好きと言ったのは嘘だ | 34 |
| 好きな人がいること（麻丘真央 Solo Cover） | 1 |
| 好きになるのは自由だし… | 19 |
| 好きになるのは自由だし…（橘茉奈 Solo） | 1 |
| 嫌われるということ | 13 |
| 孤独は嫌いじゃない | 5 |
| 孤独は嫌いじゃない／斎藤ニコル（CV.河瀬詩） | 1 |
| 幾億光年（望月りの・天城サリー） | 1 |
| 後でわかること | 20 |
| 循環バス | 73 |
| 恋するフォーチュンクッキー | 1 |
| 恋は道草 | 7 |
| 恋愛サーキュレーション（河瀬詩 Solo Cover） | 1 |
| 悲しみの半分 | 7 |
| 愛及証明 | 2 |
| 感情無用論 | 4 |
| 感情無用論／丸山あかね（CV.白沢かなえ） | 1 |
| 打ち上げ花火の拒否権 | 20 |
| 春夏秋冬猛ダッシュ！ | 2 |
| 春雷の頃 | 14 |
| 春雷の頃（黒崎ありす Solo） | 1 |
| 曇り空の向こうは晴れている | 47 |
| 曇り空の向こうは晴れている（折本美玲 Solo） | 1 |
| 未来があるから | 71 |
| 未来があるから（22/7_the 3rd） | 9 |
| 残酷な天使のテーゼ | 3 |
| 水平線（西條和 Solo Cover） | 1 |
| 渡良瀬橋（森高千里） | 1 |
| 炭水化物祭り | 3 |
| 無関心ヒーロー | 10 |
| 理解者 | 88 |
| 理論物理学的　僕の推論 | 6 |
| 生きることに楽になりたい | 5 |
| 生きることに楽になりたい／藤間桜（CV.天城サリー） | 1 |
| 生まれてはじめて | 1 |
| 神様だって決められない | 22 |
| 神様に指を差された僕たち | 3 |
| 神様に指を差された僕たち／神木みかみ（CV.涼花萌）・東条悠希（CV.高辻麗）・柊つぼみ（CV.武田愛奈） | 1 |
| 私たちは未来の花 | 1 |
| 秒針を噛む | 1 |
| 空のエメラルド | 33 |
| 空を飛んでみよう | 14 |
| 童話迷宮 | 1 |
| 第六感（相川奈央 Solo Cover） | 1 |
| 箱庭の世界 | 2 |
| 箱庭の世界（南伊織 Solo） | 1 |
| 紅蓮華 | 1 |
| 絶対零度（なとり） | 1 |
| 絶望の花 | 17 |
| 舌打ち | 10 |
| 舌打ち（北原実咲 Solo） | 1 |
| 花に亡霊（椎名桜月 Solo Cover） | 1 |
| 蝉は夏を知らない | 4 |
| 蝉は夏を知らない（初披露） | 1 |
| 覚醒 | 31 |
| 読みかけの漫画 | 16 |
| 謎の力 | 29 |
| 赤いバラの理由 | 3 |
| 赤いバラの理由（吉沢珠璃 Solo） | 1 |
| 足を洗え! | 4 |
| 足を洗え！ | 2 |
| 足跡（望月りの Solo Cover） | 1 |
| 踊り子（河瀬詩・椎名桜月） | 1 |
| 陽だまり計画書 | 2 |
| 雪だるまつくろう | 1 |
| 雷鳴のDelay | 10 |
| 韋駄天娘 | 89 |
| 願いの眼差し | 25 |
| 願いの眼差し（22/7_the 3rd） | 1 |
| 風は吹いてるか? | 2 |
| 風は吹いてるか？ | 37 |
| 風は吹いてるか？（22/7_the 3rd） | 2 |

## 特殊记录

- 2017 First Live 的 Character Live / Real Live 表列迁移为分段。
- 2018 割り切れないライブ的 Virtual / Real 两表属于同一 Show，按原顺序分段合并。
- 2020 LIVE 11 的小组曲、角色曲、下半场保留为 Section。
- 2021 ナナニジライブ的 Unit Song Medley 保留原名及位置为 Section，不设计嵌套模型。
- Encore、Double Encore、Encore 2 与原编号均保留；EN1 等保留为字符串，不自动重排。
- 两条曲目核实说明按原位置迁移为 Note（2025 Casino Party 大阪场的曲序待核实、Toybox Piece 3 的安可未记录），其余正文舞台说明继续保留。
- 所有非曲目表（朗读、角色公布、公演记录等）保留。普通资源链接及出处保留为正文链接或页面末尾 references；不请求媒体 URL。

## 全量逐表清单

下方每篇列出全部既有 Show ID、每张曲目表的映射与依据。源 SHA-256 与逐行迁移内容见相邻 audit.json，便于对照原提交核查。

### 2017/2017-ag-all-star

文件：src/content/live-events/2017/2017-ag-all-star.md

Shows：`show-2017-11-19-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L27 | 3 | show-2017-11-19-1 | 活动仅一场已记录 Show |

### 2017/2017-boku-wa-sonzai-shiteinakatta-release-event

文件：src/content/live-events/2017/2017-boku-wa-sonzai-shiteinakatta-release-event.md

Shows：`show-2017-09-21-1`, `show-2017-10-22-1`, `show-2017-11-05-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 9月21日 / L35 | 3 | show-2017-09-21-1 | 日期唯一对应 |
| 10月22日 / L43 | 3 | show-2017-10-22-1 | 日期唯一对应 |
| 11月5日 / L51 | 3 | show-2017-11-05-1 | 日期唯一对应 |

### 2017/2017-first-live-event

文件：src/content/live-events/2017/2017-first-live-event.md

Shows：`show-2017-07-22-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 3 | show-2017-07-22-1 | 活动仅一场已记录 Show |

### 2017/2017-special-christmas-event

文件：src/content/live-events/2017/2017-special-christmas-event.md

Shows：`show-2017-12-24-1`, `show-2017-12-24-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L45 | 3 | 待核实，原表保留 | 共用曲目表未注明第一场或第二场；确认两场的曲序后再分配。朗读表保留原文。 |

### 2018/2018-aj-night

文件：src/content/live-events/2018/2018-aj-night.md

Shows：`show-2018-03-24-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 3 | show-2018-03-24-1 | 活动仅一场已记录 Show |

### 2018/2018-anisama-ok-stage

文件：src/content/live-events/2018/2018-anisama-ok-stage.md

Shows：`show-2018-08-25-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 3 | show-2018-08-25-1 | 活动仅一场已记录 Show |

### 2018/2018-girls-power-live

文件：src/content/live-events/2018/2018-girls-power-live.md

Shows：`show-2018-05-23-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 3 | show-2018-05-23-1 | 活动仅一场已记录 Show |

### 2018/2018-jam-2018-day2

文件：src/content/live-events/2018/2018-jam-2018-day2.md

Shows：`show-2018-05-27-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 4 | show-2018-05-27-1 | 活动仅一场已记录 Show |

### 2018/2018-jam-live

文件：src/content/live-events/2018/2018-jam-live.md

Shows：`show-2018-10-27-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L24 | 5 | show-2018-10-27-1 | 活动仅一场已记录 Show |

### 2018/2018-keisanchu-special-event

文件：src/content/live-events/2018/2018-keisanchu-special-event.md

Shows：`show-2018-09-20-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L35 | 9 | show-2018-09-20-1 | 活动仅一场已记录 Show |

### 2018/2018-kyomaf

文件：src/content/live-events/2018/2018-kyomaf.md

Shows：`show-2018-09-16-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 6 | show-2018-09-16-1 | 活动仅一场已记录 Show |

### 2018/2018-live-monsters

文件：src/content/live-events/2018/2018-live-monsters.md

Shows：`show-2018-12-18-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 4 | show-2018-12-18-1 | 活动仅一场已记录 Show |

### 2018/2018-machiasobi-vol21

文件：src/content/live-events/2018/2018-machiasobi-vol21.md

Shows：`show-2018-10-07-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 4 | show-2018-10-07-1 | 活动仅一场已记录 Show |

### 2018/2018-odaiba-music-live

文件：src/content/live-events/2018/2018-odaiba-music-live.md

Shows：`show-2018-08-20-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 4 | show-2018-08-20-1 | 活动仅一场已记录 Show |

### 2018/2018-rikaisha-first-performance-free-live

文件：src/content/live-events/2018/2018-rikaisha-first-performance-free-live.md

Shows：`show-2018-07-22-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L27 | 3 | show-2018-07-22-1 | 活动仅一场已记录 Show |

### 2018/2018-rikaisha-release-vr-live

文件：src/content/live-events/2018/2018-rikaisha-release-vr-live.md

Shows：`show-2018-08-22-1`, `show-2018-08-25-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 8月22日 VR LIVE / L25 | 6 | show-2018-08-22-1 | 日期唯一对应 |
| 8月25日 Mini Live / L36 | 5 | show-2018-08-25-1 | 日期唯一对应 |

### 2018/2018-shampoo-release-events

文件：src/content/live-events/2018/2018-shampoo-release-events.md

Shows：`show-2018-04-13-1`, `show-2018-04-14-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L27 | 5 | 待核实，原表保留 | 正文记载三场，当前 Show 只有两个日期；共用表未注明场次。需核实 4/14 两部的独立日程与曲序。 |

### 2018/2018-warikirenai-live-shampoo

文件：src/content/live-events/2018/2018-warikirenai-live-shampoo.md

Shows：`show-2018-02-27-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| Virtual Live / L35 | 3 | show-2018-02-27-1 | 活动仅一场已记录 Show |
| Real Live / L43 | 5 | show-2018-02-27-1 | 活动仅一场已记录 Show |

### 2019/2019-afa-creators-super-fest-sally

文件：src/content/live-events/2019/2019-afa-creators-super-fest-sally.md

Shows：`show-2019-10-26-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 4 | show-2019-10-26-1 | 活动仅一场已记录 Show |

### 2019/2019-anime-broadcast-vr-live

文件：src/content/live-events/2019/2019-anime-broadcast-vr-live.md

Shows：`show-2019-12-07-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L31 | 5 | show-2019-12-07-1 | 活动仅一场已记录 Show |

### 2019/2019-animejapan

文件：src/content/live-events/2019/2019-animejapan.md

Shows：`show-2019-03-23-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 6 | show-2019-03-23-1 | 活动仅一场已记录 Show |

### 2019/2019-anniversary-live

文件：src/content/live-events/2019/2019-anniversary-live.md

Shows：`show-2019-09-20-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 19 | show-2019-09-20-1 | 活动仅一场已记录 Show |

### 2019/2019-birthday-event

文件：src/content/live-events/2019/2019-birthday-event.md

Shows：`show-2019-12-24-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L34 | 12 | show-2019-12-24-1 | 活动仅一场已记录 Show |

### 2019/2019-jam-expo-blueberry-stage

文件：src/content/live-events/2019/2019-jam-expo-blueberry-stage.md

Shows：`show-2019-08-25-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L24 | 4 | show-2019-08-25-1 | 活动仅一场已记录 Show |

### 2019/2019-kyomaf

文件：src/content/live-events/2019/2019-kyomaf.md

Shows：`show-2019-09-22-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 6 | show-2019-09-22-1 | 活动仅一场已记录 Show |

### 2019/2019-lisani-live-beijing

文件：src/content/live-events/2019/2019-lisani-live-beijing.md

Shows：`show-2019-11-09-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L24 | 5 | show-2019-11-09-1 | 活动仅一场已记录 Show |

### 2019/2019-nananiji-fes

文件：src/content/live-events/2019/2019-nananiji-fes.md

Shows：`show-2019-07-22-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L24 | 7 | show-2019-07-22-1 | 活动仅一场已记录 Show |

### 2019/2019-nananiji-live

文件：src/content/live-events/2019/2019-nananiji-live.md

Shows：`show-2019-01-22-1`, `show-2019-02-25-1`, `show-2019-03-27-1`, `show-2019-04-22-1`, `show-2019-05-22-1`, `show-2019-06-27-1`, `show-2019-07-31-1`, `show-2019-08-22-1`, `show-2019-09-30-1`, `show-2019-10-22-1`, `show-2019-11-27-1`, `show-2019-12-30-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 1 / L44 | 11 | show-2019-01-22-1 | 场次标签或会场完全一致 |
| 2 / L60 | 11 | show-2019-02-25-1 | 场次标签或会场完全一致 |
| 3 / L76 | 9 | show-2019-03-27-1 | 场次标签或会场完全一致 |
| 4 / L90 | 13 | show-2019-04-22-1 | 场次标签或会场完全一致 |
| 5 / L108 | 9 | show-2019-05-22-1 | 场次标签或会场完全一致 |
| 6 / L122 | 12 | show-2019-06-27-1 | 场次标签或会场完全一致 |
| 7 / L139 | 11 | show-2019-07-31-1 | 场次标签或会场完全一致 |
| 8 / L155 | 10 | show-2019-08-22-1 | 场次标签或会场完全一致 |
| 9 / L170 | 12 | show-2019-09-30-1 | 场次标签或会场完全一致 |
| 10 / L187 | 14 | show-2019-10-22-1 | 场次标签或会场完全一致 |
| 11 / L206 | 11 | show-2019-11-27-1 | 场次标签或会场完全一致 |
| 12 / L222 | 11 | show-2019-12-30-1 | 场次标签或会场完全一致 |

### 2019/2019-nani-mo-shiteagerarenai-release-event

文件：src/content/live-events/2019/2019-nani-mo-shiteagerarenai-release-event.md

Shows：`show-2019-08-24-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 6 | show-2019-08-24-1 | 活动仅一场已记录 Show |

### 2019/2019-rainbow-fes

文件：src/content/live-events/2019/2019-rainbow-fes.md

Shows：`show-2019-11-29-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 6 | show-2019-11-29-1 | 活动仅一场已记录 Show |

### 2019/2019-tokyo-idol-festival

文件：src/content/live-events/2019/2019-tokyo-idol-festival.md

Shows：`show-2019-08-03-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 4 | show-2019-08-03-1 | 活动仅一场已记录 Show |

### 2020/2020-anniversary-live

文件：src/content/live-events/2020/2020-anniversary-live.md

Shows：`show-2020-09-20-1`, `show-2020-09-20-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 昼场 / L46 | 17 | show-2020-09-20-1 | 场次标签或会场完全一致 |
| 夜场 / L67 | 17 | show-2020-09-20-2 | 场次标签或会场完全一致 |

### 2020/2020-jam-online-festival-purple-stage

文件：src/content/live-events/2020/2020-jam-online-festival-purple-stage.md

Shows：`show-2020-08-29-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L24 | 5 | show-2020-08-29-1 | 活动仅一场已记录 Show |

### 2020/2020-live-11

文件：src/content/live-events/2020/2020-live-11.md

Shows：`show-2020-11-13-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L45 | 29 | show-2020-11-13-1 | 活动仅一场已记录 Show |

### 2020/2020-muzui-release-special-live

文件：src/content/live-events/2020/2020-muzui-release-special-live.md

Shows：`show-2020-02-27-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L34 | 9 | show-2020-02-27-1 | 活动仅一场已记录 Show |

### 2020/2020-newyear-premium-party

文件：src/content/live-events/2020/2020-newyear-premium-party.md

Shows：`show-2020-01-03-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L24 | 6 | show-2020-01-03-1 | 活动仅一场已记录 Show |

### 2020/2020-tif-online

文件：src/content/live-events/2020/2020-tif-online.md

Shows：`show-2020-10-02-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L24 | 5 | show-2020-10-02-1 | 活动仅一场已记录 Show |

### 2021/2021-1st-album-release-tour

文件：src/content/live-events/2021/2021-1st-album-release-tour.md

Shows：`show-2021-07-11-1`, `show-2021-07-14-1`, `show-2021-07-15-1`, `show-2021-07-22-1`, `show-2021-07-22-2`

Tour 依据：正文“是22/7于2021年7月举办的巡演”。

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 羽田场 / L39 | 20 | show-2021-07-11-1 | 原文城市标题对应已记录会场 Zepp Haneda |
| 名古屋场 / L64 | 21 | show-2021-07-14-1 | 原文城市标题对应已记录会场 Zepp Nagoya |
| 大阪场 / L90 | 21 | show-2021-07-15-1 | 原文城市标题对应已记录会场 Zepp Namba |
| 东京昼场 / L116 | 21 | show-2021-07-22-1 | 场次标签或会场完全一致 |
| 东京夜场 / L142 | 21 | show-2021-07-22-2 | 场次标签或会场完全一致 |

### 2021/2021-5th-birthday-live-colors-of-flowers

文件：src/content/live-events/2021/2021-5th-birthday-live-colors-of-flowers.md

Shows：`show-2021-12-26-1`, `show-2021-12-26-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 第一部 / L33 | 10 | show-2021-12-26-1 | 日期与明确部次 / 标签一致 |
| 第二部 / L48 | 10 | show-2021-12-26-2 | 日期与明确部次 / 标签一致 |

### 2021/2021-anniversary-live

文件：src/content/live-events/2021/2021-anniversary-live.md

Shows：`show-2021-11-14-1`, `show-2021-11-14-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 昼场 / L31 | 27 | show-2021-11-14-1 | 场次标签或会场完全一致 |
| 夜场 / L63 | 26 | show-2021-11-14-2 | 场次标签或会场完全一致 |

### 2021/2021-anniversary-online

文件：src/content/live-events/2021/2021-anniversary-online.md

Shows：`show-2021-09-20-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 7 | show-2021-09-20-1 | 活动仅一场已记录 Show |

### 2021/2021-boku-ga-motteru-mono-nara-release-live

文件：src/content/live-events/2021/2021-boku-ga-motteru-mono-nara-release-live.md

Shows：`show-2021-02-28-1`, `show-2021-02-28-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 昼场 / L39 | 17 | show-2021-02-28-1 | 场次标签或会场完全一致 |
| 夜场 / L61 | 17 | show-2021-02-28-2 | 场次标签或会场完全一致 |

### 2021/2021-jam-expo-strawberry-stage

文件：src/content/live-events/2021/2021-jam-expo-strawberry-stage.md

Shows：`show-2021-08-28-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 5 | show-2021-08-28-1 | 活动仅一场已记录 Show |

### 2021/2021-mission-paradise

文件：src/content/live-events/2021/2021-mission-paradise.md

Shows：`show-2021-01-11-1`, `show-2021-01-11-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 昼场 / L29 | 15 | show-2021-01-11-1 | 日期与明确部次 / 标签一致 |
| 夜场 / L49 | 14 | show-2021-01-11-2 | 日期与明确部次 / 标签一致 |

### 2021/2021-nananiji-live

文件：src/content/live-events/2021/2021-nananiji-live.md

Shows：`show-2021-06-30-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L31 | 7 | show-2021-06-30-1 | 活动仅一场已记录 Show |

### 2021/2021-sony-music-animesongs-online

文件：src/content/live-events/2021/2021-sony-music-animesongs-online.md

Shows：`show-2021-01-03-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L31 | 2 | show-2021-01-03-1 | 活动仅一场已记录 Show |

### 2021/2021-tif

文件：src/content/live-events/2021/2021-tif.md

Shows：`show-2021-10-02-1`, `show-2021-10-02-2`, `show-2021-10-02-3`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| SMILE GARDEN / L21 | 3 | show-2021-10-02-1 | 场次标签或会场完全一致 |
| バーチャルTIF / L29 | 3 | show-2021-10-02-2 | 场次标签或会场完全一致 |
| DOLL FACTORY / L37 | 3 | show-2021-10-02-3 | 场次标签或会场完全一致 |

### 2022/2022-anniversary-live

文件：src/content/live-events/2022/2022-anniversary-live.md

Shows：`show-2022-10-22-1`, `show-2022-10-23-1`, `show-2022-10-23-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 10月22日 / L31 | 23 | show-2022-10-22-1 | 日期唯一对应 |
| 10月23日昼场 / L59 | 20 | show-2022-10-23-1 | 日期与明确部次 / 标签一致 |
| 10月23日夜场 / L84 | 20 | show-2022-10-23-2 | 日期与明确部次 / 标签一致 |

### 2022/2022-character-live-6th-birthday-party

文件：src/content/live-events/2022/2022-character-live-6th-birthday-party.md

Shows：`show-2022-12-24-1`, `show-2022-12-24-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 第一部 / L31 | 18 | show-2022-12-24-1 | 场次标签或会场完全一致 |
| 第二部 / L54 | 18 | show-2022-12-24-2 | 场次标签或会场完全一致 |

### 2022/2022-live-tour-14

文件：src/content/live-events/2022/2022-live-tour-14.md

Shows：`show-2022-03-10-1`, `show-2022-03-18-1`, `show-2022-03-19-1`, `show-2022-03-27-1`, `show-2022-03-27-2`, `show-2022-04-20-1`

Tour 依据：正文“以14人体制举办的首次巡演”。

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 神奈川场（FC限定） / L31 | 13 | show-2022-03-10-1 | 场次标签或会场完全一致 |
| 名古屋场 / L49 | 16 | show-2022-03-18-1 | 场次标签或会场完全一致 |
| 大阪场 / L70 | 16 | show-2022-03-19-1 | 场次标签或会场完全一致 |
| 东京昼场 / L91 | 16 | show-2022-03-27-1 | 场次标签或会场完全一致 |
| 东京夜场 / L112 | 16 | show-2022-03-27-2 | 场次标签或会场完全一致 |
| 追加公演 / L133 | 19 | show-2022-04-20-1 | 场次标签或会场完全一致 |

### 2022/2022-nananiji-natsumatsuri

文件：src/content/live-events/2022/2022-nananiji-natsumatsuri.md

Shows：`show-2022-07-15-1`, `show-2022-07-24-1`, `show-2022-07-24-2`, `show-2022-07-28-1`, `show-2022-07-29-1`, `show-2022-08-07-1`, `show-2022-08-11-1`, `show-2022-08-11-2`

Tour 依据：正文“是22/7于2022年夏季举办的巡演”。

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 神奈川场（FC限定） / L31 | 22 | show-2022-07-15-1 | 场次标签或会场完全一致 |
| 札幌昼场 / L58 | 18 | show-2022-07-24-1 | 场次标签或会场完全一致 |
| 札幌夜场 / L81 | 18 | show-2022-07-24-2 | 场次标签或会场完全一致 |
| 大阪场 / L104 | 18 | show-2022-07-28-1 | 场次标签或会场完全一致 |
| 福冈场 / L127 | 18 | show-2022-07-29-1 | 场次标签或会场完全一致 |
| 爱知场 / L150 | 18 | show-2022-08-07-1 | 场次标签或会场完全一致 |
| 神奈川昼场 / L173 | 18 | show-2022-08-11-1 | 场次标签或会场完全一致 |
| 神奈川夜场 / L196 | 18 | show-2022-08-11-2 | 场次标签或会场完全一致 |

### 2022/2022-summer-sonic

文件：src/content/live-events/2022/2022-summer-sonic.md

Shows：`show-2022-08-21-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L29 | 6 | show-2022-08-21-1 | 活动仅一场已记录 Show |

### 2022/2022-tif

文件：src/content/live-events/2022/2022-tif.md

Shows：`show-2022-08-05-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 4 | show-2022-08-05-1 | 活动仅一场已记录 Show |

### 2022/2022-year-end-thanksgiving

文件：src/content/live-events/2022/2022-year-end-thanksgiving.md

Shows：`show-2022-12-23-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| Part 1 / L31 | 8 | show-2022-12-23-1 | 活动仅一场已记录 Show |

### 2023/2023-52osaka-girls-castle

文件：src/content/live-events/2023/2023-52osaka-girls-castle.md

Shows：`show-2023-02-19-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 6 | show-2023-02-19-1 | 活动仅一场已记录 Show |

### 2023/2023-anniversary-live

文件：src/content/live-events/2023/2023-anniversary-live.md

Shows：`show-2023-11-07-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 20 | show-2023-11-07-1 | 活动仅一场已记录 Show |

### 2023/2023-characters-theater

文件：src/content/live-events/2023/2023-characters-theater.md

Shows：`show-2023-12-23-1`, `show-2023-12-23-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 第一部 / L38 | 10 | show-2023-12-23-1 | 场次标签或会场完全一致 |
| 第二部 / L53 | 10 | show-2023-12-23-2 | 场次标签或会场完全一致 |

### 2023/2023-cho-idol-fes

文件：src/content/live-events/2023/2023-cho-idol-fes.md

Shows：`show-2023-04-29-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 7 | show-2023-04-29-1 | 活动仅一场已记录 Show |

### 2023/2023-fang-music-fes-02

文件：src/content/live-events/2023/2023-fang-music-fes-02.md

Shows：`show-2023-09-18-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 6 | show-2023-09-18-1 | 活动仅一场已记录 Show |

### 2023/2023-giga-giga-sonic

文件：src/content/live-events/2023/2023-giga-giga-sonic.md

Shows：`show-2023-10-07-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 5 | show-2023-10-07-1 | 活动仅一场已记录 Show |

### 2023/2023-jam-expo

文件：src/content/live-events/2023/2023-jam-expo.md

Shows：`show-2023-08-27-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 5 | show-2023-08-27-1 | 活动仅一场已记录 Show |

### 2023/2023-kabukicho-up-gate

文件：src/content/live-events/2023/2023-kabukicho-up-gate.md

Shows：`show-2023-05-06-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 5 | show-2023-05-06-1 | 活动仅一场已记录 Show |

### 2023/2023-nananiji-live

文件：src/content/live-events/2023/2023-nananiji-live.md

Shows：`show-2023-01-16-1`, `show-2023-01-18-1`, `show-2023-04-03-1`, `show-2023-04-17-1`, `show-2023-05-08-1`, `show-2023-05-22-1`, `show-2023-06-12-1`, `show-2023-06-26-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 1月16日 / L44 | 12 | show-2023-01-16-1 | 日期唯一对应 |
| 1月18日 / L61 | 10 | show-2023-01-18-1 | 日期唯一对应 |
| 4月3日 / L76 | 9 | show-2023-04-03-1 | 日期唯一对应 |
| 4月17日 / L90 | 10 | show-2023-04-17-1 | 日期唯一对应 |
| 5月8日 / L105 | 10 | show-2023-05-08-1 | 日期唯一对应 |
| 5月22日 / L120 | 10 | show-2023-05-22-1 | 日期唯一对应 |
| 6月12日 / L135 | 10 | show-2023-06-12-1 | 日期唯一对应 |
| 6月26日 / L150 | 10 | show-2023-06-26-1 | 日期唯一对应 |

### 2023/2023-nananiji-natsumatsuri

文件：src/content/live-events/2023/2023-nananiji-natsumatsuri.md

Shows：`show-2023-07-05-1`, `show-2023-07-09-1`, `show-2023-07-16-1`, `show-2023-07-17-1`, `show-2023-07-22-1`, `show-2023-07-22-2`

Tour 依据：正文“是22/7于2023年夏季举办的巡演”。

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 神奈川场 / L33 | 17 | show-2023-07-05-1 | 原文城市标题对应已记录会场 KT Zepp Yokohama |
| 福冈场 / L55 | 17 | show-2023-07-09-1 | 原文城市标题对应已记录会场 Zepp Fukuoka |
| 大阪场 / L77 | 17 | show-2023-07-16-1 | 原文城市标题对应已记录会场 Zepp Namba (OSAKA) |
| 爱知场 / L99 | 17 | show-2023-07-17-1 | 原文城市标题对应已记录会场 Zepp Nagoya |
| 东京昼场 / L121 | 17 | show-2023-07-22-1 | 场次标签或会场完全一致 |
| 东京夜场 - 白沢かなえ卒業スペシャル / L143 | 17 | show-2023-07-22-2 | 日期与明确部次 / 标签一致 |

### 2023/2023-reina-miyase-graduation-concert

文件：src/content/live-events/2023/2023-reina-miyase-graduation-concert.md

Shows：`show-2023-05-25-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L29 | 20 | show-2023-05-25-1 | 活动仅一场已记录 Show |

### 2023/2023-spring-parade

文件：src/content/live-events/2023/2023-spring-parade.md

Shows：`show-2023-03-10-1`, `show-2023-03-11-1`, `show-2023-04-05-1`, `show-2023-04-09-1`, `show-2023-04-09-2`

Tour 依据：正文“是22/7于2023年春季举办的巡演”。

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 爱知场 / L31 | 19 | show-2023-03-10-1 | 原文城市标题对应已记录会场 Zepp Nagoya |
| 大阪场 / L55 | 19 | show-2023-03-11-1 | 原文城市标题对应已记录会场 Zepp Namba (OSAKA) |
| 福冈场 / L79 | 19 | show-2023-04-05-1 | 原文城市标题对应已记录会场 Zepp Fukuoka |
| 东京昼场 / L103 | 20 | show-2023-04-09-1 | 场次标签或会场完全一致 |
| 东京夜场 / L128 | 20 | show-2023-04-09-2 | 场次标签或会场完全一致 |

### 2023/2023-tif

文件：src/content/live-events/2023/2023-tif.md

Shows：`show-2023-08-06-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 4 | show-2023-08-06-1 | 活动仅一场已记录 Show |

### 2023/2023-tubeout-in-detroit

文件：src/content/live-events/2023/2023-tubeout-in-detroit.md

Shows：`show-2023-11-03-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L31 | 4 | show-2023-11-03-1 | 活动仅一场已记录 Show |

### 2024/2024-anniversary-live

文件：src/content/live-events/2024/2024-anniversary-live.md

Shows：`show-2024-11-09-1`, `show-2024-11-09-2`, `show-2024-11-10-1`, `show-2024-11-10-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 第一幕 - 気の抜けたサイダー / L31 | 18 | show-2024-11-09-1 | 日期与明确部次 / 标签一致 |
| 第二幕 - 晴れた日のベンチ / L54 | 18 | show-2024-11-09-2 | 日期与明确部次 / 标签一致 |
| 第三幕 - 蛍光灯再生計画 / L77 | 18 | show-2024-11-10-1 | 日期与明确部次 / 标签一致 |
| 千穐楽 - ナナニジ周年大音祭 / L100 | 18 | show-2024-11-10-2 | 日期与明确部次 / 标签一致 |

### 2024/2024-ato-de-wakaru-koto-release-event

文件：src/content/live-events/2024/2024-ato-de-wakaru-koto-release-event.md

Shows：`show-2024-04-21-1`, `show-2024-04-21-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 第一部 / L25 | 3 | show-2024-04-21-1 | 场次标签或会场完全一致 |
| 第二部 / L33 | 3 | show-2024-04-21-2 | 场次标签或会场完全一致 |

### 2024/2024-character-live-red-or-white

文件：src/content/live-events/2024/2024-character-live-red-or-white.md

Shows：`show-2024-12-28-1`, `show-2024-12-28-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 第一部 / L35 | 13 | show-2024-12-28-1 | 日期与明确部次 / 标签一致 |
| 第二部 / L53 | 13 | show-2024-12-28-2 | 日期与明确部次 / 标签一致 |

### 2024/2024-giga-giga-sonic

文件：src/content/live-events/2024/2024-giga-giga-sonic.md

Shows：`show-2024-10-19-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 6 | show-2024-10-19-1 | 活动仅一场已记录 Show |

### 2024/2024-hello-music-festival

文件：src/content/live-events/2024/2024-hello-music-festival.md

Shows：`show-2024-02-03-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 7 | show-2024-02-03-1 | 活动仅一场已记录 Show |

### 2024/2024-ilive-valentine

文件：src/content/live-events/2024/2024-ilive-valentine.md

Shows：`show-2024-02-12-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 5 | show-2024-02-12-1 | 活动仅一场已记录 Show |

### 2024/2024-moe-suzuhana-graduation-concert

文件：src/content/live-events/2024/2024-moe-suzuhana-graduation-concert.md

Shows：`show-2024-08-31-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L31 | 18 | show-2024-08-31-1 | 活动仅一场已记录 Show |

### 2024/2024-odaiba-bohkenoh-himawari-dream-stage

文件：src/content/live-events/2024/2024-odaiba-bohkenoh-himawari-dream-stage.md

Shows：`show-2024-08-06-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 3 | show-2024-08-06-1 | 活动仅一场已记录 Show |

### 2024/2024-spark-in-kawasaki

文件：src/content/live-events/2024/2024-spark-in-kawasaki.md

Shows：`show-2024-07-13-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 5 | show-2024-07-13-1 | 活动仅一场已记录 Show |

### 2024/2024-summer-live-magic-school-days

文件：src/content/live-events/2024/2024-summer-live-magic-school-days.md

Shows：`show-2024-07-22-1`, `show-2024-07-23-1`, `show-2024-07-24-1`, `show-2024-08-29-1`, `show-2024-08-30-1`, `show-2024-08-31-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 7月22日 / L33 | 16 | show-2024-07-22-1 | 日期唯一对应 |
| 7月23日 / L54 | 16 | show-2024-07-23-1 | 日期唯一对应 |
| 7月24日 / L75 | 16 | show-2024-07-24-1 | 日期唯一对应 |
| 8月29日 / L96 | 16 | show-2024-08-29-1 | 日期唯一对应 |
| 8月30日 / L117 | 16 | show-2024-08-30-1 | 日期唯一对应 |
| 8月31日 / L138 | 16 | show-2024-08-31-1 | 日期唯一对应 |

### 2024/2024-summer-station

文件：src/content/live-events/2024/2024-summer-station.md

Shows：`show-2024-08-18-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 8 | show-2024-08-18-1 | 活动仅一场已记录 Show |

### 2024/2024-tif

文件：src/content/live-events/2024/2024-tif.md

Shows：`show-2024-08-02-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 5 | show-2024-08-02-1 | 活动仅一场已记录 Show |

### 2024/2024-yes-to-no-no-aida-ni-release-event

文件：src/content/live-events/2024/2024-yes-to-no-no-aida-ni-release-event.md

Shows：`show-2024-10-12-1`, `show-2024-10-12-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 第一部 / L25 | 3 | show-2024-10-12-1 | 场次标签或会场完全一致 |
| 第二部 / L33 | 3 | show-2024-10-12-2 | 场次标签或会场完全一致 |

### 2025/2025-abc-yosou-release-events

文件：src/content/live-events/2025/2025-abc-yosou-release-events.md

Shows：`show-2025-11-08-1`, `show-2025-11-08-2`, `show-2025-11-15-1`, `show-2025-11-24-1`, `show-2025-11-24-2`, `show-2025-12-06-1`, `show-2025-12-09-1`, `show-2025-12-13-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 2025.11.08 橋本 / 第一部 / L18 | 3 | show-2025-11-08-1 | 日期与明确部次 / 标签一致 |
| 2025.11.08 橋本 / 第二部 / L26 | 3 | show-2025-11-08-2 | 日期与明确部次 / 标签一致 |
| 2025.11.15 天美 / L36 | 6 | show-2025-11-15-1 | 日期唯一对应 |
| 2025.11.24 天童 / 第一部 / L51 | 3 | show-2025-11-24-1 | 日期与明确部次 / 标签一致 |
| 2025.11.24 天童 / 第二部 / L59 | 3 | show-2025-11-24-2 | 日期与明确部次 / 标签一致 |
| 2025.12.06 豊洲 / L69 | 4 | show-2025-12-06-1 | 日期唯一对应 |
| 2025.12.09 越谷 / L80 | 4 | show-2025-12-09-1 | 日期唯一对应 |
| 2025.12.13 渋谷 / L91 | 5 | show-2025-12-13-1 | 日期唯一对应 |

### 2025/2025-anata-de-nakucha-release-events

文件：src/content/live-events/2025/2025-anata-de-nakucha-release-events.md

Shows：`show-2025-04-27-1`, `show-2025-04-27-2`, `show-2025-05-04-1`, `show-2025-06-07-1`, `show-2025-06-07-2`, `show-2025-06-15-1`, `show-2025-06-15-2`, `show-2025-06-21-1`, `show-2025-06-21-2`, `show-2025-07-15-1`, `show-2025-07-26-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 2025.04.27 土浦 / 第一部 / L18 | 3 | show-2025-04-27-1 | 日期与明确部次 / 标签一致 |
| 2025.04.27 土浦 / 第二部 / L26 | 3 | show-2025-04-27-2 | 日期与明确部次 / 标签一致 |
| 2025.05.04 柏 / L36 | 4 | show-2025-05-04-1 | 日期唯一对应 |
| 2025.06.07 幕張 / 第一部 / L49 | 3 | show-2025-06-07-1 | 日期与明确部次 / 标签一致 |
| 2025.06.07 幕張 / 第二部 / L57 | 3 | show-2025-06-07-2 | 日期与明确部次 / 标签一致 |
| 2025.06.15 天美 / 第一部 / L69 | 3 | show-2025-06-15-1 | 日期与明确部次 / 标签一致 |
| 2025.06.15 天美 / 第二部 / L77 | 3 | show-2025-06-15-2 | 日期与明确部次 / 标签一致 |
| 2025.06.21 天童 / 第一部 / L89 | 3 | show-2025-06-21-1 | 日期与明确部次 / 标签一致 |
| 2025.06.21 天童 / 第二部 / L97 | 3 | show-2025-06-21-2 | 日期与明确部次 / 标签一致 |
| 2025.07.15 越谷 / L107 | 4 | show-2025-07-15-1 | 日期唯一对应 |
| 2025.07.26 渋谷 / L118 | 5 | show-2025-07-26-1 | 日期唯一对应 |

### 2025/2025-anniversary-live

文件：src/content/live-events/2025/2025-anniversary-live.md

Shows：`show-2025-12-14-1`, `show-2025-12-14-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 昼场 / L25 | 19 | show-2025-12-14-1 | 场次标签或会场完全一致 |
| 夜场 / L49 | 19 | show-2025-12-14-2 | 场次标签或会场完全一致 |

### 2025/2025-country-live-nemuro

文件：src/content/live-events/2025/2025-country-live-nemuro.md

Shows：`show-2025-05-18-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L27 | 17 | show-2025-05-18-1 | 活动仅一场已记录 Show |

### 2025/2025-giga-giga-sonic-april

文件：src/content/live-events/2025/2025-giga-giga-sonic-april.md

Shows：`show-2025-04-08-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 6 | show-2025-04-08-1 | 活动仅一场已记录 Show |

### 2025/2025-giga-giga-sonic-october

文件：src/content/live-events/2025/2025-giga-giga-sonic-october.md

Shows：`show-2025-10-18-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 6 | show-2025-10-18-1 | 活动仅一场已记录 Show |

### 2025/2025-hype-vibe

文件：src/content/live-events/2025/2025-hype-vibe.md

Shows：`show-2025-10-13-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 5 | show-2025-10-13-1 | 活动仅一场已记录 Show |

### 2025/2025-nagomi-saijo-graduation-concert

文件：src/content/live-events/2025/2025-nagomi-saijo-graduation-concert.md

Shows：`show-2025-08-28-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 21 | show-2025-08-28-1 | 活动仅一场已记录 Show |

### 2025/2025-rock-wa-shinanai-release-event

文件：src/content/live-events/2025/2025-rock-wa-shinanai-release-event.md

Shows：`show-2025-02-26-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 4 | show-2025-02-26-1 | 活动仅一场已记录 Show |

### 2025/2025-spark-in-makuhari

文件：src/content/live-events/2025/2025-spark-in-makuhari.md

Shows：`show-2025-09-15-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 6 | show-2025-09-15-1 | 活动仅一场已记录 Show |

### 2025/2025-spring-tour-casino-party

文件：src/content/live-events/2025/2025-spring-tour-casino-party.md

Shows：`show-2025-03-02-1`, `show-2025-03-23-1`, `show-2025-03-27-1`, `show-2025-03-29-1`, `show-2025-03-29-2`

Tour 依据：正文“是22/7于2025年春季举办的巡演”。

Note：show-2025-03-02-1 / L31：目前公开记录可确认以下曲目；完整曲顺仍待更多资料核实。

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 大阪场 / L33 | 14 | show-2025-03-02-1 | 原文城市标题对应已记录会场 Zepp Namba (OSAKA) |
| 仙台场 / L52 | 17 | show-2025-03-23-1 | 原文城市标题对应已记录会场 SENDAI GIGS |
| 爱知场 / L74 | 20 | show-2025-03-27-1 | 原文城市标题对应已记录会场 Zepp Nagoya |
| 东京昼场 / L99 | 19 | show-2025-03-29-1 | 场次标签或会场完全一致 |
| 东京夜场 / L123 | 17 | show-2025-03-29-2 | 场次标签或会场完全一致 |

### 2025/2025-starrz-tokyo

文件：src/content/live-events/2025/2025-starrz-tokyo.md

Shows：`show-2025-09-23-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 4 | show-2025-09-23-1 | 活动仅一场已记录 Show |

### 2025/2025-summer-live-toybox

文件：src/content/live-events/2025/2025-summer-live-toybox.md

Shows：`show-2025-08-06-1`, `show-2025-08-07-1`, `show-2025-08-08-1`, `show-2025-08-09-1`, `show-2025-08-09-2`

Note：show-2025-08-08-1 / L95：Piece 3的安可曲目目前缺少可靠公开记录，暂不收录。

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| Piece 1 / L31 | 18 | show-2025-08-06-1 | 场次标签或会场完全一致 |
| Piece 2 / L54 | 18 | show-2025-08-07-1 | 场次标签或会场完全一致 |
| Piece 3 / L77 | 15 | show-2025-08-08-1 | 场次标签或会场完全一致 |
| Piece 4 / L99 | 18 | show-2025-08-09-1 | 场次标签或会场完全一致 |
| Last Piece / L122 | 18 | show-2025-08-09-2 | 场次标签或会场完全一致 |

### 2025/2025-tif

文件：src/content/live-events/2025/2025-tif.md

Shows：`show-2025-08-01-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 5 | show-2025-08-01-1 | 活动仅一场已记录 Show |

### 2025/2025-vocal-dance-collection-live-vol7

文件：src/content/live-events/2025/2025-vocal-dance-collection-live-vol7.md

Shows：`show-2025-05-06-1`, `show-2025-05-06-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 昼场 / L25 | 7 | show-2025-05-06-1 | 场次标签或会场完全一致 |
| 夜场 / L37 | 7 | show-2025-05-06-2 | 场次标签或会场完全一致 |

### 2026/2026-17th-single-release-event

文件：src/content/live-events/2026/2026-17th-single-release-event.md

Shows：`show-2026-08-22-1`, `show-2026-08-22-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 1部 / L27 | 3 | show-2026-08-22-1 | 场次标签或会场完全一致 |
| 2部 / L35 | 3 | show-2026-08-22-2 | 场次标签或会场完全一致 |

### 2026/2026-afa-indonesia

文件：src/content/live-events/2026/2026-afa-indonesia.md

Shows：`show-2026-08-15-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| MUSIC FEST / L25 | 4 | show-2026-08-15-1 | 活动仅一场已记录 Show |

### 2026/2026-afa-thailand

文件：src/content/live-events/2026/2026-afa-thailand.md

Shows：`show-2026-05-30-1`, `show-2026-05-31-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 5月30日 MUSIC FEST / L25 | 3 | show-2026-05-30-1 | 日期唯一对应 |
| 5月31日 AFA NEXT STAGE / L33 | 3 | show-2026-05-31-1 | 日期唯一对应 |

### 2026/2026-ai-fes

文件：src/content/live-events/2026/2026-ai-fes.md

Shows：`show-2026-04-25-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 9 | show-2026-04-25-1 | 活动仅一场已记录 Show |

### 2026/2026-anniversary-live

文件：src/content/live-events/2026/2026-anniversary-live.md

Shows：`show-2026-11-07-1`

原文无曲目表。

### 2026/2026-futatsu-no-michi-release-event

文件：src/content/live-events/2026/2026-futatsu-no-michi-release-event.md

Shows：`show-2026-01-25-1`, `show-2026-01-25-2`, `show-2026-03-14-1`, `show-2026-03-14-2`, `show-2026-04-22-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 1月25日 新利府 第一部 / L27 | 3 | show-2026-01-25-1 | 日期与明确部次 / 标签一致 |
| 1月25日 新利府 第二部 / L35 | 3 | show-2026-01-25-2 | 日期与明确部次 / 标签一致 |
| 3月14日 天童 第一部 / L43 | 3 | show-2026-03-14-1 | 日期与明确部次 / 标签一致 |
| 3月14日 天童 第二部 / L51 | 3 | show-2026-03-14-2 | 日期与明确部次 / 标签一致 |
| 4月22日 东京 / L59 | 5 | show-2026-04-22-1 | 日期唯一对应 |

### 2026/2026-giga-giga-sonic-august

文件：src/content/live-events/2026/2026-giga-giga-sonic-august.md

Shows：`show-2026-08-19-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 7 | show-2026-08-19-1 | 活动仅一场已记录 Show |

### 2026/2026-giga-giga-sonic-february

文件：src/content/live-events/2026/2026-giga-giga-sonic-february.md

Shows：`show-2026-02-03-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 5 | show-2026-02-03-1 | 活动仅一场已记录 Show |

### 2026/2026-hero-gate

文件：src/content/live-events/2026/2026-hero-gate.md

Shows：`show-2026-10-12-1`

原文无曲目表。

### 2026/2026-iconic-moments-fes

文件：src/content/live-events/2026/2026-iconic-moments-fes.md

Shows：`show-2026-05-10-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 5 | show-2026-05-10-1 | 活动仅一场已记录 Show |

### 2026/2026-idorise-festival

文件：src/content/live-events/2026/2026-idorise-festival.md

Shows：`show-2026-03-07-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L27 | 5 | show-2026-03-07-1 | 活动仅一场已记录 Show |

### 2026/2026-japan-festa

文件：src/content/live-events/2026/2026-japan-festa.md

Shows：`show-2026-02-23-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 18 | show-2026-02-23-1 | 活动仅一场已记录 Show |

### 2026/2026-legend-fes

文件：src/content/live-events/2026/2026-legend-fes.md

Shows：`show-2026-01-09-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 10 | show-2026-01-09-1 | 活动仅一场已记录 Show |

### 2026/2026-live-15

文件：src/content/live-events/2026/2026-live-15.md

Shows：`show-2026-04-04-1`, `show-2026-04-04-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| Day / L25 | 17 | show-2026-04-04-1 | 场次标签或会场完全一致 |
| Night / L47 | 17 | show-2026-04-04-2 | 场次标签或会场完全一致 |

### 2026/2026-live-fivesta

文件：src/content/live-events/2026/2026-live-fivesta.md

Shows：`show-2026-05-24-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L27 | 23 | show-2026-05-24-1 | 活动仅一场已记录 Show |

### 2026/2026-live-in-taipei

文件：src/content/live-events/2026/2026-live-in-taipei.md

Shows：`show-2026-07-25-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 7月24日 Fan Meeting / L27 | 3 | 待核实，原表保留 | 曲目表日期在现有 Show 中不存在；保留原表，需核实独立 Show 的日期和会场。 |
| 7月25日 Live / L35 | 17 | show-2026-07-25-1 | 日期唯一对应 |

### 2026/2026-nananiji-live

文件：src/content/live-events/2026/2026-nananiji-live.md

Shows：`show-2026-01-29-1`, `show-2026-01-30-1`, `show-2026-02-25-1`, `show-2026-02-26-1`, `show-2026-05-11-1`, `show-2026-05-12-1`, `show-2026-06-25-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 1月29日 / L33 | 10 | show-2026-01-29-1 | 日期唯一对应 |
| 1月30日 / L48 | 10 | show-2026-01-30-1 | 日期唯一对应 |
| 2月25日 / L63 | 12 | show-2026-02-25-1 | 日期唯一对应 |
| 2月26日 / L80 | 12 | show-2026-02-26-1 | 日期唯一对应 |
| 5月11日 / L97 | 14 | show-2026-05-11-1 | 日期唯一对应 |
| 5月12日 / L116 | 14 | show-2026-05-12-1 | 日期唯一对应 |
| Final / L135 | 20 | show-2026-06-25-1 | 场次标签或会场完全一致 |

### 2026/2026-odawara-daikassen

文件：src/content/live-events/2026/2026-odawara-daikassen.md

Shows：`show-2026-05-23-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 4 | show-2026-05-23-1 | 活动仅一场已记录 Show |

### 2026/2026-saitama-music-food-festival

文件：src/content/live-events/2026/2026-saitama-music-food-festival.md

Shows：`show-2026-08-08-1`, `show-2026-08-08-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 22/7_the 3rd / L25 | 6 | show-2026-08-08-1 | 场次标签或会场完全一致 |
| 22/7 / L36 | 6 | show-2026-08-08-2 | 场次标签或会场完全一致 |

### 2026/2026-shiga-idol-collection-premium

文件：src/content/live-events/2026/2026-shiga-idol-collection-premium.md

Shows：`show-2026-10-10-1`

原文无曲目表。

### 2026/2026-star-travelers

文件：src/content/live-events/2026/2026-star-travelers.md

Shows：`show-2026-02-07-1`, `show-2026-02-08-1`, `show-2026-02-14-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| Episode1／失われたホロスコープ / L27 | 9 | 待核实，原表保留 | Episode 曲目与 2/7、2/8、2/14 舞台见面会的对应关系未记录；不能按顺序猜测。 |
| Episode2／エメラルドの奇跡 / L41 | 8 | 待核实，原表保留 | Episode 曲目与 2/7、2/8、2/14 舞台见面会的对应关系未记录；不能按顺序猜测。 |

### 2026/2026-takaneko-fes-vol6

文件：src/content/live-events/2026/2026-takaneko-fes-vol6.md

Shows：`show-2026-07-12-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L25 | 10 | show-2026-07-12-1 | 活动仅一场已记录 Show |

### 2026/2026-tif

文件：src/content/live-events/2026/2026-tif.md

Shows：`show-2026-08-02-1`, `show-2026-08-02-2`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| SMILE GARDEN 22/7 / L36 | 7 | show-2026-08-02-1 | 场次标签或会场完全一致 |
| DOLL FACTORY 22/7_the 3rd / L48 | 5 | show-2026-08-02-2 | 场次标签或会场完全一致 |

### 2026/2026-yomiuriland-mini-live

文件：src/content/live-events/2026/2026-yomiuriland-mini-live.md

Shows：`show-2026-08-20-1`

| 原标题 / 行 | 行数 | Show | 依据 / 风险 |
| --- | ---: | --- | --- |
| 曲目 / L27 | 4 | show-2026-08-20-1 | 活动仅一场已记录 Show |

## 重跑与检查

`scripts/migrate-live-setlists.mjs` 默认只审计；批量写入需明确 `--write`，建议传入迁移前快照 `--source /absolute/path`。若目标既非原文也非本次确定输出，脚本拒绝覆盖。`--only year/slug` 可先试迁移；全量使用同一快照。不得把已迁移目录当原始输入。无网络请求、无媒体抓取。
