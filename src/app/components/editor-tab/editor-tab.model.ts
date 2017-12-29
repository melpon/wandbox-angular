export class TabModel {
  public isActive: boolean;
  public editing: boolean;
  public fileName: string;
  public editorContent: string;
}

export interface ITabChangedEvent {
  index: number;
  data: TabModel;
}
