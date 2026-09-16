const categories = [
  { id: "武器", en: "WEAPONS", icon: "⚔" },
  { id: "特殊效果词条", en: "AFFIXES", icon: "✧" },
  { id: "装备", en: "EQUIPMENT", icon: "♜" },
  { id: "书籍", en: "BOOKS", icon: "▤" },
  { id: "法术", en: "SPELLS", icon: "☿" },
  { id: "祷告", en: "PRAYERS", icon: "☽" },
  { id: "道具", en: "ITEMS", icon: "♢" },
  { id: "战斗技巧", en: "TECHNIQUES", icon: "✹" },
  { id: "地图", en: "MAPS", icon: "⌖" },
  { id: "机制", en: "MECHANICS", icon: "⚙" },
  { id: "挑战", en: "CHALLENGES", icon: "⚑" }
];

const entries = [
  {"id":69,"category":"装备","name":"典狱长的皮革大衣","subtitle":"装备 · 新增资料","meta":"文档资料","tags":["装备"],"description":"基础数值：护甲3\n特殊效果：一次攻击伤害结果低于期望时，重roll这次伤害，一场战斗一次","updated":72},
  {"id":68,"category":"战斗技巧","name":"静观其变-预知","subtitle":"战斗技巧 · 新增资料","meta":"文档资料","tags":["战斗技巧"],"description":"消耗：一个回合\n触发条件：下一次应对行动时，改用对方技能点数的骰子进行判定","updated":71},
  {"id":67,"category":"战斗技巧","name":"静观其变","subtitle":"战斗技巧 · 新增资料","meta":"文档资料","tags":["战斗技巧"],"description":"消耗：一回合\n触发条件：下一次行动获得一个奖励骰","updated":70},
  {"id":66,"category":"特殊效果词条","name":"狂烈欲望","subtitle":"特殊效果词条 · 新增资料","meta":"文档资料","tags":["特殊效果词条"],"description":"触发条件：每回合伤害判定时触发，不会自然下降\n效果：每回合伤害骰低于狂烈欲望层数时，流失差值的生命","updated":69},
  {"id":65,"category":"武器","name":"狂噬","subtitle":"武器 · 新增资料","meta":"文档资料","tags":["武器"],"description":"伤害与基础规则：伤害12d10\n特殊效果：每次战斗轮一次,使用时自身获得疯狂，判定失败5次后结束疯狂。","updated":68},
  {"id":64,"category":"武器","name":"蚌埠","subtitle":"武器 · 新增资料","meta":"文档资料","tags":["武器"],"description":"伤害与基础规则：伤害：90-3d20\n特殊效果：共鸣：伤害变为90-3d10,伤害类型变为法伤，命中后吸收流失的生命","updated":67},
  {"id":63,"category":"武器","name":"冷素殇","subtitle":"武器 · 新增资料","meta":"文档资料","tags":["武器"],"description":"伤害与基础规则：伤害1d20，命中后叠3d3的冻伤和1d5的冻伤等级，然后立刻触发一次冻伤\n特殊效果：对方冻伤×冻伤等级超过150，命中效果额外触发一次即死","updated":66},
  {"id":62,"category":"战斗技巧","name":"斩铁剑","subtitle":"战斗技巧 · 新增资料","meta":"文档资料","tags":["战斗技巧"],"description":"触发条件：持续蓄力，每一轮次蓄力1d100，到达600～1000时，释放一次不可闪避的攻击，伤害为蓄力层数。如果蓄力未达到600被攻击，则改为强制拼刀，并且这次拼刀不造成伤害。","updated":65},
  {"id":61,"category":"机制","name":"自我丧失","subtitle":"机制 · 新增资料","meta":"文档资料","tags":["机制"],"description":"触发条件：持续生效\n核心规则：自身不会被施加仍和具有层数或者强度的正/反面buff与特殊效果","updated":63},
  {"id":60,"category":"特殊效果词条","name":"流血","subtitle":"特殊效果词条 · 新增资料","meta":"文档资料","tags":["特殊效果词条"],"description":"触发条件：当流血强度超过体质/5时\n效果：进行一次体质判定，如果判定失败则立即失去等同于流血强度的血量。判定成功则不受到伤害，下次判定时成功要求加一级。\n持续与层数：流血不会自然减少，只有当血爆后才会消除。","updated":61},
  {"id":59,"category":"机制","name":"快速追伤","subtitle":"机制 · 新增资料","meta":"使用双刀类武器","tags":["机制"],"description":"触发条件：双刀类武器命中的时候\n核心规则：再进行一次敏捷判定，若敏捷判定成功则本次伤害额外追加一次双刀武器的特殊附加伤害。","updated":59},
  {"id":58,"category":"机制","name":"挑飞","subtitle":"机制 · 新增资料","meta":"使用长枪命中敌人","tags":["机制"],"description":"触发条件：当使用长枪命中敌人时\n核心规则：目标体型与自身力量对抗，成功则对方下回合进入凌空状态，凌空状态下目标强行进入飞行状态或者本回合无法行动，下回合获得一次可以闪避/敏捷豁免的摔落伤害","updated":58},
  {"id":57,"category":"战斗技巧","name":"翻滚","subtitle":"战斗技巧 · 新增资料","meta":"使用后进行翻滚判定","tags":["战斗技巧"],"description":"消耗：每个人起初拥有（体力/30）次翻滚体力。每次翻滚消耗一次翻滚体力。消耗一整个动作不进行任何行动回复1体力。\n触发条件：使用时进行翻滚判定。\n技巧效果：判定成功则不用受到这个技能的任何伤害，但是，无法反击。\n限制与失败：若失败，则正常结算所受伤害","updated":57},
  {"id": 1, "category": "机制", "name": "狂暴", "subtitle": "机制 · 文档资料", "meta": "文档资料", "tags": ["机制"], "description": "进入狂暴状态下的敌人将改用1d5的骰子并且行动逻辑变为当前哪一招伤害最高使用哪一招", "updated": 56},
  {"id":2,"category":"机制","name":"加速的未来，折射的过去","subtitle":"机制 · 文档资料","meta":"文档资料","tags":["机制"],"description":"每当奥丁完成一次命运错位时，玩家获得一次加速未来或折射过去的机会。消耗机会可以使用（过去/当前）的判断结果来应对（当前/过去）同种类型的判断。如果选择折射过去，则回合会返回到过去对应的回合。\n\n案例：\n你用过去的判定躲现在就是他回到过去，你用现在的判定打过去，就是你回到过去","updated":62},
  {"id": 3, "category": "机制", "name": "体质不适-大出血", "subtitle": "机制 · 文档资料", "meta": "文档资料", "tags": ["机制"], "description": "自身失去所有体力并进入濒死状态，获得等同于体质的“出血量”槽。每次进行判定时流失等量“出血量”。出血量槽为0时，每次判定触发一次即死。", "updated": 54},
  {"id": 4, "category": "机制", "name": "沉默规则", "subtitle": "机制 · 文档资料", "meta": "文档资料", "tags": ["机制"], "description": "在沉默规则适用的区域，玩家的每一次行动失败/大失败都会增加“嘈杂值”当嘈杂值到达10时便会引来死寂魔", "updated": 53},
  {"id": 5, "category": "法术", "name": "真言术•静", "subtitle": "法术 · 文档资料", "meta": "文档资料", "tags": ["法术"], "description": "使用后连接者在不超过二十米的范围内可以不通过说话交流", "updated": 52},
  {"id": 6, "category": "战斗技巧", "name": "甩手", "subtitle": "战斗技巧 · 文档资料", "meta": "文档资料", "tags": ["战斗技巧"], "description": "消耗一个回合或者闪避成功的附赠动作，韧性伤害积累-1", "updated": 51},
  {"id": 7, "category": "战斗技巧", "name": "突进", "subtitle": "战斗技巧 · 文档资料", "meta": "文档资料", "tags": ["战斗技巧"], "description": "可以快速到目标面前，对失败的远程攻击进行反击或者硬挺反击", "updated": 50},
  {"id": 8, "category": "战斗技巧", "name": "强行反击", "subtitle": "战斗技巧 · 文档资料", "meta": "文档资料", "tags": ["战斗技巧"], "description": "受到全部的dot伤害与武器伤害，直接对目标进行一次攻击行动。受到的伤害优先结算", "updated": 49},
  {"id": 9, "category": "武器", "name": "明察", "subtitle": "武器 · 文档资料", "meta": "文档资料", "tags": ["武器"], "description": "7d10仅是用于拼刀规则 特殊效果： 呼吸法（明察■■）： 任何攻击判定成功且50＜时，下一轮自身获得一个额外回合。", "updated": 48},
  {"id": 10, "category": "机制", "name": "坠落", "subtitle": "机制 · 文档资料", "meta": "文档资料", "tags": ["机制"], "description": "即死/多次触发的即死", "updated": 47},
  {"id": 11, "category": "挑战", "name": "心中的惊鸣晓拂/丝琴净画", "subtitle": "挑战 · 文档资料", "meta": "文档资料", "tags": ["挑战"], "description": "文档中未提供额外说明。", "updated": 46},
  {"id": 12, "category": "机制", "name": "现实幻梦", "subtitle": "机制 · 文档资料", "meta": "文档资料", "tags": ["机制"], "description": "敌人的骰子结果不再公布，只会告诉你判定技能点数。你可以对结果进行质疑，质疑成功目标本次行动无效并且你获得附赠动作。质疑失败则额外失去1d6点生命上限。", "updated": 45},
  {"id": 13, "category": "机制", "name": "独立应战规则", "subtitle": "机制 · 文档资料", "meta": "文档资料", "tags": ["机制"], "description": "所有玩家或npc进入对战后，所有角色独自与目标开展。玩家对战期间可以选择一回合去申请援助，下回合对应队友会参与你的战斗一轮。援助后队友进入战斗劣势状态，直至玩家对敌人造成重创或敌人行动提供“援助机会”", "updated": 44},
  {"id": 14, "category": "地图", "name": "珐门的地图", "subtitle": "地图 · 文档资料", "meta": "文档资料", "tags": ["地图"], "description": "文档中未提供额外说明。", "updated": 43},
  {"id": 15, "category": "装备", "name": "人性猎人护具", "subtitle": "装备 · 文档资料", "meta": "文档资料", "tags": ["装备"], "description": "护甲：5 特殊效果：受到致命伤害时，锁1血，一条命一次", "updated": 42},
  {"id": 16, "category": "装备", "name": "定制护甲（巨兽）", "subtitle": "装备 · 文档资料", "meta": "文档资料", "tags": ["装备"], "description": "护甲14；次数护甲：1；愤怒：受到＞15点的伤害后下次攻击行动获得一个奖励骰", "updated": 41},
  {"id": 17, "category": "装备", "name": "奴隶项圈", "subtitle": "装备 · 文档资料", "meta": "文档资料", "tags": ["装备"], "description": "法术护甲5", "updated": 40},
  {"id": 18, "category": "机制", "name": "受击补偿", "subtitle": "机制 · 文档资料", "meta": "文档资料", "tags": ["机制"], "description": "造成伤害无法击穿目标护甲后，则造成1最终伤害", "updated": 39},
  {"id": 19, "category": "挑战", "name": "心中的君子六艺 心中的明蚀 心中的雷牢姆，科洛迪，苟三人组", "subtitle": "挑战 · 文档资料", "meta": "文档资料", "tags": ["挑战"], "description": "文档中未提供额外说明。", "updated": 38},
  {"id": 20, "category": "武器", "name": "锈刀血", "subtitle": "武器 · 文档资料", "meta": "文档资料", "tags": ["武器"], "description": "伤害2d12 成功追伤15流血or流血引爆 失败追伤5流血 对方触发流血dot时，角色回复dot/10的生命值 侵蚀状态 伤害变为流血施加 追伤变为施加15流血的同时引爆流血 额外增加每回合对自己施加10层流血 自身施加的流血不再触发流血", "updated": 37},
  {"id":21,"category":"武器","name":"伪·萝莉","subtitle":"武器 · 文档资料","meta":"文档资料","tags":["武器"],"description":"伤害3d10 使用拼刀规则时变为6d10 特殊效果： 1.该电：造成伤害后对目标施加1d20层带电，自己获得一半的带电 2.联通：自身每有一层带电，造成伤害额外+3 3.电极：自身不会因为带电而大失败 呼吸法（无） 侵蚀状态： 攻击前对自身施加1d10层带点。 你不再因为自身的带电点数增加。","updated":64},
  {"id": 22, "category": "特殊效果词条", "name": "超带电X", "subtitle": "特殊效果词条 · 文档资料", "meta": "文档资料", "tags": ["特殊效果词条"], "description": "每回合给予自身X层带电，回合结束时降低一层", "updated": 35},
  {"id": 23, "category": "特殊效果词条", "name": "带电X", "subtitle": "特殊效果词条 · 文档资料", "meta": "文档资料", "tags": ["特殊效果词条"], "description": "目标下一次判定骰子判定时，判定结果额外增加X点", "updated": 34},
  {"id": 24, "category": "挑战", "name": "心中的审判长 心中的冰蝶", "subtitle": "挑战 · 文档资料", "meta": "文档资料", "tags": ["挑战"], "description": "文档中未提供额外说明。", "updated": 33},
  {"id": 25, "category": "武器", "name": "锁刃", "subtitle": "武器 · 文档资料", "meta": "文档资料", "tags": ["武器"], "description": "伤害1d8 特殊效果： 1.穿甲：这把武器造成的伤害无视基础护甲。 2.锁定：这把武器命中后，消耗10mp，目标下一次判定投掷劣势1，切点数会被沿用到下下次", "updated": 32},
  {"id": 26, "category": "机制", "name": "不可避免的攻击", "subtitle": "机制 · 文档资料", "meta": "文档资料", "tags": ["机制"], "description": "此类攻击无法使用翻滚闪避，使用翻滚可能受到更多的伤害。；判定成功则不用受到这个技能的任何伤害，但是，无法反击。每个人起初拥有（体力/30）次翻滚体力。每次翻滚消耗一次翻滚体力。消耗一整个动作不进行任何行动回复1体力。", "updated": 31},
  {"id": 27, "category": "特殊效果词条", "name": "流血-永恒", "subtitle": "特殊效果词条 · 文档资料", "meta": "文档资料", "tags": ["特殊效果词条"], "description": "流血状态触发之后保留原来的流血层数", "updated": 30},
  {"id": 28, "category": "机制", "name": "傲慢之契", "subtitle": "机制 · 文档资料", "meta": "文档资料", "tags": ["机制"], "description": "任何判定成功，获得1层傲慢，你的接下来所有判定成功率+傲慢*5，至多成功率最多为90。判断失败，立刻损失傲慢*2的生命，并且傲慢清零", "updated": 29},
  {"id": 29, "category": "挑战", "name": "心中的黑王与白王", "subtitle": "挑战 · 文档资料", "meta": "文档资料", "tags": ["挑战"], "description": "文档中未提供额外说明。", "updated": 28},
  {"id": 30, "category": "武器", "name": "如烟", "subtitle": "武器 · 文档资料", "meta": "文档资料", "tags": ["武器"], "description": "伤害6d10，适用拼刀规则 不适用斗殴 特殊效果 往事：自身参与战斗时可选择跳过自己的回合 如烟：队友造成伤害时，若本轮自己没有造成伤害，立刻进行一个3d10伤害的追击。 呼吸法（吐息）：包括自己在内，选择一个友方角色获得一个奖励骰", "updated": 27},
  {"id": 31, "category": "武器", "name": "小只切", "subtitle": "武器 · 文档资料", "meta": "文档资料", "tags": ["武器"], "description": "伤害4d10 优先适配拼刀规则 拼刀成功施加1d6韧性伤害 特殊效果 呼吸法（洞穿）： 攻击困难成功时积累5点暴击率，暴击后清空积累", "updated": 26},
  {"id": 32, "category": "挑战", "name": "谢之遥 三条狗 三人组", "subtitle": "挑战 · 文档资料", "meta": "文档资料", "tags": ["挑战"], "description": "文档中未提供额外说明。", "updated": 25},
  {"id": 33, "category": "机制", "name": "群体对抗", "subtitle": "机制 · 文档资料", "meta": "文档资料", "tags": ["机制"], "description": "玩家现在进行。r3d6*5的群体均值创建，随后使用群体均值进行判定", "updated": 24},
  {"id": 34, "category": "特殊效果词条", "name": "冻伤", "subtitle": "特殊效果词条 · 文档资料", "meta": "文档资料", "tags": ["特殊效果词条"], "description": "每次行动受到（冻伤层数*冻伤强度）的伤害。可以选择消耗一次行动取暖来消除一层冻伤强度", "updated": 23},
  {"id": 35, "category": "战斗技巧", "name": "即刻，斩杀（1段）", "subtitle": "战斗技巧 · 文档资料", "meta": "文档资料", "tags": ["战斗技巧"], "description": "进行三次攻击判定 均成功后进行1d100判断 等于4时秒杀对手 （对部分敌人无效）", "updated": 22},
  {"id": 36, "category": "武器", "name": "科洛迪的法杖", "subtitle": "武器 · 文档资料", "meta": "文档资料", "tags": ["武器"], "description": "10d6+20法术加成 施放法术时改用rd95的骰子 需求智力：200 需求mp：90", "updated": 21},
  {"id": 37, "category": "特殊效果词条", "name": "烧伤/烫伤", "subtitle": "特殊效果词条 · 文档资料", "meta": "文档资料", "tags": ["特殊效果词条"], "description": "受到（烧伤等级*烫伤回合）的伤害和（烧伤等级*10）%的生命上限。然后烫伤回合-1，烧伤等级/2，向下取整", "updated": 20},
  {"id": 38, "category": "特殊效果词条", "name": "破裂X", "subtitle": "特殊效果词条 · 文档资料", "meta": "文档资料", "tags": ["特殊效果词条"], "description": "目标的护甲下降X,X不会自然下降", "updated": 19},
  {"id": 39, "category": "地图", "name": "尸体身上的地图", "subtitle": "地图 · 文档资料", "meta": "文档资料", "tags": ["地图"], "description": "文档中未提供额外说明。", "updated": 18},
  {"id": 40, "category": "挑战", "name": "心中的阿米诺斯 心中的苟 心中的科洛迪 希望王", "subtitle": "挑战 · 文档资料", "meta": "文档资料", "tags": ["挑战"], "description": "心中的典狱长挑战", "updated": 17},
  {"id": 41, "category": "特殊效果词条", "name": "暴击", "subtitle": "特殊效果词条 · 文档资料", "meta": "文档资料", "tags": ["特殊效果词条"], "description": "暴击规则适用的情况下，当你的技能判定低于暴击数值时，额外造成1.5倍伤害", "updated": 16},
  {"id": 42, "category": "机制", "name": "拼刀", "subtitle": "机制 · 文档资料", "meta": "文档资料", "tags": ["机制"], "description": "双反都进行攻击判定，投掷伤害，更具成功等级获得额外的1d10/2d10/3d10/5d10的拼刀伤害。伤害高者可以对对方施加武器提供的韧性扣除", "updated": 15},
  {"id": 43, "category": "书籍", "name": "《神祇录》", "subtitle": "书籍 · 文档资料", "meta": "文档资料", "tags": ["书籍"], "description": "大概意思是撕裂女神，连接这大地，是地皇最重要的女儿，她回应我们的诉求，让我们用伤口铭记每一寸土地 智慧女神，教导了人们知识的重要性，引导了人们在绝壁上建造了崖城，凝结了人类的智慧 死海之主，无记载，只是叙述中存在与死海 剑道，云初之城的剑道本身，也是他们最终的挑战 .龙神：掌握魔法的神祇，地皇最忠诚的手下。但是【黑框】 大恶魔：邪恶与混乱的化身，在斯诺兰德打开了恶魔之门，为世间带来了痛苦，他分化了大地，她玩弄了海洋，它吞噬了人心 霜月：斯诺兰德之月，教皇不允许任何对月光的文字记载 节日与庆典之女，带着人类铭记着一切日子，一切的欢乐，一切的进步，如同黄金一般，带给了信徒们璀璨//铅笔//也如同黄金时代一般逝去//铅笔// 伟大的太阳神谢之遥：你说得对，但是谢之遥就是最伟大的太阳神。你说你觉得不伟大？和我的99层烧伤和99层烫伤，每回合失去990的生命上限和99*99点血量说去吧。 静谧与安葬之子，他悲伤的蜷缩在静谧乡的墓穴中，承载着世上所有人的生死离别之痛", "updated": 14},
  {"id": 44, "category": "地图", "name": "受损的地图", "subtitle": "地图 · 文档资料", "meta": "文档资料", "tags": ["地图"], "description": "文档中未提供额外说明。", "updated": 13},
  {"id": 45, "category": "法术", "name": "魔法附魔", "subtitle": "法术 · 文档资料", "meta": "文档资料", "tags": ["法术"], "description": "智力判定，后消耗X点魔力，下一次攻击增加骰子数量*X点伤害（最多翻倍）", "updated": 12},
  {"id": 46, "category": "道具", "name": "狂化符文", "subtitle": "道具 · 文档资料", "meta": "文档资料", "tags": ["道具"], "description": "战斗时获得1d10伤害加成，造成伤害3次后失效", "updated": 11},
  {"id": 47, "category": "道具", "name": "坚韧符文", "subtitle": "道具 · 文档资料", "meta": "文档资料", "tags": ["道具"], "description": "护甲+20%", "updated": 10},
  {"id": 48, "category": "道具", "name": "闪光符文", "subtitle": "道具 · 文档资料", "meta": "文档资料", "tags": ["道具"], "description": "使用后会发出剧烈强光", "updated": 9},
  {"id": 49, "category": "道具", "name": "撤离用的烟雾弹", "subtitle": "道具 · 文档资料", "meta": "文档资料", "tags": ["道具"], "description": "使用后产生大量烟雾。目标侦察类与远程类攻击判定成功率减半", "updated": 8},
  {"id": 50, "category": "武器", "name": "仁之剑/义之剑", "subtitle": "武器 · 文档资料", "meta": "文档资料", "tags": ["武器"], "description": "伤害30-2d10，敏捷成功追伤10，", "updated": 7},
  {"id": 51, "category": "书籍", "name": "《暗影之诗篇》", "subtitle": "书籍 · 文档资料", "meta": "文档资料", "tags": ["书籍"], "description": "回吸取持有者的魔力，目前没有阅读", "updated": 6},
  {"id": 52, "category": "书籍", "name": "《舍吾皮肉，断吾胫骨》", "subtitle": "书籍 · 文档资料", "meta": "文档资料", "tags": ["书籍"], "description": "战斗技巧，伤害自己，引来神的关注。", "updated": 5},
  {"id": 53, "category": "书籍", "name": "《魔法基础导论》", "subtitle": "书籍 · 文档资料", "meta": "文档资料", "tags": ["书籍"], "description": "90天学习魔法如何使用", "updated": 4},
  {"id": 54, "category": "武器", "name": "撕裂教典", "subtitle": "武器 · 文档资料", "meta": "文档资料", "tags": ["武器"], "description": "伤害20，可作用于撕裂派系祷告", "updated": 3},
  {"id": 55, "category": "祷告", "name": "咒血剑", "subtitle": "祷告 · 文档资料", "meta": "文档资料", "tags": ["祷告"], "description": "失去1d8点生命武器伤害从3d6变为3d10并且附加5点流血dot积累", "updated": 2},
  {"id": 56, "category": "祷告", "name": "血斩波", "subtitle": "祷告 · 文档资料", "meta": "文档资料", "tags": ["祷告"], "description": "成功造成基础4d5,失败造成1d5伤害。并赋予等量流血", "updated": 1}
];

