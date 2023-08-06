/**
 * 開発用デバッグログの出力
 * @param message {string} 出力するメッセージ
 */
export const devLog = (message: string) => {
  console.log(`##### ${message}`);
}

/**
 * 開発用デバッグログの出力
 * @param obj {any} オブジェクト
 * @param indent { string} インデント
 */
export const debugObj =  (obj: any, indent: string = "") => {
    // Handle null, undefined, strings, and non-objects.
    if (obj === null) return "null";
    if (obj === undefined) return "undefined";
    if (typeof obj === "string") return '"' + obj + '"';
    if (typeof obj !== "object") return String(obj);

    if (indent === undefined) indent = "";

    // Handle (non-null) objects.
    var str = "{\n";
    for (var key in obj) {
        str += indent + "  " + key + " = ";
        str += debugObj(obj[key], indent + "  ") + "\n";
    }
    return str + indent + "}";
};
