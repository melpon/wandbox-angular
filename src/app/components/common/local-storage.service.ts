import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService {
  private storage = localStorage;

  public getValue(key: string) {
    const item: string | null = this.storage.getItem(key);
    if (item == null) {
      return null;
    }
    return JSON.parse(item);
  }

  public setValue<T>(key: string, value: T) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public removeValue(key: string) {
    this.storage.setItem(key, "null");
  }

  public hasValue(key: string) {
    return this.getValue(key) != null;
  }
}