const state = { category: "全部", search: "", sort: "recent", visible: 8 };
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}
const categoryGrid = document.querySelector("[data-category-grid]");
const entryGrid = document.querySelector("[data-entry-grid]");
const resultCount = document.querySelector("[data-result-count]");
const resultsTitle = document.querySelector("[data-results-title]");
const emptyState = document.querySelector("[data-empty-state]");
const loadMore = document.querySelector("[data-load-more]");
const dialog = document.querySelector("[data-dialog]");
let toastTimer;

function renderCategories() {
  categoryGrid.innerHTML = [
    { id: "全部", en: "ALL ENTRIES", icon: "✦" },
    ...categories
  ].map((item) => `
    <button class="category-card ${state.category === item.id ? "active" : ""}" type="button" data-category="${item.id}">
      <span class="category-icon">${item.icon}</span>
      <strong>${item.id}</strong>
      <small>${item.en}</small>
    </button>
  `).join("");
}

function filteredEntries() {
  const query = state.search.trim().toLowerCase();
  const result = entries.filter((entry) => {
    const inCategory = state.category === "全部" || entry.category === state.category;
    const haystack = [entry.name, entry.category, entry.subtitle, ...entry.tags].join(" ").toLowerCase();
    return inCategory && (!query || haystack.includes(query));
  });
  return result.sort((a, b) => state.sort === "name" ? a.name.localeCompare(b.name, "zh") : b.updated - a.updated);
}

