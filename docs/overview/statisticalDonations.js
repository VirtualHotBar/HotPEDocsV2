
const markdownUrl = 'https://cdn.jsdelivr.net/gh/VirtualHotBar/HotPEDocsV2/docs/overview/donate.md';

// 使用 fetch 获取 Markdown 文件内容
fetch(markdownUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  })
  .then(markdownContent => {

    // 将内容按换行符分割，得到每一行
    const lines = markdownContent.split('\n');

    // 初始化按年份存储金额的对象
    let amountsByYear = {};

    // 从每一行提取金额以及日期，按年份分组累计金额
    lines.forEach(line => {
      // 检查是否是捐赠数据行
      if (line.startsWith('|') && !line.endsWith('|')) {
        // 提取捐赠金额和日期
        const columns = line.split('|');
        const amountString = columns[2].trim(); // 假设金额总是在第三列
        const dateString = columns[3].trim(); // 假设日期总是在第四列

        // 提取年份
        const yearMatch = dateString.match(/\d{2}-(\d{2})-\d{2}/)[0].split('-')[0];

        if (yearMatch) {
          const year = `20${yearMatch}`; // 假设为21世纪的年份


          // 将金额字符串转换为数字
          const amount = parseFloat(amountString);
          if (!isNaN(amount)) {
            if (!amountsByYear[year]) {
              // 如果该年份不在对象中，则初始化金额为0
              amountsByYear[year] = 0;
            }
            // 累加金额到对应的年份
            amountsByYear[year] += amount;

            // 保留两位小数
            amountsByYear[year] = Math.round((amountsByYear[year] + Number.EPSILON) * 100) / 100;
          }
        }
      }
    });


    // 计算总捐赠金额
    let totalDonation = 0;
    for (const year in amountsByYear) {
      totalDonation += amountsByYear[year];
    }

    console.log('按年份分组的捐赠金额:', amountsByYear, '\n总捐赠金额:', totalDonation);

  })
  .catch(e => {
    console.error('Fetch error: ' + e.message);
  });



