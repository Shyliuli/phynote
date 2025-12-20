// Auto-generated from input/电磁学.md + input/新增笔记.txt and project/data/knowledge.json. DO NOT EDIT.
(function () {
  window.__EM_NOTES_SEED__ = {
  "source": "input/电磁学.md + input/新增笔记.txt",
  "course": "大学物理·电磁学",
  "totalPages": 73,
  "pages": [
    {
      "page": 1,
      "chapterId": "ch001",
      "chapterName": "静电场：从库仑定律到高斯定理",
      "knowledgePointId": "kp001",
      "knowledgePointName": "库仑定律与电场强度定义",
      "content": "# 电磁学期末复习：从电荷到麦克斯韦方程组的完整知识体系\n\n## 写在前面：这份笔记的核心思路\n\n电磁学看起来公式繁多，但实际上整个体系围绕着两条主线展开：**电场**和**磁场**。这两条线在静态情况下各自独立，但一旦涉及变化，它们就相互纠缠，最终统一在麦克斯韦方程组中。\n\n理解电磁学的关键不在于记住每个公式，而在于把握三个层次：**场的产生**（什么东西产生场）→ **场的描述**（如何定量刻画场）→ **场的效应**（场对其他物体做了什么）。掌握这个框架后，你会发现所有公式都是这个框架的具体填充。\n\n## 第一部分：静电场——从库仑定律到高斯定理\n\n### 一、电场强度的计算：三种方法论"
    },
    {
      "page": 2,
      "chapterId": "ch001",
      "chapterName": "静电场：从库仑定律到高斯定理",
      "knowledgePointId": "kp001",
      "knowledgePointName": "库仑定律与电场强度定义",
      "content": "**核心问题**：给定一个电荷分布，如何求空间中任意一点的电场强度？\n\n这个问题有三条路可走，选择哪条取决于电荷分布的特点。\n\n**方法一：离散电荷的叠加（库仑定律直接应用）**\n\n当电荷是一个个分立的点电荷时，电场强度直接由库仑定律给出。库仑定律描述的是两个点电荷之间的相互作用力：\n\n$$F = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q_1 q_2}{r^2}$$\n\n其中 $\\varepsilon_0 = 8.85 \\times 10^{-12}$ C²/(N·m²) 是真空介电常数。这个常数的存在本质上定义了电荷的单位与力学单位之间的换算关系。"
    },
    {
      "page": 3,
      "chapterId": "ch001",
      "chapterName": "静电场：从库仑定律到高斯定理",
      "knowledgePointId": "kp002",
      "knowledgePointName": "叠加原理与电场的矢量合成",
      "content": "电场强度定义为单位正电荷受到的力，所以单个点电荷 $q$ 在距离 $r$ 处产生的电场强度为：\n\n$$E = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q}{r^2}$$\n\n方向沿着连线，正电荷向外，负电荷向内。\n\n如果有多个点电荷，电场强度就是各个点电荷产生的电场的矢量叠加。这里\"矢量叠加\"四个字极为关键——你不能直接把大小加起来，必须分解成分量再相加。\n\n**方法二：连续分布电荷的积分**\n\n当电荷连续分布在导线、平面或体积中时，我们把它切成无穷多个无穷小的电荷元 $dq$，每个电荷元产生的电场为：\n\n$$dE = \\frac{1}{4\\pi\\varepsilon_0}\\frac{dq}{r^2}$$\n\n然后对整个电荷分布积分："
    },
    {
      "page": 4,
      "chapterId": "ch001",
      "chapterName": "静电场：从库仑定律到高斯定理",
      "knowledgePointId": "kp002",
      "knowledgePointName": "叠加原理与电场的矢量合成",
      "content": "$$E = \\int dE$$\n\n**关键技巧**：$dq$ 怎么表示？这取决于电荷如何分布。\n\n如果电荷分布在一条线上，线电荷密度为 $\\lambda$（单位长度的电荷量），则 $dq = \\lambda \\, dl$。\n\n如果电荷分布在一个面上，面电荷密度为 $\\sigma$（单位面积的电荷量），则 $dq = \\sigma \\, dS$。\n\n如果电荷分布在一个体积里，体电荷密度为 $\\rho$（单位体积的电荷量），则 $dq = \\rho \\, dV$。"
    },
    {
      "page": 5,
      "chapterId": "ch001",
      "chapterName": "静电场：从库仑定律到高斯定理",
      "knowledgePointId": "kp003",
      "knowledgePointName": "连续电荷分布与积分法（λ/σ/ρ）",
      "content": "**典型例题思路**：求一根长度为 $L$、总电荷为 $Q$ 的均匀带电直棒在其延长线上某点的电场。\n\n首先，线电荷密度 $\\lambda = Q/L$。取直棒上一小段 $dx$，它带电 $dq = \\lambda \\, dx = (Q/L) dx$。然后建立坐标系，写出这一小段到场点的距离，代入公式积分即可。\n\n**方法三：高斯定理——对称性的威力**\n\n当电荷分布具有高度对称性时，积分方法虽然可行，但往往繁琐。高斯定理提供了一条捷径。\n\n**高斯定理的表述**：通过任意闭合曲面的电通量等于该曲面内包围的总电荷除以 $\\varepsilon_0$。"
    },
    {
      "page": 6,
      "chapterId": "ch001",
      "chapterName": "静电场：从库仑定律到高斯定理",
      "knowledgePointId": "kp003",
      "knowledgePointName": "连续电荷分布与积分法（λ/σ/ρ）",
      "content": "$$\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{S} = \\frac{q_{内}}{\\varepsilon_0}$$\n\n这里需要先理解**电通量**的概念。通量描述的是\"穿过一个面的场线数目\"，更精确地说，是电场强度与面积的点积。如果电场垂直穿过平面，通量就是 $E \\cdot S$；如果电场与平面平行，通量为零；一般情况下是 $E \\cdot S \\cdot \\cos\\theta$，其中 $\\theta$ 是电场方向与面的法向之间的夹角。"
    },
    {
      "page": 7,
      "chapterId": "ch001",
      "chapterName": "静电场：从库仑定律到高斯定理",
      "knowledgePointId": "kp004",
      "knowledgePointName": "电通量与高斯定理",
      "content": "**为什么高斯定理有用？** 因为当电荷分布足够对称时，我们可以选取一个\"高斯面\"，使得：\n1. 电场在高斯面上处处大小相等\n2. 电场方向处处与高斯面垂直（或平行）\n\n这样一来，$\\oint \\vec{E} \\cdot d\\vec{S}$ 就可以从积分变成简单的乘法 $E \\cdot S_{有效}$，从而直接解出 $E$。\n\n**三种经典对称性及其高斯面选择**：\n\n**球对称**（点电荷、均匀带电球壳、均匀带电球体）：选取以电荷中心为圆心的同心球面作为高斯面。电场沿径向，处处垂直于球面，大小只依赖于距中心的距离。"
    },
    {
      "page": 8,
      "chapterId": "ch001",
      "chapterName": "静电场：从库仑定律到高斯定理",
      "knowledgePointId": "kp004",
      "knowledgePointName": "电通量与高斯定理",
      "content": "**柱对称**（无限长均匀带电直线、无限长均匀带电圆柱）：选取与直线同轴的圆柱面作为高斯面。电场沿径向向外，在圆柱侧面上处处垂直且大小相等；在上下底面上，电场与面平行，通量为零。\n\n**平面对称**（无限大均匀带电平面）：选取贯穿平面的\"药片盒\"（扁圆柱）作为高斯面。电场垂直于平面，只有上下两个端面有通量贡献，侧面通量为零。\n\n### 二、高斯定理的经典结论\n\n这些结论值得记忆，因为它们是后续分析复杂问题的基础构件。\n\n**无限大均匀带电平面**：电场强度在平面两侧处处相等，大小为"
    },
    {
      "page": 9,
      "chapterId": "ch001",
      "chapterName": "静电场：从库仑定律到高斯定理",
      "knowledgePointId": "kp005",
      "knowledgePointName": "对称性与高斯面选择（球/柱/平面）",
      "content": "$$E = \\frac{\\sigma}{2\\varepsilon_0}$$\n\n方向垂直于平面，正电荷向外，负电荷向内。\n\n**aha时刻**：为什么是 $2\\varepsilon_0$ 而不是 $\\varepsilon_0$？因为电场同时向两侧发出，高斯面的两个端面都有通量贡献，每侧分摊一半。\n\n**无限长均匀带电直线**（线电荷密度 $\\lambda$）：距直线 $r$ 处的电场强度为\n\n$$E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}$$\n\n方向沿径向。\n\n**有限长直线段**在其中垂面上某点的电场：如果直线段对该点所张的半角为 $\\theta_0$，则"
    },
    {
      "page": 10,
      "chapterId": "ch001",
      "chapterName": "静电场：从库仑定律到高斯定理",
      "knowledgePointId": "kp005",
      "knowledgePointName": "对称性与高斯面选择（球/柱/平面）",
      "content": "$$E = \\frac{\\lambda}{2\\pi\\varepsilon_0 x}\\sin\\theta_0$$\n\n当直线段无限长时，$\\theta_0 \\to 90°$，$\\sin\\theta_0 \\to 1$，回到无限长直线的结论。\n\n**均匀带电圆柱**（半径 $R$，线电荷密度 $\\lambda$）：\n\n在柱外（$r > R$）：$E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}$，与无限长带电直线相同——从外面看，电荷分布在半径为 $R$ 的柱面上还是集中在轴线上，效果一样。"
    },
    {
      "page": 11,
      "chapterId": "ch001",
      "chapterName": "静电场：从库仑定律到高斯定理",
      "knowledgePointId": "kp006",
      "knowledgePointName": "典型对称分布的电场结论（平面/直线/圆柱/球壳）",
      "content": "在柱内（$r < R$，假设电荷均匀分布在柱体体积内）：$E = \\frac{\\lambda r}{2\\pi\\varepsilon_0 R^2}$，电场与 $r$ 成正比。\n\n如果电荷只分布在柱面上（空心圆柱），柱内电场为零。\n\n**均匀带电球壳**（半径 $R$，总电荷 $Q$）：\n\n在壳外（$r > R$）：$E = \\frac{Q}{4\\pi\\varepsilon_0 r^2}$，与全部电荷集中在球心的点电荷等效。\n\n在壳内（$r < R$）：$E = 0$。\n\n**aha时刻**：球壳内部电场为零这个结论非常深刻。它意味着一个导体壳可以完美地屏蔽外部电场（静电屏蔽），这就是法拉第笼的原理。"
    },
    {
      "page": 12,
      "chapterId": "ch002",
      "chapterName": "电势：从矢量到标量的简化",
      "knowledgePointId": "kp007",
      "knowledgePointName": "电势与电势差（保守场与路径无关）",
      "content": "## 第二部分：电势——从矢量到标量的简化\n\n### 一、电势的定义与物理意义\n\n电场是矢量场，处理起来需要考虑方向，有时很繁琐。电势是一个标量场，用它可以大大简化许多问题。\n\n**电势的定义**：把单位正电荷从该点沿任意路径移动到电势零点（通常取无穷远）时，电场力所做的功。\n\n$$V = \\frac{W}{q_0} = \\int_P^{\\infty} \\vec{E} \\cdot d\\vec{l}$$\n\n或者更常见地写成从无穷远到该点的积分（负号翻转）：\n\n$$V = -\\int_{\\infty}^{P} \\vec{E} \\cdot d\\vec{l}$$\n\n**关键洞察**：电场做功与路径无关。这是因为静电场是保守场，电场力沿任意闭合路径做功为零："
    },
    {
      "page": 13,
      "chapterId": "ch002",
      "chapterName": "电势：从矢量到标量的简化",
      "knowledgePointId": "kp008",
      "knowledgePointName": "点电荷电势与叠加原理",
      "content": "$$\\oint \\vec{E} \\cdot d\\vec{l} = 0$$\n\n这个性质使得\"电势\"这个概念才有意义——如果做功依赖路径，我们就无法给每个点定义一个唯一的电势值。\n\n### 二、电势的三种计算方法\n\n**方法一：从点电荷出发（离散或连续）**\n\n单个点电荷 $q$ 在距离 $r$ 处产生的电势：\n\n$$V = \\frac{q}{4\\pi\\varepsilon_0 r}$$\n\n多个点电荷产生的电势是简单的代数相加（不是矢量叠加！这是电势相对于电场的巨大优势）。\n\n连续分布电荷的电势通过积分：\n\n$$V = \\int \\frac{dq}{4\\pi\\varepsilon_0 r}$$"
    },
    {
      "page": 14,
      "chapterId": "ch002",
      "chapterName": "电势：从矢量到标量的简化",
      "knowledgePointId": "kp009",
      "knowledgePointName": "连续分布电势积分与由电场求电势",
      "content": "**方法二：从已知电场积分**\n\n$$V = \\int_P^{\\infty} \\vec{E} \\cdot d\\vec{l}$$\n\n这种方法在知道电场分布（例如用高斯定理求出之后）时特别有用。\n\n**典型例题**：均匀带电球壳内部的电势。\n\n我们已经知道球壳内部 $E = 0$，外部 $E = \\frac{Q}{4\\pi\\varepsilon_0 r^2}$。\n\n对于壳内一点（$r < R$），电势计算要分段积分："
    },
    {
      "page": 15,
      "chapterId": "ch002",
      "chapterName": "电势：从矢量到标量的简化",
      "knowledgePointId": "kp009",
      "knowledgePointName": "连续分布电势积分与由电场求电势",
      "content": "$$V = \\int_r^R E_{内} \\, dr + \\int_R^{\\infty} E_{外} \\, dr = 0 + \\int_R^{\\infty} \\frac{Q}{4\\pi\\varepsilon_0 r^2} dr = \\frac{Q}{4\\pi\\varepsilon_0 R}$$"
    },
    {
      "page": 16,
      "chapterId": "ch002",
      "chapterName": "电势：从矢量到标量的简化",
      "knowledgePointId": "kp010",
      "knowledgePointName": "典型电势：球壳内外与等势区",
      "content": "**aha时刻**：球壳内部电场为零，但电势不为零！电势是常数（等于球壳表面的电势），这意味着内部是等势区。$E = 0$ 意味着电势不随位置变化，而不是电势为零。\n\n**球壳外部**的电势则与点电荷相同：\n\n$$V = \\frac{Q}{4\\pi\\varepsilon_0 r}$$\n\n**方法三：叠加原理**\n\n多个电荷源产生的总电势等于各个电荷源单独产生的电势之和。这比电场的矢量叠加简单得多，是电势方法的核心优势。\n\n### 三、电场与电势的关系\n\n电场是电势的负梯度：\n\n$$\\vec{E} = -\\nabla V$$\n\n用分量表示："
    },
    {
      "page": 17,
      "chapterId": "ch002",
      "chapterName": "电势：从矢量到标量的简化",
      "knowledgePointId": "kp010",
      "knowledgePointName": "典型电势：球壳内外与等势区",
      "content": "$$E_x = -\\frac{\\partial V}{\\partial x}, \\quad E_y = -\\frac{\\partial V}{\\partial y}, \\quad E_z = -\\frac{\\partial V}{\\partial z}$$"
    },
    {
      "page": 18,
      "chapterId": "ch002",
      "chapterName": "电势：从矢量到标量的简化",
      "knowledgePointId": "kp011",
      "knowledgePointName": "电场与电势关系：E = -∇V",
      "content": "**直观理解**：电场指向电势下降最快的方向。就像水往低处流，正电荷会从高电势区域向低电势区域运动。"
    },
    {
      "page": 19,
      "chapterId": "ch003",
      "chapterName": "导体与电介质：边界、屏蔽与极化",
      "knowledgePointId": "kp012",
      "knowledgePointName": "静电平衡与导体内部电场为零",
      "content": "## 第三部分：导体与电介质\n\n### 一、静电平衡下的导体\n\n**静电平衡的定义**：导体内部的自由电荷不再发生定向移动。\n\n这个定义立刻推出两个重要结论：\n\n**结论一：导体内部电场为零。**\n\n如果内部存在电场，自由电荷就会受力移动，与\"平衡\"矛盾。\n\n**结论二：电荷只分布在导体表面。**\n\n在导体内部取任意闭合高斯面，由于内部 $E = 0$，电通量为零，因此内部包围的净电荷为零。这意味着所有电荷都被\"推\"到了表面。\n\n**结论三：导体表面的电场垂直于表面。**\n\n如果电场有沿表面的分量，表面电荷就会沿表面滑动，直到这个分量消失。"
    },
    {
      "page": 20,
      "chapterId": "ch003",
      "chapterName": "导体与电介质：边界、屏蔽与极化",
      "knowledgePointId": "kp013",
      "knowledgePointName": "导体表面边界条件：电场垂直与E = σ/ε0",
      "content": "**结论四：导体表面的电场大小与面电荷密度的关系**\n\n$$E = \\frac{\\sigma}{\\varepsilon_0}$$\n\n注意这里是 $\\varepsilon_0$ 而不是 $2\\varepsilon_0$，因为导体表面的电场只向外发出，不像无限大平面那样两侧都有。\n\n**结论五：导体是等势体，导体表面是等势面。**\n\n由于内部 $E = 0$，沿任意路径移动电荷做功为零，因此处处电势相同。\n\n### 二、导体的静电屏蔽\n\n当一个导体壳包围一个区域时，壳内外的静电效应相互独立。"
    },
    {
      "page": 21,
      "chapterId": "ch003",
      "chapterName": "导体与电介质：边界、屏蔽与极化",
      "knowledgePointId": "kp014",
      "knowledgePointName": "导体等势与静电屏蔽（法拉第笼与接地）",
      "content": "**外部电场不影响内部**：即使外部存在强电场，导体壳内部仍然是 $E = 0$（只要壳是闭合的）。这就是法拉第笼原理。\n\n**内部电荷会影响外部**：如果壳内有电荷，壳的内表面会感应出等量异号电荷，外表面感应出等量同号电荷，外部空间仍能感受到内部电荷的存在。\n\n**但如果导体壳接地**，外表面的电荷会流向大地，此时内部电荷就被完全屏蔽了。\n\n### 三、经典问题：球壳中心有点电荷\n\n设一个内半径 $a$、外半径 $b$ 的导体球壳，中心有一个点电荷 $q$。\n\n**电荷分布**：内表面感应 $-q$，外表面感应 $+q$。"
    },
    {
      "page": 22,
      "chapterId": "ch003",
      "chapterName": "导体与电介质：边界、屏蔽与极化",
      "knowledgePointId": "kp015",
      "knowledgePointName": "导体球壳中心点电荷：感应电荷与分段电场",
      "content": "**电场分布**：\n- $r < a$：$E = \\frac{q}{4\\pi\\varepsilon_0 r^2}$\n- $a < r < b$（导体内部）：$E = 0$\n- $r > b$：$E = \\frac{q}{4\\pi\\varepsilon_0 r^2}$\n\n**电势分布**：采用分段积分。关键点在于导体内部 $E = 0$ 意味着导体整体电势等于其外表面的电势 $V = \\frac{q}{4\\pi\\varepsilon_0 b}$。\n\n### 四、电介质"
    },
    {
      "page": 23,
      "chapterId": "ch003",
      "chapterName": "导体与电介质：边界、屏蔽与极化",
      "knowledgePointId": "kp016",
      "knowledgePointName": "电介质极化与相对介电常数εr",
      "content": "电介质是不导电的材料（如塑料、玻璃、空气）。在电场中，电介质不会有自由电荷移动，但它的分子会被极化——正负电荷中心发生微小位移，产生电偶极矩。\n\n**极化的宏观效果**：在电介质内部，电场会变弱。\n\n**相对介电常数 $\\varepsilon_r$**：描述电介质对电场的削弱程度。真空中 $\\varepsilon_r = 1$，大多数绝缘材料 $\\varepsilon_r > 1$。\n\n在电介质中，电场强度变为：\n\n$$E = \\frac{E_0}{\\varepsilon_r}$$"
    },
    {
      "page": 24,
      "chapterId": "ch003",
      "chapterName": "导体与电介质：边界、屏蔽与极化",
      "knowledgePointId": "kp017",
      "knowledgePointName": "电位移矢量D与电介质高斯定理",
      "content": "其中 $E_0$ 是无电介质时的电场。\n\n**电位移矢量 D**：为了方便处理电介质问题，引入\n\n$$\\vec{D} = \\varepsilon_0 \\varepsilon_r \\vec{E}$$\n\n电介质中的高斯定理变为：\n\n$$\\oint \\vec{D} \\cdot d\\vec{S} = Q_{自由}$$\n\n$D$ 只与自由电荷有关，与极化电荷无关，这使得计算更简洁。"
    },
    {
      "page": 25,
      "chapterId": "ch004",
      "chapterName": "电容器与电场能量",
      "knowledgePointId": "kp018",
      "knowledgePointName": "电容与电容器电容的定义",
      "content": "## 第四部分：电容器与电场能量\n\n### 一、电容的定义与计算\n\n**电容**定义为导体存储电荷的能力：\n\n$$C = \\frac{Q}{V}$$\n\n其中 $Q$ 是导体上的电荷量，$V$ 是相对于零电势点的电势。\n\n对于电容器（两个导体构成的系统），电容定义为：\n\n$$C = \\frac{Q}{U}$$\n\n其中 $U$ 是两极板之间的电势差。\n\n**电容只取决于几何形状和材料，与电荷量和电压无关。**"
    },
    {
      "page": 26,
      "chapterId": "ch004",
      "chapterName": "电容器与电场能量",
      "knowledgePointId": "kp019",
      "knowledgePointName": "平行板电容器与填充介质",
      "content": "**平行板电容器**：两块面积为 $S$、相距 $d$ 的平行导体板\n\n$$C = \\frac{\\varepsilon_0 S}{d}$$\n\n如果中间填充相对介电常数为 $\\varepsilon_r$ 的电介质：\n\n$$C = \\frac{\\varepsilon_0 \\varepsilon_r S}{d}$$\n\n**aha时刻**：电介质增大电容。这是因为极化效应削弱了板间电场，相同电荷量下电压降低，因此 $C = Q/U$ 增大。"
    },
    {
      "page": 27,
      "chapterId": "ch004",
      "chapterName": "电容器与电场能量",
      "knowledgePointId": "kp020",
      "knowledgePointName": "电容器储能公式",
      "content": "### 二、电场能量\n\n电场储存能量。这个能量可以从两个角度理解：\n\n**从电容器角度**：给电容器充电需要做功，这些功转化为储存的电场能量。\n\n$$W = \\frac{1}{2}CU^2 = \\frac{1}{2}QU = \\frac{Q^2}{2C}$$\n\n**从电场角度**：能量储存在电场本身中，而非仅仅在导体上。定义**电场能量密度**：\n\n$$w_e = \\frac{1}{2}\\varepsilon_0 E^2$$"
    },
    {
      "page": 28,
      "chapterId": "ch004",
      "chapterName": "电容器与电场能量",
      "knowledgePointId": "kp021",
      "knowledgePointName": "电场能量密度与介质中的表达",
      "content": "在电介质中：\n\n$$w_e = \\frac{1}{2}\\varepsilon_0 \\varepsilon_r E^2 = \\frac{1}{2}DE$$\n\n总电场能量是能量密度在整个空间的积分：\n\n$$W = \\int_V w_e \\, dV$$"
    },
    {
      "page": 29,
      "chapterId": "ch005",
      "chapterName": "磁场：从电流到安培环路定理",
      "knowledgePointId": "kp022",
      "knowledgePointName": "毕奥-萨伐尔定律与磁场方向（右手定则）",
      "content": "## 第五部分：磁场——从电流到毕奥-萨伐尔定律\n\n### 一、磁场的产生\n\n电场由电荷产生，磁场由**运动电荷**（即电流）产生。\n\n**毕奥-萨伐尔定律**描述了电流元产生的磁场：\n\n$$d\\vec{B} = \\frac{\\mu_0}{4\\pi}\\frac{I d\\vec{l} \\times \\hat{r}}{r^2}$$\n\n其中 $\\mu_0 = 4\\pi \\times 10^{-7}$ T·m/A 是真空磁导率。\n\n**理解这个公式的关键**：\n\n1. $d\\vec{l}$ 是电流元的方向（沿电流流向）\n2. $\\hat{r}$ 是从电流元指向场点的单位矢量\n3. 叉乘意味着磁场方向垂直于 $d\\vec{l}$ 和 $\\hat{r}$ 构成的平面"
    },
    {
      "page": 30,
      "chapterId": "ch005",
      "chapterName": "磁场：从电流到安培环路定理",
      "knowledgePointId": "kp023",
      "knowledgePointName": "长直导线与有限直线段的磁场",
      "content": "**右手定则**：用右手握住导线，大拇指指向电流方向，四指环绕的方向就是磁场方向。\n\n### 二、经典电流分布的磁场\n\n**无限长直导线**（电流 $I$）在距离 $r$ 处产生的磁场：\n\n$$B = \\frac{\\mu_0 I}{2\\pi r}$$\n\n方向环绕导线。\n\n**圆形电流**（半径 $R$，电流 $I$）在圆心处的磁场：\n\n$$B = \\frac{\\mu_0 I}{2R}$$\n\n方向由右手定则确定：四指沿电流方向环绕，大拇指指向磁场方向。\n\n**圆形电流轴线上**距圆心 $x$ 处：\n\n$$B = \\frac{\\mu_0 I R^2}{2(R^2 + x^2)^{3/2}}$$"
    },
    {
      "page": 31,
      "chapterId": "ch005",
      "chapterName": "磁场：从电流到安培环路定理",
      "knowledgePointId": "kp024",
      "knowledgePointName": "圆形电流回路的磁场（圆心与轴线）",
      "content": "当 $x = 0$ 时回到圆心处的结论。\n\n**有限长直导线**在中垂面上某点（以直线段中点为原点，距离为 $r$，导线对该点的张角从 $\\theta_1$ 到 $\\theta_2$）：\n\n$$B = \\frac{\\mu_0 I}{4\\pi r}(\\cos\\theta_1 - \\cos\\theta_2)$$\n\n如果导线是一段从角度 $-\\theta_0$ 到 $+\\theta_0$ 的对称线段：\n\n$$B = \\frac{\\mu_0 I}{4\\pi r} \\cdot 2\\cos(90°-\\theta_0) = \\frac{\\mu_0 I}{2\\pi r}\\sin\\theta_0$$"
    },
    {
      "page": 32,
      "chapterId": "ch005",
      "chapterName": "磁场：从电流到安培环路定理",
      "knowledgePointId": "kp025",
      "knowledgePointName": "螺线管内部磁场近似（B=μ0 n I）",
      "content": "当导线无限长时，$\\theta_0 \\to 90°$，$\\sin\\theta_0 \\to 1$，回到无限长直导线的结论。\n\n**螺线管内部**（单位长度匝数 $n$，电流 $I$）：\n\n$$B = \\mu_0 n I$$\n\n磁场在螺线管内部近似均匀，方向沿轴线。\n\n### 三、安培环路定理\n\n类比电场的高斯定理，磁场有**安培环路定理**：\n\n$$\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{穿过}$$\n\n磁场沿任意闭合路径的线积分等于 $\\mu_0$ 乘以穿过该路径所围面积的电流代数和。"
    },
    {
      "page": 33,
      "chapterId": "ch005",
      "chapterName": "磁场：从电流到安培环路定理",
      "knowledgePointId": "kp026",
      "knowledgePointName": "安培环路定理及其应用条件",
      "content": "**与高斯定理的关键区别**：高斯定理是面积分，安培环路定理是线积分。这反映了电场和磁场的不同拓扑性质——电场有\"源\"（电荷），磁场没有\"源\"但有\"环流\"（电流）。"
    },
    {
      "page": 34,
      "chapterId": "ch006",
      "chapterName": "磁通量与磁场高斯定理",
      "knowledgePointId": "kp027",
      "knowledgePointName": "磁通量ΦB的定义与计算",
      "content": "## 第六部分：磁通量与磁场高斯定理\n\n### 一、磁通量的定义\n\n类比电通量，磁通量定义为磁场穿过某个面的\"数量\"：\n\n$$\\Phi_B = \\int \\vec{B} \\cdot d\\vec{S} = \\int B\\cos\\theta \\, dS$$"
    },
    {
      "page": 35,
      "chapterId": "ch006",
      "chapterName": "磁通量与磁场高斯定理",
      "knowledgePointId": "kp028",
      "knowledgePointName": "磁场的高斯定理：∮B·dS = 0",
      "content": "对于均匀磁场穿过平面：$\\Phi_B = BS\\cos\\theta$\n\n### 二、磁场的高斯定理\n\n$$\\oint \\vec{B} \\cdot d\\vec{S} = 0$$\n\n通过任意闭合曲面的磁通量恒为零。\n\n**深刻含义**：磁场没有\"源\"和\"汇\"。电场线可以从正电荷发出、终止于负电荷，但磁力线永远是闭合的——没有\"磁单极子\"。"
    },
    {
      "page": 36,
      "chapterId": "ch006",
      "chapterName": "磁通量与磁场高斯定理",
      "knowledgePointId": "kp029",
      "knowledgePointName": "磁力线闭合与无磁单极子的直观图像",
      "content": "这与安培环路定理相呼应：磁场的产生不是靠\"磁荷\"，而是靠电流（运动电荷）。"
    },
    {
      "page": 37,
      "chapterId": "ch007",
      "chapterName": "磁场对电流与运动电荷的作用",
      "knowledgePointId": "kp030",
      "knowledgePointName": "洛伦兹力：运动电荷受磁场力",
      "content": "## 第七部分：磁场对电流和运动电荷的作用\n\n### 一、洛伦兹力\n\n运动电荷在磁场中受力：\n\n$$\\vec{F} = q\\vec{v} \\times \\vec{B}$$\n\n大小：$F = qvB\\sin\\alpha$，其中 $\\alpha$ 是速度与磁场的夹角。\n\n方向：由右手定则确定（对于正电荷；负电荷反向）。\n\n**关键特性**：洛伦兹力永远垂直于速度方向，因此它不做功，只改变速度方向不改变速度大小。"
    },
    {
      "page": 38,
      "chapterId": "ch007",
      "chapterName": "磁场对电流与运动电荷的作用",
      "knowledgePointId": "kp031",
      "knowledgePointName": "匀强磁场中的圆周运动与回旋半径",
      "content": "**带电粒子在均匀磁场中的圆周运动**：\n\n当 $\\vec{v} \\perp \\vec{B}$ 时，洛伦兹力充当向心力：\n\n$$qvB = \\frac{mv^2}{R}$$\n\n解出回旋半径：\n\n$$R = \\frac{mv}{qB}$$\n\n这是质谱仪和粒子加速器的核心原理。\n\n### 二、安培力\n\n载流导线在磁场中受力。本质上是导线中大量运动电荷受洛伦兹力的宏观表现。"
    },
    {
      "page": 39,
      "chapterId": "ch007",
      "chapterName": "磁场对电流与运动电荷的作用",
      "knowledgePointId": "kp032",
      "knowledgePointName": "安培力：载流导线在磁场中的受力",
      "content": "$$d\\vec{F} = I d\\vec{l} \\times \\vec{B}$$\n\n对于直导线在均匀磁场中：\n\n$$F = BIL\\sin\\alpha$$\n\n方向由左手定则判断：磁场穿过手心，四指指向电流方向，大拇指指向受力方向。\n\n### 三、磁矩与磁力矩\n\n一个载流线圈可以用**磁矩**来描述：\n\n$$\\vec{p}_m = IS\\hat{n}$$"
    },
    {
      "page": 40,
      "chapterId": "ch007",
      "chapterName": "磁场对电流与运动电荷的作用",
      "knowledgePointId": "kp033",
      "knowledgePointName": "磁矩与线圈的磁力矩",
      "content": "其中 $S$ 是线圈面积，$\\hat{n}$ 是线圈法向（由右手定则从电流方向确定）。\n\n线圈在磁场中受到的力矩：\n\n$$\\vec{M} = \\vec{p}_m \\times \\vec{B}$$\n\n大小：$M = p_m B \\sin\\theta = ISB\\sin\\theta$\n\n这个力矩使线圈趋向于转动，直到磁矩与磁场平行（$\\theta = 0$，力矩消失）。"
    },
    {
      "page": 41,
      "chapterId": "ch007",
      "chapterName": "磁场对电流与运动电荷的作用",
      "knowledgePointId": "kp034",
      "knowledgePointName": "磁力矩做功与IΔΦB关系",
      "content": "**磁力矩做功**：\n\n$$W = I\\Delta\\Phi_B$$\n\n当线圈从某个角度转到另一个角度时，磁力矩做的功等于电流乘以磁通量的变化。"
    },
    {
      "page": 42,
      "chapterId": "ch008",
      "chapterName": "磁介质与磁场能量",
      "knowledgePointId": "kp035",
      "knowledgePointName": "磁场强度H与介质关系（B=μ0 μr H）",
      "content": "## 第八部分：磁介质与磁场能量\n\n### 一、磁介质中的安培环路定理\n\n类比电介质，磁介质会影响磁场。引入**磁场强度 H**：\n\n$$\\vec{H} = \\frac{\\vec{B}}{\\mu_0 \\mu_r}$$\n\n其中 $\\mu_r$ 是相对磁导率。"
    },
    {
      "page": 43,
      "chapterId": "ch008",
      "chapterName": "磁介质与磁场能量",
      "knowledgePointId": "kp036",
      "knowledgePointName": "磁介质中的安培环路定理（对H）",
      "content": "磁介质中的安培环路定理：\n\n$$\\oint \\vec{H} \\cdot d\\vec{l} = I_{自由}$$\n\n$H$ 只与自由电流（我们人为控制的电流）有关，与介质中的束缚电流无关。\n\n**三类磁性材料**：\n\n- **顺磁质**（$\\mu_r > 1$，但接近1）：如铝、氧气。磁场稍微增强。\n- **抗磁质**（$\\mu_r < 1$，但接近1）：如铜、水。磁场稍微减弱。\n- **铁磁质**（$\\mu_r >> 1$，可达数千）：如铁、钴、镍。磁场大幅增强。"
    },
    {
      "page": 44,
      "chapterId": "ch008",
      "chapterName": "磁介质与磁场能量",
      "knowledgePointId": "kp037",
      "knowledgePointName": "顺磁、抗磁与铁磁材料的磁响应",
      "content": "### 二、磁场能量\n\n类比电场能量，磁场也储存能量。\n\n**磁场能量密度**：\n\n$$w_m = \\frac{B^2}{2\\mu_0}$$\n\n在磁介质中："
    },
    {
      "page": 45,
      "chapterId": "ch008",
      "chapterName": "磁介质与磁场能量",
      "knowledgePointId": "kp038",
      "knowledgePointName": "磁场能量密度：B²/(2μ) 与 ½BH",
      "content": "$$w_m = \\frac{B^2}{2\\mu_0\\mu_r} = \\frac{1}{2}BH$$"
    },
    {
      "page": 46,
      "chapterId": "ch009",
      "chapterName": "电磁感应：变化带来耦合",
      "knowledgePointId": "kp039",
      "knowledgePointName": "法拉第电磁感应定律与楞次定律",
      "content": "## 第九部分：电磁感应——变化带来耦合\n\n### 一、法拉第电磁感应定律\n\n**核心内容**：穿过回路的磁通量发生变化时，回路中会产生感应电动势。\n\n$$\\varepsilon = -\\frac{d\\Phi_B}{dt}$$\n\n负号表示**楞次定律**：感应电流产生的磁场总是阻碍磁通量的变化。\n\n### 二、两种产生感应电动势的方式"
    },
    {
      "page": 47,
      "chapterId": "ch009",
      "chapterName": "电磁感应：变化带来耦合",
      "knowledgePointId": "kp040",
      "knowledgePointName": "感生电动势与感生电场（变磁生电）",
      "content": "**感生电动势**：磁场随时间变化，导体不动。\n\n变化的磁场在空间中激发出电场（感生电场），这个电场驱动电子运动。\n\n$$\\varepsilon_{感生} = \\oint \\vec{E}_{感生} \\cdot d\\vec{l} = -\\int \\frac{\\partial \\vec{B}}{\\partial t} \\cdot d\\vec{S}$$"
    },
    {
      "page": 48,
      "chapterId": "ch009",
      "chapterName": "电磁感应：变化带来耦合",
      "knowledgePointId": "kp041",
      "knowledgePointName": "动生电动势（切割磁力线）",
      "content": "**动生电动势**：磁场不变，导体运动切割磁力线。\n\n导体中的电子随导体运动，在磁场中受洛伦兹力，这个力扮演了\"非静电力\"的角色。\n\n$$\\varepsilon_{动生} = \\int (\\vec{v} \\times \\vec{B}) \\cdot d\\vec{l} = BLv$$\n\n（对于长度 $L$ 的导体棒以速度 $v$ 垂直切割磁场）"
    },
    {
      "page": 49,
      "chapterId": "ch009",
      "chapterName": "电磁感应：变化带来耦合",
      "knowledgePointId": "kp042",
      "knowledgePointName": "自感：自感电动势阻碍电流变化",
      "content": "### 三、自感与互感\n\n**自感**：回路中电流变化时，自身磁通量也变化，从而产生感应电动势，阻碍电流的变化。\n\n$$\\varepsilon_L = -L\\frac{dI}{dt}$$\n\n自感系数 $L$ 只取决于回路的几何形状和周围介质：\n\n$$L = \\frac{\\Phi_B}{I}$$\n\n单位：亨利（H）。\n\n**互感**：两个回路靠近时，一个回路中电流变化会在另一个回路中产生感应电动势。"
    },
    {
      "page": 50,
      "chapterId": "ch009",
      "chapterName": "电磁感应：变化带来耦合",
      "knowledgePointId": "kp043",
      "knowledgePointName": "互感：两个回路的磁耦合与互感系数M",
      "content": "$$M = \\frac{\\Phi_{12}}{I_1} = \\frac{\\Phi_{21}}{I_2}$$\n\n互感系数是对称的。"
    },
    {
      "page": 51,
      "chapterId": "ch010",
      "chapterName": "麦克斯韦方程组：电磁学的统一",
      "knowledgePointId": "kp044",
      "knowledgePointName": "麦克斯韦方程组四个积分形式总览",
      "content": "## 第十部分：麦克斯韦方程组——电磁学的统一\n\n### 一、四个方程的内容与意义\n\n**方程一：电场的高斯定理**\n\n$$\\oint \\vec{D} \\cdot d\\vec{S} = \\int_V \\rho \\, dV$$\n\n电荷是电场的源。电场线从正电荷发出，终止于负电荷。\n\n**方程二：磁场的高斯定理**\n\n$$\\oint \\vec{B} \\cdot d\\vec{S} = 0$$\n\n磁场没有源。磁力线永远闭合，不存在磁单极子。\n\n**方程三：法拉第定律**\n\n$$\\oint \\vec{E} \\cdot d\\vec{l} = -\\int \\frac{\\partial \\vec{B}}{\\partial t} \\cdot d\\vec{S}$$"
    },
    {
      "page": 52,
      "chapterId": "ch010",
      "chapterName": "麦克斯韦方程组：电磁学的统一",
      "knowledgePointId": "kp044",
      "knowledgePointName": "麦克斯韦方程组四个积分形式总览",
      "content": "变化的磁场产生电场。这是发电机的原理。\n\n**方程四：安培-麦克斯韦定律**\n\n$$\\oint \\vec{H} \\cdot d\\vec{l} = \\int \\vec{j} \\cdot d\\vec{S} + \\int \\frac{\\partial \\vec{D}}{\\partial t} \\cdot d\\vec{S}$$"
    },
    {
      "page": 53,
      "chapterId": "ch010",
      "chapterName": "麦克斯韦方程组：电磁学的统一",
      "knowledgePointId": "kp045",
      "knowledgePointName": "位移电流与安培-麦克斯韦定律",
      "content": "电流和变化的电场都会产生磁场。其中 $\\frac{\\partial \\vec{D}}{\\partial t}$ 称为**位移电流**，是麦克斯韦的核心贡献。\n\n### 二、四个方程的对称性与不对称性\n\n方程一和方程二的对比揭示了电与磁的不对称：电荷存在，磁单极子不存在。\n\n方程三和方程四则展现了美妙的对称：变化的磁场产生电场，变化的电场产生磁场。\n\n这种相互激发使得电磁场可以脱离电荷和电流而独立传播——这就是**电磁波**。\n\n### 三、历史意义\n\n麦克斯韦方程组的建立（1865年）是物理学史上最伟大的综合之一。它将电学、磁学、光学统一为电磁学，并预言了电磁波的存在。赫兹在1887年的实验验证了这一预言，为无线电通信铺平了道路。"
    },
    {
      "page": 54,
      "chapterId": "ch010",
      "chapterName": "麦克斯韦方程组：电磁学的统一",
      "knowledgePointId": "kp045",
      "knowledgePointName": "位移电流与安培-麦克斯韦定律",
      "content": "更深远地，麦克斯韦方程组与牛顿力学的不相容最终导致了爱因斯坦的狭义相对论——电磁学是通向现代物理的必经之路。"
    },
    {
      "page": 55,
      "chapterId": "ch010",
      "chapterName": "麦克斯韦方程组：电磁学的统一",
      "knowledgePointId": "kp046",
      "knowledgePointName": "电磁对称性：变化B产生旋涡E，变化E产生旋涡B",
      "content": "## 知识点之间的深层联系\n\n### 电场与磁场的对比\n\n| 方面 | 电场 | 磁场 |\n|------|------|------|\n| 产生源 | 电荷 | 电流（运动电荷） |\n| 场强单位 | N/C 或 V/m | T（特斯拉） |\n| 基本定律 | 库仑定律 | 毕奥-萨伐尔定律 |\n| 积分定理 | 高斯定理（面积分） | 安培环路定理（线积分） |\n| 通量守恒 | 通量=电荷量/ε₀ | 通量恒为零 |\n| 对静止电荷的力 | 有 | 无 |\n| 对运动电荷的力 | 有 | 有（洛伦兹力） |\n\n### 三个\"高斯定理\"的辨析"
    },
    {
      "page": 56,
      "chapterId": "ch010",
      "chapterName": "麦克斯韦方程组：电磁学的统一",
      "knowledgePointId": "kp046",
      "knowledgePointName": "电磁对称性：变化B产生旋涡E，变化E产生旋涡B",
      "content": "1. **电场高斯定理**：$\\oint \\vec{E} \\cdot d\\vec{S} = q/\\varepsilon_0$，描述电场的\"源\"是电荷\n2. **磁场高斯定理**：$\\oint \\vec{B} \\cdot d\\vec{S} = 0$，描述磁场无源\n3. **安培环路定理**（可看作磁场的\"另一种高斯定理\"）：$\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I$，描述电流产生磁场"
    },
    {
      "page": 57,
      "chapterId": "ch010",
      "chapterName": "麦克斯韦方程组：电磁学的统一",
      "knowledgePointId": "kp047",
      "knowledgePointName": "电磁波：自洽传播的电磁场",
      "content": "### 能量储存的统一视角\n\n电场和磁场都能储存能量，能量密度分别为：\n\n$$w_e = \\frac{1}{2}\\varepsilon_0 E^2, \\quad w_m = \\frac{1}{2}\\frac{B^2}{\\mu_0}$$\n\n在电磁波中，电场能量和磁场能量密度相等，共同构成电磁能量的传播。\n\n## 解题方法论总结\n\n**遇到\"求电场\"的题目**：\n1. 先看对称性，能用高斯定理就用\n2. 没有对称性就老老实实用库仑定律/积分\n3. 有时可以先求电势再取负梯度\n\n**遇到\"求磁场\"的题目**：\n1. 先看对称性，能用安培环路定理就用\n2. 没有对称性就用毕奥-萨伐尔定律积分\n3. 记住几个经典结论（无限长直导线、圆环圆心、螺线管）"
    },
    {
      "page": 58,
      "chapterId": "ch010",
      "chapterName": "麦克斯韦方程组：电磁学的统一",
      "knowledgePointId": "kp047",
      "knowledgePointName": "电磁波：自洽传播的电磁场",
      "content": "**遇到导体问题**：\n1. 导体内部 E=0，这是核心\n2. 电荷分布在表面\n3. 导体是等势体"
    },
    {
      "page": 59,
      "chapterId": "ch010",
      "chapterName": "麦克斯韦方程组：电磁学的统一",
      "knowledgePointId": "kp048",
      "knowledgePointName": "统一与历史意义：从电磁学到相对论",
      "content": "**遇到电磁感应问题**：\n1. 先判断是感生还是动生\n2. 用法拉第定律 $\\varepsilon = -d\\Phi/dt$\n3. 注意楞次定律判断方向\n\n# 物理笔记整理：相对论与量子物理"
    },
    {
      "page": 60,
      "chapterId": "ch011",
      "chapterName": "相对论：洛伦兹变换与时空效应",
      "knowledgePointId": "kp049",
      "knowledgePointName": "洛伦兹变换与逆变换",
      "content": "## 一、相对论\n\n### 1. 洛伦兹变换\n\n光速不变原理：光在真空中总以确定速度 $c$ 传播。\n设 $S'$ 系相对 $S$ 系在 $x$ 轴速度为 $v$，则有：\n$$x' = \\gamma(x - vt), \\quad t' = \\gamma(t - \\frac{v}{c^2}x)$$\n其中 $\\gamma = \\frac{1}{\\sqrt{1 - \\frac{v^2}{c^2}}}$"
    },
    {
      "page": 61,
      "chapterId": "ch011",
      "chapterName": "相对论：洛伦兹变换与时空效应",
      "knowledgePointId": "kp049",
      "knowledgePointName": "洛伦兹变换与逆变换",
      "content": "**逆变换：**\n$$x = \\gamma(x' + vt'), \\quad t = \\gamma(t' + \\frac{v}{c^2}x')$$\n记忆技巧：不带“撇”的换带“撇”的，带“撇”的换不带“撇”的，$v$ 取 $-v$。相当于把 $S$ 系和 $S'$ 系换个名。"
    },
    {
      "page": 62,
      "chapterId": "ch011",
      "chapterName": "相对论：洛伦兹变换与时空效应",
      "knowledgePointId": "kp050",
      "knowledgePointName": "动尺收缩与动钟变慢",
      "content": "**增量形式：**\n$$\\Delta x' = \\gamma(\\Delta x - v\\Delta t), \\quad \\Delta t' = \\gamma(\\Delta t - \\frac{v}{c^2}\\Delta x)$$\n已知 $\\Delta x, \\Delta t, \\Delta x', \\Delta t', v$ 五个量中的三个，可求其余两个。\n\n### 2. 时空观\n\n*   **动尺收缩：** $L = \\frac{L_0}{\\gamma}$\n*   **动钟变慢：** $\\Delta t = \\gamma \\Delta t_0$\n*   **质量变大：** $m = \\gamma m_0$"
    },
    {
      "page": 63,
      "chapterId": "ch011",
      "chapterName": "相对论：洛伦兹变换与时空效应",
      "knowledgePointId": "kp051",
      "knowledgePointName": "相对论能量与动量关系",
      "content": "### 3. 相对论能量\n\n*   **总能量：** $E = mc^2 = \\gamma m_0 c^2$\n*   **动能：** $E_k = mc^2 - m_0 c^2 = (\\gamma - 1)m_0 c^2$\n*   **动量：** $p = mv = \\gamma m_0 v$"
    },
    {
      "page": 64,
      "chapterId": "ch012",
      "chapterName": "量子物理基础：光量子与物质波",
      "knowledgePointId": "kp052",
      "knowledgePointName": "黑体辐射的经验定律",
      "content": "## 二、量子物理基础\n\n### 1. 黑体辐射\n\n*   **斯特潘-波尔兹曼定律：** $M = \\sigma T^4$ （$M$ 为辐出度/发射本领，$T$ 为温度，$\\sigma$ 为常数）\n*   **维恩位移定律：** $\\lambda_m \\cdot T = b$ （$\\lambda_m$ 为峰值波长，$b$ 为常数）\n\n### 2. 光的二象性与光电效应"
    },
    {
      "page": 65,
      "chapterId": "ch012",
      "chapterName": "量子物理基础：光量子与物质波",
      "knowledgePointId": "kp052",
      "knowledgePointName": "黑体辐射的经验定律",
      "content": "*   **光子能量：** $E = h\\nu = h\\frac{c}{\\lambda}$\n*   **光子动量：** $p = \\frac{E}{c} = \\frac{h}{\\lambda}$\n*   **光子质量：** $m = \\frac{h\\nu}{c^2} = \\frac{h}{c\\lambda}$\n*   **光强：** $I = nh\\nu = nh\\frac{c}{\\lambda}$ （$n$ 为光子个数）\n*   **普朗克常数：** $h = 6.63 \\times 10^{-34} \\, J\\cdot s$"
    },
    {
      "page": 66,
      "chapterId": "ch012",
      "chapterName": "量子物理基础：光量子与物质波",
      "knowledgePointId": "kp053",
      "knowledgePointName": "光子概念与光电效应",
      "content": "**光电效应方程（能量守恒）：**\n入射光能量 = 打出电子能量 + 逸出功\n$$h\\nu = eU_0 + h\\nu_0$$\n或者表示为：\n$$h\\frac{c}{\\lambda} = \\frac{1}{2}mv^2 + h\\frac{c}{\\lambda_0}$$\n*   $U_0$：截止电压（遏止电势差）\n*   $\\frac{1}{2}mv^2$：最大初动能\n*   $\\nu_0$：红限/截止频率\n*   $\\lambda_0$：红限波长\n*   **逸出功**取决于板本身（金属材质）。\n\n### 3. 康普顿效应（高能光子撞静止电子）"
    },
    {
      "page": 67,
      "chapterId": "ch012",
      "chapterName": "量子物理基础：光量子与物质波",
      "knowledgePointId": "kp053",
      "knowledgePointName": "光子概念与光电效应",
      "content": "波长增量公式：\n$$\\Delta \\lambda = \\lambda_{散} - \\lambda_{\\lambda} = \\frac{h}{m_e c}(1 - \\cos\\varphi) = 2.4 \\times 10^{-12}(1 - \\cos\\varphi)$$\n其中 $m_e$ 为电子质量。"
    },
    {
      "page": 68,
      "chapterId": "ch012",
      "chapterName": "量子物理基础：光量子与物质波",
      "knowledgePointId": "kp054",
      "knowledgePointName": "康普顿效应与光子碰撞",
      "content": "**能量守恒（不能带 $\\frac{1}{2}mv^2$，需考虑相对论）：**\n$$\\frac{hc}{\\lambda} + m_e c^2 = \\frac{hc}{\\lambda_{散}} + mc^2$$\n反冲电子动能：$E_k = mc^2 - m_e c^2 = \\frac{hc}{\\lambda} - \\frac{hc}{\\lambda_{散}}$"
    },
    {
      "page": 69,
      "chapterId": "ch012",
      "chapterName": "量子物理基础：光量子与物质波",
      "knowledgePointId": "kp054",
      "knowledgePointName": "康普顿效应与光子碰撞",
      "content": "**动量守恒：**\n*   $x$ 轴：$\\frac{h}{\\lambda} = \\frac{h}{\\lambda_{散}}\\cos\\varphi + mv\\cos\\theta$\n*   $y$ 轴：$0 = \\frac{h}{\\lambda_{散}}\\sin\\varphi - mv\\sin\\theta$\n其中，当 $\\varphi = 90^\\circ$ 时，反冲电子动量 $P = \\sqrt{(\\frac{h}{\\lambda_{散}})^2 + (\\frac{h}{\\lambda})^2}$"
    },
    {
      "page": 70,
      "chapterId": "ch012",
      "chapterName": "量子物理基础：光量子与物质波",
      "knowledgePointId": "kp055",
      "knowledgePointName": "德布罗意波与不确定关系",
      "content": "### 4. 德布罗意波（物质波）\n\n$$\\lambda = \\frac{h}{p} = \\frac{h}{mv}$$\n（速记：光 $p = \\frac{h}{\\lambda}$，只是量纲相同）\n\n**不确定关系：**\n$\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}$ （位移不确定量 $\\times$ 动量不确定量 $\\ge$ 某个常数）\n\n### 5. 波函数与薛定谔方程基础\n\n波函数 $\\Psi$（不用管它是什么，也不用管势阱是什么，先求概率密度函数）：\n概率密度函数：$f = |\\Psi|^2$ （结果可能是虚数，计算为 $(a+bi)(a-bi)$ 即可）"
    },
    {
      "page": 71,
      "chapterId": "ch012",
      "chapterName": "量子物理基础：光量子与物质波",
      "knowledgePointId": "kp056",
      "knowledgePointName": "波函数、概率密度与归一化",
      "content": "**归一化条件：**\n$$\\int_{-\\infty}^{+\\infty} f(x)dx = 1$$\n**$a \\to b$ 区间概率：**\n$$\\int_{a}^{b} f(x)dx$$\n基态：$n=1$；第一激发态：$n=2 \\dots$"
    },
    {
      "page": 72,
      "chapterId": "ch013",
      "chapterName": "原子结构：波尔模型与量子数",
      "knowledgePointId": "kp057",
      "knowledgePointName": "氢原子波尔理论与能级跃迁",
      "content": "## 三、原子结构理论\n\n### 1. 氢原子波尔理论\n\n*   **能级：** $E_n = \\frac{E_1}{n^2} = \\frac{-13.6}{n^2} \\, eV$\n*   **跃迁：** 从 $i$ 级跃迁至 $j$ 级所吸收/释放光子能量 $h\\nu = E_i - E_j = (- \\frac{13.6}{i^2} - (- \\frac{13.6}{j^2})) \\, eV$\n*   **电子角动量：** $L = n\\frac{h}{2\\pi}$\n*   **波尔半径：** $r_n = n^2 r_1$\n\n### 2. 氢原子量子理论"
    },
    {
      "page": 73,
      "chapterId": "ch013",
      "chapterName": "原子结构：波尔模型与量子数",
      "knowledgePointId": "kp058",
      "knowledgePointName": "量子数体系与壳层结构",
      "content": "*   **主量子数：** $n = 1, 2, 3 \\dots$\n*   **角量子数：** $l = 0, 1, 2, \\dots, (n-1)$\n*   **磁量子数：** $m = 0, \\pm 1, \\pm 2 \\dots \\pm l$\n*   **自旋量子数：** $m_s = \\pm 1/2$ （独立）\n\n**结论：**\n*   给定一个电子，$(n, l, m, m_s)$ 为一组量子数，是唯一的。\n*   K 壳层：$n=1$。\n*   仅 $n$ 一定时，其它量子数排列组合总数为：$2n^2$。"
    }
  ]
};
})();
