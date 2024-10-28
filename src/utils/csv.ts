export const exportAsCSV = (data: string, fileName: string) => {
  const csvContent = "data:text/csv;charset=utf8," + data;
  const encodedURI = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedURI);
  link.setAttribute("download", fileName);
  document.body.append(link);
  link.click();
};
