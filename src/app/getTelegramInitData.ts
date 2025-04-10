// utils/getTelegramInitData.ts

export function getTelegramInitData(): Record<string, string> | null {
    if (typeof window === "undefined") return null;
  
    const urlParams = new URLSearchParams(window.location.search);
    const initData = urlParams.get("tgWebAppData") || urlParams.get("initData");
  
    if (!initData) return null;
  
    // Parse initData like key1=value1&key2=value2
    const data: Record<string, string> = {};
    initData.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      data[key] = decodeURIComponent(value || "");
    });
  
    // Show alert here directly
    if (data.first_name) {
      alert(`Assalomu alaykum, ${data.first_name}!`);
    }
  
    return data;
  }
  