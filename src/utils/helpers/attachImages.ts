export default function attachImages<T>(item: T[], fieldNames: string[]) {
  return item.map((i: any) => {
    const newItem = { ...i };
    fieldNames.forEach((field: any) => {
      if (newItem[field]) {
        newItem[field] = newItem[field].map((image: string) => {
          return `${process.env.BASE_URL}/uploads/${image}`;
        });
      }
    });
    return newItem;
  });
}
