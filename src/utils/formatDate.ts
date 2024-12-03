export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
    // UTCからJST（日本時間）に変換
    const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = dayNames[date.getDay()];
  return `${month}/${day}(${weekDay})`; // 修正済み
};

  