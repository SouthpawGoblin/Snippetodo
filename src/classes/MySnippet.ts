import UUID from '@/classes/UUID';

export default class MySnippet {
  public id: string;
  public title: string;
  public content: string;

  constructor(title: string, content: string) {
    this.id = UUID.uuid();
    this.title = title;
    this.content = content;
  }
}