export const formatDate = (date: string, includeTime: boolean = false) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.toLocaleString("default", { month: "short" });
  const day = d.getDate();
  if (includeTime) {
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${year}, ${day} ${month} ${hours}:${minutes}`;
  }
  return `${year}, ${day} ${month}`;
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};