function renderEntries() {
  const result = filteredEntries();
  const visible = result.slice(0, state.visible);
  resultsTitle.textContent = state.category === "全部" ? "全部条目" : state.category;
  resultCount.textContent = `${result.length} 条记录`;
  entryGrid.innerHTML = visible.map((entry) => `
    <article class="entry-card" data-entry-id="${entry.id}" tabindex="0" role="button" aria-label="查看 ${escapeHTML(entry.name)}">
      <div class="entry-topline">
        <span class="entry-type">${escapeHTML(entry.category)} · ${escapeHTML(entry.subtitle.split("·")[1]?.trim() || "资料")}</span>
      </div>
      <h3>${escapeHTML(entry.name)}</h3>
      <p>${escapeHTML(entry.description)}</p>
      <div class="entry-footer"><span class="entry-meta">${escapeHTML(entry.meta)}</span><span class="entry-arrow">↗</span></div>
    </article>
  `).join("");
  emptyState.hidden = result.length > 0;
  loadMore.hidden = result.length <= state.visible;
}

function openEntry(id) {
  const entry = entries.find((item) => item.id === Number(id));
  if (!entry) return;
  document.querySelector("[data-dialog-category]").textContent = entry.category;
  document.querySelector("[data-dialog-title]").textContent = entry.name;
  document.querySelector("[data-dialog-subtitle]").textContent = entry.subtitle;
  document.querySelector("[data-dialog-meta]").innerHTML = `<span><strong>${escapeHTML(entry.meta)}</strong>基础效果</span>`;
  document.querySelector("[data-dialog-description]").textContent = entry.description;
  document.querySelector("[data-dialog-tags]").innerHTML = entry.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("");
  dialog.showModal();
}

