import PropertiesReader from "properties-reader";
import path from "path";

export class PropertyReader {
 private static properties = PropertiesReader(
  path.resolve(__dirname, '../properties/OR.properties')
);

  static getProperty(key: string): string {
    const value = this.properties.get(key);
    if (!value) throw new Error(`Property '${key}' not found in OR.properties`);
    return value.toString().trim();
  }

  static getArrayProperty(key: string): string[] {
    const value = this.getProperty(key);
    return value.split(`,`).map(v => v.trim()).filter(v => v.length > 0);
  }
}
