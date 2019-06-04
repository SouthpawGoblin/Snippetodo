import UUID from '@/classes/UUID';

export default class MyTodo {
  public id: string;
  public content: string;
  public finished: boolean = false;

  constructor(content: string) {
    this.id = UUID.uuid();
    this.content = content;
  }
}