function toast(message) {
  const region = document.querySelector("[data-toast-region]");
  region.textContent = message;
  region.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => region.classList.remove("show"), 2400);
}

categoryGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  state.visible = 8;
  renderCategories();
  renderEntries();
  document.querySelector("#compendium").scrollIntoView({ behavior: "smooth", block: "start" });
});

entryGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-entry-id]");
  if (card) openEntry(card.dataset.entryId);
});
entryGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-entry-id]");
  if (card) openEntry(card.dataset.entryId);
});
document.querySelector("[data-search]").addEventListener("input", (event) => {
  state.search = event.target.value;
  state.visible = 8;
  renderEntries();
});
document.querySelector("[data-sort]").addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderEntries();
});
loadMore.addEventListener("click", () => {
  state.visible += 4;
  renderEntries();
});
document.querySelector("[data-scroll-to]").addEventListener("click", () => document.querySelector("#compendium").scrollIntoView({ behavior: "smooth" }));
document.querySelector("[data-dialog-close]").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
document.querySelectorAll("[data-home]").forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }));
document.querySelectorAll("[data-toast]").forEach((button) => button.addEventListener("click", () => toast(button.dataset.toast)));
document.querySelector("[data-theme-toggle]").addEventListener("click", () => {
  document.body.classList.toggle("light-contrast");
  toast(document.body.classList.contains("light-contrast") ? "已切换至明亮阅读模式" : "已切换至羊皮纸阅读模式");
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.querySelector("[data-search]").focus();
  }
  if (event.key === "Escape" && dialog.open) dialog.close();
});

renderCategories();
renderEntries();
