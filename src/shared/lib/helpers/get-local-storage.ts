export const getLocalStorage = (key: string) => {
    try {
      const jsonString = window.localStorage.getItem(key);
      if (typeof jsonString === "string") {
        return JSON.parse(jsonString);
      }
      return null;
    } catch (error) {
      return null;
    }
  };
  